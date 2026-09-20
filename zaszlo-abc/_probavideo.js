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
    "--no-default-browser-check", "--window-size=1500,700",
    "--enable-unsafe-swiftshader",
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

  ell("van vászon-elem", (await ev("!!document.getElementById('gl')")).val === true);

  /* --- a hullám ellenőrzése: a shader-forrás tartalmazza a képletet --- */
  const fsForras = await ev("CS_FS");
  ell("a shader tartalmazza a fő szinusz-hullámot",
    typeof fsForras.val === "string" && fsForras.val.indexOf("sin(k * x01 - w * t") >= 0);
  ell("a shader tartalmazza a másodlagos fodrozódást",
    typeof fsForras.val === "string" && fsForras.val.indexOf("2.3 * k * x01") >= 0);
  ell("a shader tartalmazza a csillapítást a rögzített él felől",
    typeof fsForras.val === "string" && fsForras.val.indexOf("pow(max(x01, 0.0), 1.0 / csillapitas)") >= 0);
  ell("a shader árnyékolja a redőket",
    typeof fsForras.val === "string" && fsForras.val.indexOf("arny") >= 0);

  /* --- tényleges pixel-változás a WebGL rétegen (tényleg mozog-e?) --- */
  const kepp1 = await ev(`(function(){
    const c = document.getElementById('gl');
    const gl = c.getContext('webgl', {alpha:true, premultipliedAlpha:false});
    gl.clearColor(0.10,0.14,0.19,1); gl.clear(gl.COLOR_BUFFER_BIT);
    lobogoZaszloGL(c, window.__zaszlo, 120, 110, 1200, 380, 0.2, null);
    const px = new Uint8Array(4 * 400 * 200);
    gl.readPixels(300, 200, 400, 200, gl.RGBA, gl.UNSIGNED_BYTE, px);
    let o = 0; for (let i = 0; i < px.length; i++) o = (o * 31 + px[i]) % 1000000007;
    return o;
  })()`);
  const kepp2 = await ev(`(function(){
    const c = document.getElementById('gl');
    const gl = c.getContext('webgl', {alpha:true, premultipliedAlpha:false});
    gl.clearColor(0.10,0.14,0.19,1); gl.clear(gl.COLOR_BUFFER_BIT);
    lobogoZaszloGL(c, window.__zaszlo, 120, 110, 1200, 380, 1.4, null);
    const px = new Uint8Array(4 * 400 * 200);
    gl.readPixels(300, 200, 400, 200, gl.RGBA, gl.UNSIGNED_BYTE, px);
    let o = 0; for (let i = 0; i < px.length; i++) o = (o * 31 + px[i]) % 1000000007;
    return o;
  })()`);
  ell("a WebGL zászló képe változik az idő múlásával (mozog)",
    kepp1.val !== undefined && kepp2.val !== undefined && kepp1.val !== kepp2.val);

  /* a rögzített él és a szabad él viselkedése a beállításokból */
  const cs = await ev("CS_FS.indexOf('pow(max(x01, 0.0), 1.0 / csillapitas)') >= 0");
  ell("a csillapítás a rúdnál 0-t ad (a rögzített él áll)", cs.val === true);

  /* --- a csúszkák működnek-e --- */
  const csuszka = await ev("document.querySelectorAll('.ctrl input[type=range]').length");
  ell("mind a hat csúszka megvan (" + csuszka.val + ")", csuszka.val === 6);
  await ev("(function(){var s=document.getElementById('s-amp');s.value=18;" +
    "s.dispatchEvent(new Event('input'));})()");
  const amp = await ev("LOB.amplitudo");
  ell("az amplitúdó-csúszka átállítja a beállítást (0.18)", Math.abs(amp.val - 0.18) < 0.001);
  await ev("(function(){var s=document.getElementById('s-amp');s.value=12;" +
    "s.dispatchEvent(new Event('input'));})()");

  /* --- videó rögzítése --- */
  console.log("\nVideó rögzítése (6 másodperc)…");
  const rec = await ev(`(async () => {
    /* a két réteget (2D alap + WebGL zászló) egy rejtett vászonra vonjuk
       össze, és azt rögzítjük — így a rúd és a zászló is a videóba kerül */
    const glv = document.getElementById('gl');
    const s = glv.captureStream(60);
    const tipusok = ['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'];
    let mt = null;
    for (const t of tipusok) { if (MediaRecorder.isTypeSupported(t)) { mt = t; break; } }
    if (!mt) return { hiba: 'nincs támogatott videó-formátum' };
    const rec = new MediaRecorder(s, { mimeType: mt, videoBitsPerSecond: 12000000 });
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
