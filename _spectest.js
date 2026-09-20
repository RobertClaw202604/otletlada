/* ============================================================
   _spectest.js — a specifikáció-oldal ellenőrzése valódi Chrome-ban
   Futtatás: node _spectest.js  (előtte: python3 -m http.server 8903)
   ============================================================ */

const { spawn } = require("child_process");
const http = require("http");
const WebSocket = require("ws");

const PORT = 9223;
const URL = "http://localhost:8903/spec-zaszlo-abc.html";

function kesleltet(ms) { return new Promise(r => setTimeout(r, ms)); }

function httpGet(u) {
  return new Promise((res, rej) => {
    http.get(u, r => { let d = ""; r.on("data", c => d += c); r.on("end", () => res(d)); })
      .on("error", rej);
  });
}

(async () => {
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new", "--remote-debugging-port=" + PORT, "--no-first-run",
    "--no-default-browser-check", "--disable-gpu",
    "--user-data-dir=/tmp/chrome-spec-" + Date.now()
  ], { stdio: "ignore" });

  let cel = null;
  for (let i = 0; i < 40; i++) {
    try {
      const j = JSON.parse(await httpGet("http://localhost:" + PORT + "/json/list"));
      cel = j.find(t => t.type === "page");
      if (cel) break;
    } catch (e) {}
    await kesleltet(400);
  }
  if (!cel) { console.error("Nem indult a Chrome"); chrome.kill(); process.exit(1); }

  const ws = new WebSocket(cel.webSocketDebuggerUrl);
  let id = 0;
  const varak = {};
  let logs = [];

  ws.on("message", m => {
    const j = JSON.parse(m);
    if (j.id && varak[j.id]) { varak[j.id](j); delete varak[j.id]; }
    if (j.method === "Runtime.consoleAPICalled" && j.params.type === "error")
      logs.push((j.params.args || []).map(a => a.value).join(" "));
    if (j.method === "Runtime.exceptionThrown")
      logs.push(j.params.exceptionDetails.text + " " +
        (j.params.exceptionDetails.exception || {}).description);
  });

  const parancs = (method, params = {}) => new Promise(res => {
    const i = ++id; varak[i] = res;
    ws.send(JSON.stringify({ id: i, method, params }));
  });

  await new Promise(r => ws.on("open", r));
  await parancs("Runtime.enable");
  await parancs("Page.enable");
  await parancs("Network.enable");
  await parancs("Network.setCacheDisabled", { cacheDisabled: true });

  const ev = async (expr) => {
    const r = await parancs("Runtime.evaluate", {
      expression: expr, returnByValue: true, awaitPromise: true
    });
    if (r.result && r.result.exceptionDetails)
      return { err: r.result.exceptionDetails.text };
    return { val: r.result.result.value };
  };

  let ok = 0, hiba = 0;
  const ell = (nev, felt) => {
    if (felt) { console.log("✓ " + nev); ok++; }
    else { console.log("✗ " + nev); hiba++; }
  };

  await parancs("Page.navigate", { url: URL });
  await kesleltet(2200);

  const cim = await ev("document.title");
  ell("a spec-oldal betöltött", typeof cim.val === "string" && cim.val.includes("specifikáció"));

  const kezdet = await ev("document.getElementById('tartalom').textContent.trim().slice(0,20)");
  const vane = await ev("document.getElementById('tartalom').textContent.includes('Egy böngészőben futó mini weboldal')");
  ell("a tartalom renderelődött (a fallback eltűnt, a spec benne van)",
    kezdet.val !== "Betöltés…" && vane.val === true);

  const h1 = await ev("document.querySelectorAll('#tartalom h1').length");
  ell("van főcím (h1)", h1.val === 1);

  const h2 = await ev("document.querySelectorAll('#tartalom h2').length");
  ell("a tíz szakasz megjelenik (h2: " + h2.val + ")", h2.val === 10);

  const tabl = await ev("document.querySelectorAll('#tartalom table').length");
  ell("a táblázatok renderelődtek (" + tabl.val + ")", tabl.val >= 5);

  const th = await ev("document.querySelectorAll('#tartalom table th').length");
  ell("a táblázatoknak fejlécük van (" + th.val + ")", th.val >= 12);

  const li = await ev("document.querySelectorAll('#tartalom li').length");
  ell("a felsorolások megjelennek (" + li.val + ")", li.val >= 25);

  const kod = await ev("document.querySelectorAll('#tartalom pre code').length");
  ell("a kódblokk renderelődött (" + kod.val + ")", kod.val >= 1);

  const kodBent = await ev("document.getElementById('tartalom').textContent");
  ell("a kódblokk tartalma megjelenik (nem nyers backtick)",
    kodBent.val.includes("eltolás(x, t)") && !kodBent.val.includes("```"));

  const strong = await ev("document.querySelectorAll('#tartalom strong').length");
  ell("a félkövér kiemelések megjelennek (" + strong.val + ")", strong.val >= 25);

  const hr = await ev("document.querySelectorAll('#tartalom hr').length");
  ell("a szakasz-elválasztók megjelennek (" + hr.val + ")", hr.val >= 8);

  /* a kulcstartalom ellenőrzése */
  const sz = await ev("document.getElementById('tartalom').textContent");
  ell("tartalmazza a zászlókészletet", sz.val.includes("Nemzetközi jelzőzászlók"));
  ell("tartalmazza a lobogás-képletet", sz.val.includes("szinusz-görbe"));
  ell("tartalmazza a három módot", sz.val.includes("Sorban, egymás mellett") &&
    sz.val.includes("Egyesével, egymás után") && sz.val.includes("Videó"));
  ell("tartalmazza a mérföldköveket", sz.val.includes("Zászlókészlet"));
  ell("tartalmazza a nyitott kérdéseket", sz.val.includes("Melyik zászlórendszer"));
  ell("tartalmazza a kockázatokat", sz.val.includes("A lobogás nem lesz meggyőző"));

  /* a vissza-link működik-e */
  const vissza = await ev("document.querySelector('.topbar a').getAttribute('href')");
  ell("van vissza-link az Ötletlátába", vissza.val === "./");

  ell("nincs JavaScript hiba", logs.length === 0);
  if (logs.length) console.log("HIBAK: " + logs.join(" | "));

  console.log("\n" + ok + "/" + (ok + hiba) + " teszt sikeres a specifikáció-oldalon");

  ws.close(); chrome.kill();
  process.exit(hiba ? 1 : 0);
})();
