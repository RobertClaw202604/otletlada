/* Az Ötletláda web tesztje — BLOKK-ALAPÚ feladatrendszer. */
const { spawn } = require("child_process");
const http = require("http");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9232;
const DIR = process.cwd();
const PROFILE = "/tmp/chrome-otletlada-" + Date.now();

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
  await new Promise(r => setTimeout(r, 2800));

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
  await send("Network.enable");
  await send("Network.setCacheDisabled", { cacheDisabled: true });
  await send("Page.enable");
  await send("Page.navigate", { url: "http://localhost:8903/index.html" });
  await new Promise(r => setTimeout(r, 2500));

  const R = [], ok = (n, c) => R.push((c ? "✓" : "✗") + " " + n);
  let r;

  /* --- betöltés --- */
  ok("az adatfájl betöltött", (await ev("typeof PROJEKTEK !== 'undefined'")).val === true);
  r = await ev("PROJEKTEK.length");
  ok("17 projekt van betöltve (" + r.val + ")", r.val === 17);
  r = await ev("[...new Set(PROJEKTEK.map(p=>p.id))].length");
  ok("minden projekt-azonosító egyedi (" + r.val + ")", r.val === 17);
  r = await ev("NAGY_FELADATOK.length");
  const NB = r.val;
  ok("a fix nagy feladatok száma " + NB, r.val === 14);
  r = await ev("typeof FELADAT_TIPUSOK");
  ok("a régi választható lista eltűnt", r.val === "undefined");
  r = await ev("document.querySelectorAll('#grid .card').length");
  ok("mind a 17 kártya renderelve", r.val === 17);

  /* --- MINDEN projektnél megvan MINDEN nagy blokk --- */
  r = await ev("PROJEKTEK.every(p=>(p.hatralevo||[]).length===NAGY_FELADATOK.length)");
  ok("minden projektnél mind a " + NB + " nagy feladat megjelenik", r.val === true);
  r = await ev("PROJEKTEK.every(p=>NAGY_FELADATOK.every(n=>p.hatralevo.some(b=>b.feladat===n)))");
  ok("a nagy feladatok köre és sorrendje mindenhol azonos", r.val === true);

  /* --- részletes nézet --- */
  await ev("openDetail('vizsgaztato-ai')");
  r = await ev("document.getElementById('detail').classList.contains('on')");
  ok("a részletes nézet megnyílik", r.val === true);
  r = await ev("document.querySelectorAll('#tasks .blk').length");
  ok("mind a " + NB + " blokk megjelenik a felületen (" + r.val + ")", r.val === NB);
  r = await ev("document.getElementById('tasks').textContent.includes('Teljes speckó') && document.getElementById('tasks').textContent.includes('Partnerkapcsolat')");
  ok("a fix feladatnevek látszanak (nem választó)", r.val === true);
  r = await ev("document.querySelectorAll('#tasks select').length");
  ok("nincs legördülő választó a feladatoknál", r.val === 0);
  r = await ev("document.querySelectorAll('#tasks .blk .blk-b').length");
  ok("minden blokkhoz tartozik lenyitható terület", r.val === NB);
  r = await ev("document.querySelectorAll('#tasks .blk.open').length");
  ok("alapból minden blokk zárva", r.val === 0);

  /* --- lenyitás, részfeladatok --- */
  const speck = (await ev("(pdata(PROJEKTEK.find(p=>p.id==='vizsgaztato-ai')).hatralevo.findIndex(b=>b.feladat==='Kész szoftver'))")).val;
  await ev("OPEN[CURRENT+':" + speck + "']=true; refreshBlocks();");
  r = await ev("document.querySelectorAll('#tasks .blk.open .sub').length");
  ok("a 'Kész szoftver' blokk alatt " + r.val + " részfeladat van", r.val === 4);
  r = await ev("document.querySelectorAll('#tasks .blk.open').length");
  ok("lenyitás után pontosan 1 blokk nyitva", r.val === 1);

  /* --- új RÉSZFELADAT felvétele --- */
  await ev("document.getElementById('sub" + speck + "').value='Backend proxy beállítása'; addSub(" + speck + ");");
  r = await ev("document.querySelectorAll('#tasks .blk.open .sub').length");
  ok("új részfeladat hozzáadva (" + r.val + ")", r.val === 5);
  r = await ev("document.getElementById('tasks').textContent.includes('Backend proxy beállítása')");
  ok("a részfeladat szövege megjelenik", r.val === true);
  r = await ev("localStorage.getItem('otletlada.web.v1') !== null");
  ok("a módosítás mentődik", r.val === true);
  /* --- részfeladat pipa --- */
  await ev("toggleSub(" + speck + ",0)");
  r = await ev("pdata(PROJEKTEK.find(p=>p.id==='vizsgaztato-ai')).hatralevo.find(b=>b.feladat==='Kész szoftver').reszfeladatok.filter(s=>s.kesz).length");
  ok("a részfeladat bepipálása működik", r.val === 1);
  r = await ev("document.querySelectorAll('#tasks .blk.open .sub.done').length");
  ok("a kész részfeladat áthúzva", r.val === 1);

  /* --- NAGY feladat pipa --- */
  await ev("toggleBig(" + speck + ")");
  r = await ev("pdata(PROJEKTEK.find(p=>p.id==='vizsgaztato-ai')).hatralevo.find(b=>b.feladat==='Kész szoftver').kesz");
  ok("a nagy feladat bepipálása működik", r.val === true);
  r = await ev("document.querySelectorAll('#tasks .blk.done').length");
  ok("a kész nagy feladat jelölve", r.val === 1);
  await ev("toggleBig(" + speck + ")");

  /* --- részfeladat törlése --- */
  await ev("delSub(" + speck + ",0)");
  r = await ev("document.querySelectorAll('#tasks .blk.open .sub').length");
  ok("a részfeladat törlése működik (" + r.val + " maradt)", r.val === 4);

  /* --- ÚJ NAGY feladat felvétele (pl. B2B sales) --- */
  await ev("document.getElementById('newBlock').value='B2B sales'; addBlock();");
  r = await ev("document.querySelectorAll('#tasks .blk').length");
  ok("új nagy feladat hozzáadva (" + r.val + ")", r.val === NB + 1);
  r = await ev("document.getElementById('tasks').textContent.includes('B2B sales')");
  ok("az új nagy feladat neve megjelenik", r.val === true);
  r = await ev("pdata(PROJEKTEK.find(p=>p.id==='vizsgaztato-ai')).hatralevo[pdata(PROJEKTEK.find(p=>p.id==='vizsgaztato-ai')).hatralevo.length-1].egyedi");
  ok("az egyedi nagy feladat meg van jelölve (törölhető)", r.val === true);
  r = await ev("document.querySelectorAll('#tasks .blk-h .del').length");
  ok("csak az egyedi nagy feladatoknál van törlés (" + r.val + ")", r.val === 1);
  await ev("delBlock(" + (NB) + ")");
  r = await ev("document.querySelectorAll('#tasks .blk').length");
  ok("az egyedi nagy feladat törlése működik (" + r.val + ")", r.val === NB);

  /* --- a fix blokkok nem törölhetők --- */
  r = await ev("document.querySelectorAll('#tasks .blk-h .del').length");
  ok("a fix nagy feladatok NEM törölhetők", r.val === 0);

  /* --- a kártyán a haladás --- */
  await ev("closeDetail()");
  r = await ev("document.querySelectorAll('#grid .card').length");
  ok("a bezárás után a rács újrarajzolódik", r.val === 17);
  r = await ev("Array.from(document.querySelectorAll('#grid .card')).some(c=>/\\d+\\/\\d+ feladat/.test(c.textContent))");
  ok("a kártyán látszik a kész/összes nagy feladat", r.val === true);
  r = await ev("Array.from(document.querySelectorAll('#grid .card')).some(c=>c.textContent.includes('hátra'))");
  ok("a kártyán látszik a hátralévő részfeladat-szám", r.val === true);

  /* --- újratöltés után megmarad --- */
  await send("Page.navigate", { url: "http://localhost:8903/index.html" });
  await new Promise(r => setTimeout(r, 2200));
  r = await ev("document.querySelectorAll('#grid .card').length");
  ok("újratöltés után is 17 kártya", r.val === 17);
  await ev("openDetail('vizsgaztato-ai')");
  r = await ev("document.querySelectorAll('#tasks .blk').length");
  ok("újratöltés után a blokkok megvannak (" + r.val + ")", r.val === NB);

  /* --- visszaállítás --- */
  await ev("OV={}; save(); closeDetail(); render(); openDetail('vizsgaztato-ai');");
  r = await ev("pdata(PROJEKTEK.find(p=>p.id==='vizsgaztato-ai')).hatralevo.find(b=>b.feladat==='Kész szoftver').reszfeladatok.length");
  ok("a visszaállítás visszaadja az eredeti részfeladatokat (" + r.val + ")", r.val === 4);

  /* --- keresés a részfeladatokra is: a Mentett részfeladat csak a böngészőben van,
         ezért egy OLYAN szót keresünk, amely a projektek.js-ben is benne van --- */
  await ev("closeDetail(); document.getElementById('search').value='Kréta integráció'; document.getElementById('search').dispatchEvent(new Event('input'));");
  r = await ev("document.querySelectorAll('#grid .card').length");
  ok("a keresés a részfeladatokra is működik ('Kréta integráció' → " + r.val + " találat)", r.val === 1);
  await ev("document.getElementById('search').value=''; document.getElementById('search').dispatchEvent(new Event('input'));");

  /* --- exportok --- */
  r = await ev("typeof exportJson === 'function' && typeof exportMd === 'function'");
  ok("az export függvények léteznek", r.val === true);

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
