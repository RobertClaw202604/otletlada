/* Miért nem látja a böngésző az új adatot? */
const { spawn } = require("child_process");
const http = require("http");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9228;
const URL_ = "https://robertclaw202604.github.io/otletlada/";

function get(p) {
  return new Promise((res, rej) => {
    http.get({ host: "127.0.0.1", port: PORT, path: p }, r => {
      let d = ""; r.on("data", c => d += c); r.on("end", () => res(d));
    }).on("error", rej);
  });
}

(async () => {
  const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=" + PORT,
    "--no-first-run", "--disable-gpu", "--user-data-dir=/tmp/chrome-diag2", "about:blank"],
    { stdio: "ignore", detached: true });
  await new Promise(r => setTimeout(r, 2500));
  let t;
  for (let i = 0; i < 20; i++) { try { t = JSON.parse(await get("/json/list")); break; } catch (e) { await new Promise(r => setTimeout(r, 500)); } }
  const page = t.find(x => x.type === "page");
  const WebSocket = require("ws");
  const ws = new WebSocket(page.webSocketDebuggerUrl, { perMessageDeflate: false });
  let id = 0; const w = new Map();
  ws.on("message", raw => { const m = JSON.parse(raw); if (m.id && w.has(m.id)) { w.get(m.id)(m); w.delete(m.id); } });
  const send = (m, p) => new Promise(res => { const i = ++id; w.set(i, res); ws.send(JSON.stringify({ id: i, method: m, params: p || {} })); });
  const ev = async e => {
    const r = await send("Runtime.evaluate", { expression: e, awaitPromise: true, returnByValue: true });
    if (r.result?.exceptionDetails) return "ERR: " + r.result.exceptionDetails.exception?.description;
    return r.result?.result?.value;
  };

  await new Promise(r => ws.on("open", r));
  await send("Runtime.enable");
  await send("Page.navigate", { url: URL_ + "?cb=" + Date.now() });
  await new Promise(r => setTimeout(r, 6000));

  const R = [];
  R.push("PROJEKTEK.length = " + await ev("typeof PROJEKTEK !== 'undefined' ? PROJEKTEK.length : 'nincs PROJEKTEK'"));
  R.push("kartyak = " + await ev("document.querySelectorAll('#grid .card').length"));
  R.push("a projektek.js utolso id-je = " + await ev("typeof PROJEKTEK !== 'undefined' ? PROJEKTEK[PROJEKTEK.length-1].id : '-'"));
  R.push("van-e ai-tudas-teszt = " + await ev("typeof PROJEKTEK !== 'undefined' ? PROJEKTEK.some(p=>p.id==='ai-tudas-teszt') : '-'"));

  /* direktben lekerjuk a projektek.js-t a bongeszon belul */
  R.push("fetch(projektek.js) id-szam = " + await ev(
    "(async()=>{const r=await fetch('projektek.js?cb='+Date.now(),{cache:'no-store'});const t=await r.text();return (t.match(/^    id:/gm)||[]).length})()"
  ));
  /* es a cache nelkuli meret */
  R.push("a HTML-ben a script-sor = " + await ev(
    "Array.from(document.querySelectorAll('script')).map(s=>s.getAttribute('src')).join(',')"
  ));

  console.log(R.join("\n"));

  await send("Page.close").catch(() => {});
  ws.close();
  try { process.kill(-chrome.pid); } catch (e) {}
})();
