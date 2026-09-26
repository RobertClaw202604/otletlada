/* Drag & drop sorrend-teszt — CDP-vel. */
const { spawn } = require("child_process");
const http = require("http");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9271;
const PROFILE = "/tmp/chrome-otl-dnd-" + Date.now();
const BASE = "http://localhost:8903/index.html";
const WS_MODULE = "/Users/robert/.openclaw/workspace/node_modules/ws";

function get(p) {
  return new Promise((res, rej) => {
    http.get({ host: "127.0.0.1", port: PORT, path: p }, r => {
      let d = ""; r.on("data", c => d += c); r.on("end", () => res(d));
    }).on("error", rej);
  });
}

(async () => {
  const chrome = spawn(CHROME, [
    "--headless=new", "--remote-debugging-port=" + PORT,
    "--no-first-run", "--no-default-browser-check", "--disable-gpu",
    "--user-data-dir=" + PROFILE, "about:blank"
  ], { stdio: "ignore", detached: true });
  await new Promise(r => setTimeout(r, 3000));

  let t;
  for (let i = 0; i < 21; i++) {
    try { t = JSON.parse(await get("/json/list")); break; }
    catch (e) { await new Promise(r => setTimeout(r, 500)); }
  }
  const page = t.find(x => x.type === "page");
  const WebSocket = require(WS_MODULE);
  const ws = new WebSocket(page.webSocketDebuggerUrl, { perMessageDeflate: false });
  let id = 0; const w = new Map(); const logs = [];
  ws.on("message", raw => {
    const m = JSON.parse(raw);
    if (m.id && w.has(m.id)) { w.get(m.id)(m); w.delete(m.id); }
    if (m.method === "Runtime.exceptionThrown") logs.push("EXCEPTION: " + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
    if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") logs.push("console.error: " + m.params.args.map(a => a.value ?? a.description ?? "").join(" "));
  });
  const send = (method, params) => new Promise(res => { const i = ++id; w.set(i, res); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
  const ev = async (e, env) => {
    const r = await send("Runtime.evaluate", {
      expression: e, awaitPromise: true, returnByValue: true,
      ...(env ? { includeCommandLineAPI: true } : {})
    });
    if (r.result?.exceptionDetails) return { err: r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text };
    return { val: r.result?.result?.value };
  };

  await new Promise(r => ws.on("open", r));
  await send("Runtime.enable");
  await send("Network.setCacheDisabled", { cacheDisabled: true });
  await send("Page.enable");
  await send("Page.navigate", { url: BASE });
  await new Promise(r => setTimeout(r, 2500));

  const R = [], ok = (n, c) => { R.push((c ? "✓" : "✗") + " " + n); return c; };
  const ids = async () => (await ev("Array.from(document.querySelectorAll('#grid .card')).map(c=>c.dataset.id)")).val;
  const poz = async sel => {
    const script = '(function(){var e=document.querySelector(' + JSON.stringify(sel) + ');' +
      'if(!e){return "NINCS-ELEM"}var b=e.getBoundingClientRect();' +
      'return "OK:"+Math.round(b.x)+","+Math.round(b.y)+","+Math.round(b.width)+","+Math.round(b.height)})()';
    const out = await ev(script);
    if (out.err) throw new Error("poz(" + sel + "): " + out.err);
    const s = String(out.val);
    if (s.indexOf("OK:") !== 0) throw new Error("poz(" + sel + "): " + s + " | script: " + script);
    const parts = s.slice(3).split(",").map(Number);
    const x = parts[0], y = parts[1], w = parts[2], h = parts[3];
    return { x: x, y: y, w: w, h: h, cx: x + w / 2, cy: y + h / 2, rx: x + w * 0.75, ry: y + h * 0.7 };
  };
  let r;

  r = await ev("document.querySelectorAll('#grid .card').length");
  ok("21 kártya renderelve (" + r.val + ")", r.val === 21);
  const kezdo = await ids();
  ok("a kártyáknak van data-id-jük", kezdo.every(Boolean));
  r = await ev("!!document.querySelector('#grid .card .fh')");
  ok("minden kártyán van fogantyú", r.val === true);

  await ev("document.getElementById('n-rendez').click()");
  r = await ev("document.body.classList.contains('rendez')");
  ok("az „Átrendezés” gomb bekapcsolja a módot", r.val === true);
  r = await ev("document.getElementById('rendezInfo').offsetHeight > 0");
  ok("megjelenik a tájékoztató sáv", r.val === true);

  /* a húzott kártyát a 3. helyére dobjuk */
  const huzott = kezdo[0], celId = kezdo[2];
  const fh = await poz('.card[data-id="' + huzott + '"] .fh') || {};
  const cel = await poz('.card[data-id="' + celId + '"]') || {};
  ok("a húzott kártya pozíciója megvan", !!fh.rx);
  ok("a cél kártya pozíciója megvan", !!cel.rx && cel.rx > 0);

  const script =
    "(() => {\n" +
    "  const fh = document.querySelector('.card[data-id=\"" + huzott + "\"] .fh');\n" +
    "  if (!fh) return 'NINCS-FH';\n" +
    "  const dt = new DataTransfer();\n" +
    "  fh.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: dt }));\n" +
    "  const g = document.getElementById('grid');\n" +
    "  g.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dt, clientX: " + cel.rx + ", clientY: " + cel.ry + " }));\n" +
    "  fh.dispatchEvent(new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer: dt }));\n" +
    "  return 'ok';\n" +
    "})()";
  r = await ev(script);
  ok("a drag események hiba nélkül lefutnak", r.val === "ok", r.err || JSON.stringify(r.val) + (r.desc || ""));

  await new Promise(r2 => setTimeout(r2, 450));
  const uj = await ids();
  ok("a húzott kártya a megcélzott helyre került (" + uj.indexOf(huzott) + ". index, cél: 2)", uj.indexOf(huzott) === 2);
  ok("a cél kártya a húzott alá került", uj[uj.indexOf(huzott) - 1] === celId);
  ok("a sorrend tényleg megváltozott", uj.join() !== kezdo.join());

  r = await ev("JSON.parse(localStorage.getItem('otletlada.web.v1')||'{}')._order");
  ok("a sorrend bekerült a localStorage-ba (" + (r.val ? r.val.length : 0) + " elem)", Array.isArray(r.val) && r.val.length === 21);
  ok("a mentett sorrend egyezik a látottal", r.val && r.val.join() === uj.join());

  await send("Page.navigate", { url: BASE });
  await new Promise(r2 => setTimeout(r2, 2400));
  const ujra = await ids();
  ok("újratöltés után is ugyanaz a sorrend", ujra.join() === uj.join());
  r = await ev("document.body.classList.contains('rendez')");
  ok("az átrendezés mód is megmarad", r.val === true);

  await ev("document.querySelector('.card[data-id=" + JSON.stringify(ujra[0]) + "] .fh').focus()");
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowRight", code: "ArrowRight", windowsVirtualKeyCode: 39 });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowRight", code: "ArrowRight", windowsVirtualKeyCode: 39 });
  await new Promise(r2 => setTimeout(r2, 450));
  const kb = await ids();
  ok("nyíl billentyűvel is mozog (" + kb.indexOf(ujra[0]) + ". index)", kb.indexOf(ujra[0]) === 1);

  await ev("document.querySelector('.chip[data-f=\"mukodo\"]').click()");
  await new Promise(r2 => setTimeout(r2, 400));
  r = await ev("document.querySelectorAll('#grid .card').length");
  const db = r.val;
  ok("szűrő nézetben is renderel (" + db + " kártya)", db > 0);
  r = await ev("document.querySelectorAll('#grid .card .fh').length");
  ok("szűrő nézetben minden kártyán van fogantyú", r.val === db);
  await ev("document.querySelector('.chip[data-f=\"mind\"]').click()");
  await new Promise(r2 => setTimeout(r2, 300));

  await ev("resetOrder()");
  await new Promise(r2 => setTimeout(r2, 400));
  const alap = await ids();
  const forras = (await ev("PROJEKTEK.map(p=>p.id)")).val;
  ok("az „Eredeti sorrend” visszaadja a projektek.js sorrendjét", alap.join() === forras.join());
  r = await ev("JSON.parse(localStorage.getItem('otletlada.web.v1')||'{}')._order");
  ok("a visszaállítás törli a mentett sorrendet", r.val === undefined);

  await ev("document.getElementById('n-rendez').click()");
  r = await ev("document.body.classList.contains('rendez')");
  ok("a „Kész” gomb kikapcsolja az átrendezés módot", r.val === false);

  ok("nincs JavaScript hiba", logs.length === 0);
  if (logs.length) console.log("\nHIBA-LOG:\n" + logs.join("\n"));

  console.log("\n--- RÉSZLETES ---");
  R.forEach(x => console.log(x));
  const jok = R.filter(x => x[0] === "✓").length;
  console.log("\n" + jok + "/" + R.length + " teszt sikeres");
  await new Promise(r2 => setTimeout(r2, 200));
  try { process.kill(-chrome.pid); } catch (e) {}
  process.exit(jok === R.length ? 0 : 1);
})();
