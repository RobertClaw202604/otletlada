/* ============================================================
   _probavideo.js — a lobogás rögzítése videóba (valódi Chrome)
   Futtatás: node _probavideo.js
   Kimenet: proba-lobogas.webm
   ============================================================ */

const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const PORT = 9230;
const URL = "http://localhost:8904/proba.html";

function httpGet(u) {
  return new Promise((res, rej) => {
    http.get(u, r => { let d = ""; r.on("data", c => d += c); r.on("end", () => res(d)); })
      .on("error", rej);
  });
}
const kes = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new", "--remote-debugging-port=" + PORT, "--no-first-run",
    "--no-default-browser-check", "--disable-gpu", "--window-size=1500,700",
    "--user-data-dir=/tmp/chrome-zaszlo-" + Date.now()
  ], { stdio: "ignore" });

  let cel = null;
  for (let i = 0; i < 40; i++) {
    try {
      const j = JSON.parse(await httpGet("http://localhost:" + PORT + "/json/list"));
      cel = j.find(t => t.type === "page");
      if (cel) break;
    } catch (e) {}
    await kes(400);
  }
  if (!cel) { console.error("Nem indult a Chrome"); chrome.kill(); process.exit(1); }

  const ws = new WebSocket(cel.webSocketDebuggerUrl, { maxPayload: 200 * 1024 * 1024 });
  let id = 0;
  const varak = {};
  const hibak = [];

  ws.on("message", m => {
    const j = JSON.parse(m);
    if (j.id && varak[j.id]) { varak[j.id](j); delete varak[j.id]; }
    if (j.method === "Runtime.exceptionThrown")
      hibak.push(j.params.exceptionDetails.text + " " +
        ((j.params.exceptionDetails.exception || {}).description || ""));
    if (j.method === "Runtime.consoleAPICalled" && j.params.type === "error")
      hibak.push((j.params.args || []).map(a => a.value).join(" "));
  });

  const P = (method, params = {}) => new Promise(res => {
    const i = ++id; varak[i] = res;
    ws.send(JSON.stringify({ id: i, method, params }));
  });

  await new Promise(r => ws.on("open", r));
  await P("Runtime.enable");
  await P("Page.enable");
  await P("Network.enable");
  await P("Network.setCacheDisabled", { cacheDisabled: true });

  const ev = async (expr, awaitP = false) => {
    const r = await P("Runtime.evaluate", {
      expression: expr, returnByValue: true, awaitPromise: awaitP
    });
    if (r.result && r.result.exceptionDetails)
      return { err: r.result.exceptionDetails.text };
    return { val: r.result.result.value };
  };

  await P("Page.navigate", { url: URL });
  await kes(3000);

  let ok = 0, hiba = 0;
  const ell = (nev, felt) => {
    if (felt) { console.log("✓ " + nev); ok++; }
    else { console.log("✗ " + nev); hiba++; }
  };

  /* --- a zászlókészlet teljessége --- */
  const db = await ev("Object.keys(ZASZLOK).filter(k=>k!==' '&&k!=='?').length");
  ell("megvan mind a 36 zászló (" + db.val + ")", db.val === 36);

  const betuk = await ev("'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').every(b=>ZASZLOK[b])");
  ell("mind a 26 betű megvan", betuk.val === true);
  const szamok = await ev("'0123456789'.split('').every(b=>ZASZLOK[b])");
  ell("mind a 10 számjegy megvan", szamok.val === true);

  const ures = await ev("Object.keys(ZASZLOK).filter(k=>k!==' '&&k!=='?'&&!ZASZLOK[k]).length");
  ell("egyetlen zászló sincs üresen", ures.val === 0);

  /* --- a canvas és a kép betöltése --- */
  const kész = await ev("!!kep && kep.width > 0");
  ell("a zászló betöltődött a vászonra (kép: " +
    (await ev("kep ? kep.width+'x'+kep.height : 'nincs'")).val + ")", kész.val === true);

  ell("van vászon-elem", (await ev("!!document.getElementById('vaszon')")) === true);

  /* --- a mozgás ellenőrzése: két különböző pillanatban más a hullám --- */
  const e1 = await ev("JSON.stringify(hullamEltolas(1.0, 0))");
  const e2 = await ev("JSON.stringify(hullamEltolas(1.0, 0.5))");
  ell("a hullám az idővel változik", e1.val !== e2.val);

  /* a vászon tényleges torzulásának mérése: a zászló széle mozog-e */
  const el2 = await ev(`(function(){
    const p1 = [], p2 = [];
    for (let i = 0; i <= 20; i++) {
      p1.push(hullamEltolas(i/20, 0.2).dx);
      p2.push(hullamEltolas(i/20, 0.9).dx);
    }
    let max = 0;
    for (let i = 0; i <= 20; i++) max = Math.max(max, Math.abs(p1[i] - p2[i]));
    return max;
  })()`);
  ell("a zászló érdemben mozog (max eltolás-különbség: " +
    (el2.val !== undefined ? el2.val.toFixed(3) : "?") + ")", el2.val > 0.15);
  const e3 = await ev("hullamEltolas(0, 0.3).cs");
  ell("a rögzített él nem mozdul (csillapítás=0 a rúdnál)", e3.val === 0);
  const e4 = await ev("hullamEltolas(1, 0.3).cs");
  ell("a szabad él mozog a legnagyobbat (csillapítás=1)", e4.val === 1);
  const e5 = await ev("Math.abs(hullamEltolas(1,0.3).dx) <= 1.001");
  ell("a szabad él eltolása a megengedett tartományban", e5.val === true);

  /* --- tényleges pixel-változás a vásznon (tényleg mozog-e?) --- */
  const kepp1 = await ev("vaszon.toDataURL().length");
  await kes(700);
  const kepp2 = await ev("vaszon.toDataURL().length");
  ell("a vászon képe változik az idő múlásával (mozog)",
    kepp1.val > 1000 && kepp2.val > 1000 && kepp1.val !== kepp2.val);

  /* --- a csúszkák működnek-e --- */
  const csuszka = await ev("document.querySelectorAll('.ctrl input[type=range]').length");
  ell("mind a hat csúszka megvan (" + csuszka.val + ")", csuszka.val === 6);
  await ev("(function(){var s=document.getElementById('s-amp');s.value=15;" +
    "s.dispatchEvent(new Event('input'));})()");
  const amp = await ev("LOB.amplitudo");
  ell("az amplitúdó-csúszka átállítja a beállítást (0.15)", Math.abs(amp.val - 0.15) < 0.001);
  await ev("(function(){var s=document.getElementById('s-amp');s.value=7;" +
    "s.dispatchEvent(new Event('input'));})()");

  /* --- videó rögzítése --- */
  console.log("\nVideó rögzítése (6 másodperc)…");
  const rec = await ev(`(async () => {
    const v = document.getElementById('vaszon');
    const s = v.captureStream(30);
    const tipusok = ['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'];
    let mt = null;
    for (const t of tipusok) { if (MediaRecorder.isTypeSupported(t)) { mt = t; break; } }
    if (!mt) return { hiba: 'nincs támogatott videó-formátum' };
    const rec = new MediaRecorder(s, { mimeType: mt, videoBitsPerSecond: 6000000 });
    const darabok = [];
    rec.ondataavailable = e => { if (e.data.size) darabok.push(e.data); };
    rec.start(200);
    await new Promise(r => setTimeout(r, 6000));
    await new Promise(r => { rec.onstop = r; rec.stop(); });
    const blob = new Blob(darabok, { type: mt });
    const buf = await blob.arrayBuffer();
    const bajtok = new Uint8Array(buf);
    let b64 = '';
    const cs = 8192;
    for (let i = 0; i < bajtok.length; i += cs) {
      b64 += String.fromCharCode.apply(null, bajtok.subarray(i, i + cs));
    }
    return { mime: mt, meret: blob.size, b64: btoa(b64) };
  })()`, true);

  if (rec.val && rec.val.b64) {
    const ki = path.join(__dirname, "proba-lobogas.webm");
    fs.writeFileSync(ki, Buffer.from(rec.val.b64, "base64"));
    const mb = (rec.val.meret / 1024 / 1024).toFixed(2);
    ell("a videó elkészült (" + rec.val.mime + ", " + mb + " MB)", rec.val.meret > 50000);
    console.log("  → " + ki);
  } else {
    ell("a videó elkészült", false);
    console.log("  HIBA: " + JSON.stringify(rec.val || rec.err));
  }

  ell("nincs JavaScript hiba", hibak.length === 0);
  if (hibak.length) console.log("HIBAK: " + hibak.join(" | "));

  console.log("\n" + ok + "/" + (ok + hiba) + " teszt sikeres");
  ws.close();
  chrome.kill();
  process.exit(hiba ? 1 : 0);
})();
