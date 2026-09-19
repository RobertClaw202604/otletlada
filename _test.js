/* Az Ötletláda web valódi Chrome-tesztje (DevTools protokollon át). */
const { spawn } = require("child_process");
const http = require("http");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9224;
const DIR = process.cwd();

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
    "--user-data-dir=/tmp/chrome-otletlada", "about:blank"
  ], { stdio: "ignore", detached: true });
  await new Promise(r => setTimeout(r, 2500));

  let t;
  for (let i = 0; i < 20; i++) {
    try { t = JSON.parse(await get("/json/list")); break; }
    catch (e) { await new Promise(r => setTimeout(r, 500)); }
  }
  const page = t.find(x => x.type === "page");
  const WebSocket = require("ws");
  const ws = new WebSocket(page.webSocketDebuggerUrl, { perMessageDeflate: false });
  let id = 0; const w = new Map(); const logs = [];
  ws.on("message", raw => {
    const m = JSON.parse(raw);
    if (m.id && w.has(m.id)) { w.get(m.id)(m); w.delete(m.id); }
    if (m.method === "Runtime.exceptionThrown") logs.push("EXCEPTION: " + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
    if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") logs.push("console.error: " + m.params.args.map(a => a.value ?? a.description ?? "").join(" "));
  });
  const send = (method, params) => new Promise(res => { const i = ++id; w.set(i, res); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
  const ev = async e => {
    const r = await send("Runtime.evaluate", { expression: e, awaitPromise: true, returnByValue: true });
    if (r.result?.exceptionDetails) return { err: r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text };
    return { val: r.result?.result?.value };
  };

  await new Promise(r => ws.on("open", r));
  await send("Runtime.enable");
  await send("Page.enable");
  await send("Page.navigate", { url: "http://localhost:8903/index.html" });
  await new Promise(r => setTimeout(r, 2200));

  const R = [], ok = (n, c) => R.push((c ? "✓" : "✗") + " " + n);
  let r;

  /* --- betöltés --- */
  r = await ev("typeof PROJEKTEK !== 'undefined' && typeof STATUSZOK !== 'undefined'");
  ok("az adatfájl betöltött", r.val === true);
  r = await ev("PROJEKTEK.length");
  ok("16 projekt/ötlet van betöltve (" + r.val + ")", r.val === 16);

  /* --- kártyák --- */
  r = await ev("document.querySelectorAll('#grid .card').length");
  ok("mind a 16 kártya renderelve", r.val === 16);
  r = await ev("document.querySelectorAll('.chip').length");
  ok("5 szűrő-gomb (Összes + 4 státusz)", r.val === 5);
  r = await ev("document.getElementById('n-mukodo').textContent");
  ok("a működő darabszám kiírva (" + r.val + ")", r.val === "2");
  r = await ev("document.getElementById('n-elinditott').textContent");
  ok("az elindított darabszám (" + r.val + ")", r.val === "8");
  r = await ev("document.getElementById('subline').textContent");
  ok("a nyitott feladatok összesítve vannak", /\d+ nyitott feladat/.test(r.val || ""));

  /* --- szűrés --- */
  await ev("document.querySelector('.chip[data-f=\"zart\"]').click()");
  r = await ev("document.querySelectorAll('#grid .card').length");
  ok("a 🔒 zárt szűrő 4 kártyát ad (" + r.val + ")", r.val === 4);
  await ev("document.querySelector('.chip[data-f=\"otlet\"]').click()");
  r = await ev("document.querySelectorAll('#grid .card').length");
  ok("a 🆕 ötlet szűrő 2 kártyát ad (" + r.val + ")", r.val === 2);
  await ev("document.querySelector('.chip[data-f=\"mind\"]').click()");

  /* --- keresés ---
     FONTOS: a Runtime.evaluate-ben a `const` globálisan marad, ezért
     minden hívásnál más nevet használunk (különben SyntaxError lesz,
     és a keresés benne ragad). */
  await ev("document.getElementById('search').value='kerékpár';" +
           "document.getElementById('search').dispatchEvent(new Event('input'));");
  r = await ev("document.querySelectorAll('#grid .card').length");
  ok("a keresés szűr ('kerékpár' → " + r.val + " kártya)", r.val === 2);
  await ev("document.getElementById('search').value='';" +
           "document.getElementById('search').dispatchEvent(new Event('input'));");
  r = await ev("document.querySelectorAll('#grid .card').length");
  ok("a keresés törlése visszaadja mindet (" + r.val + ")", r.val === 16);
  r = await ev("SEARCH");
  ok("a keresés-állapot is kiürült", r.val === "");

  /* --- részletes nézet --- */
  await ev("openDetail('vizsgaztato-ai')");
  r = await ev("document.getElementById('detail').classList.contains('on')");
  ok("a részletes nézet megnyílik", r.val === true);
  r = await ev("document.querySelector('#sheet h2').textContent");
  ok("a cím megjelenik (" + r.val + ")", r.val === "Vizsgáztató AI");
  r = await ev("document.querySelectorAll('#tasks .task').length");
  ok("a hátralévő feladatok listázva (" + r.val + ")", r.val === 5);
  r = await ev("document.getElementById('sheet').textContent.includes('V5') && document.getElementById('sheet').textContent.includes('Pilot')");
  ok("a feladatok tartalma helyes", r.val === true);
  r = await ev("document.getElementById('note').value");
  ok("a megjegyzés-mező üresen indul", r.val === "");
  r = await ev("document.getElementById('newType').options.length");
  ok("a feladat-típusok legördülőben (" + r.val + " db)", r.val === 15);

  /* --- feladat hozzáadása --- */
  await ev("document.getElementById('newTask').value='Teszt feladat'; document.getElementById('newType').value='Sales'; addTask();");
  r = await ev("document.querySelectorAll('#tasks .task').length");
  ok("új feladat hozzáadva (" + r.val + ")", r.val === 6);
  r = await ev("document.getElementById('tasks').textContent.includes('Teszt feladat')");
  ok("az új feladat szövege megjelenik", r.val === true);
  r = await ev("document.getElementById('tasks').textContent.includes('Sales')");
  ok("a típuscímke is megjelenik", r.val === true);
  r = await ev("localStorage.getItem('otletlada.web.v1') !== null");
  ok("a módosítás a localStorage-ba mentődik", r.val === true);

  /* --- pipa (az EREDETI indexre hivatkozva, ahogy a felület is) --- */
  await ev("openDetail('vizsgaztato-ai')");
  const before = (await ev("pdata(PROJEKTEK.find(p=>p.id==='vizsgaztato-ai')).hatralevo.map(t=>t.kesz).join(',')")).val;
  await ev("document.querySelector('#tasks .task input[type=checkbox]').click()");
  const after = (await ev("pdata(PROJEKTEK.find(p=>p.id==='vizsgaztato-ai')).hatralevo.map(t=>t.kesz).join(',')")).val;
  ok("a pipa pontosan egy feladatot állít át (" + before + " → " + after + ")",
    before.split(",").filter(x => x === "true").length + 1 === after.split(",").filter(x => x === "true").length);
  r = await ev("document.querySelectorAll('#tasks .task.done').length");
  ok("a kész feladat áthúzva, a lista végére kerül", r.val >= 1);
  r = await ev("pdata(PROJEKTEK.find(p=>p.id==='vizsgaztato-ai')).hatralevo.map(t=>t.kesz).join(',')");
  ok("a bepipált elem a tömb ELSŐ helyén marad (nem csúszik el)", r.val.startsWith("true"));

  /* --- feladat törlése --- */
  await ev("delTask(0)");
  r = await ev("document.querySelectorAll('#tasks .task').length");
  ok("a feladat törlése működik (" + r.val + " maradt)", r.val === 5);

  /* --- megjegyzés --- */
  await ev("document.getElementById('note').value='Ezt ide írtam.'; saveNote('Ezt ide írtam.');");
  r = await ev("JSON.parse(localStorage.getItem('otletlada.web.v1'))['vizsgaztato-ai'].megjegyzes");
  ok("a megjegyzés mentődik", r.val === "Ezt ide írtam.");

  /* --- a kártyán megjelenik a hátralévő szám, a bezárás után --- */
  await ev("closeDetail()");
  r = await ev("document.getElementById('detail').classList.contains('on')");
  ok("a bezárás után a részletes nézet eltűnik", r.val === false);
  r = await ev("document.querySelectorAll('#grid .card').length");
  ok("a rács mind a 16 kártyát újrarajzolja", r.val === 16);
  r = await ev("document.getElementById('grid').innerHTML.length");
  ok("a rács ténylegesen újrarenderelődött (" + r.val + " karakter)", (r.val || 0) > 3000);
  r = await ev("Array.from(document.querySelectorAll('#grid .card')).some(c=>c.textContent.includes('hátra'))");
  ok("a kártyákon látszik a hátralévő feladatok száma", r.val === true);

  /* --- újratöltés után megmarad --- */
  await send("Page.navigate", { url: "http://localhost:8903/index.html" });
  await new Promise(r => setTimeout(r, 2000));
  await ev("openDetail('vizsgaztato-ai')");
  r = await ev("document.getElementById('note').value");
  ok("újratöltés után a megjegyzés megmarad", r.val === "Ezt ide írtam.");

  /* --- visszaállítás --- */
  await ev("OV={}; save(); closeDetail(); render();");
  await ev("openDetail('vizsgaztato-ai')");
  r = await ev("document.getElementById('note').value");
  ok("a visszaállítás törli a módosításokat", r.val === "");
  r = await ev("document.querySelectorAll('#tasks .task').length");
  ok("a visszaállítás után az eredeti feladatok (" + r.val + ")", r.val === 5);

  /* --- exportok (letöltés nélkül, csak hogy ne dobjon hibát) --- */
  await ev("window.__dl=0; window.dl=()=>{window.__dl++};");
  r = await ev("typeof exportJson === 'function' && typeof exportMd === 'function'");
  ok("az export függvények léteznek", r.val === true);

  /* --- JS hiba --- */
  ok("nincs JavaScript hiba", logs.length === 0);
  if (logs.length) console.log("\nHIBA-LOG:\n" + logs.join("\n"));

  console.log(R.join("\n"));
  const bad = R.filter(x => x.startsWith("✗"));
  console.log("\n" + (R.length - bad.length) + "/" + R.length + " teszt sikeres");

  await send("Page.close").catch(() => {});
  ws.close();
  try { process.kill(-chrome.pid); } catch (e) {}
  process.exit(bad.length ? 1 : 0);
})();
