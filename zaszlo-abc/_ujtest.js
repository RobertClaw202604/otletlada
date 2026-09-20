/* Az új funkciók tesztje: méret-csúszka, betű-kapcsoló, B mód zászló */
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const PORT = 9283;
function httpGet(u){return new Promise((res,rej)=>{http.get(u,r=>{let d="";r.on("data",c=>d+=c);r.on("end",()=>res(d));}).on("error",rej);});}
const kes = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",[
    "--remote-debugging-port="+PORT,"--no-first-run","--no-default-browser-check",
    "--window-size=1300,1400","--window-position=900,100",
    "--user-data-dir=/tmp/chrome-mer-"+Date.now()
  ],{stdio:"ignore"});
  let cel=null;
  for(let i=0;i<40;i++){try{const j=JSON.parse(await httpGet("http://localhost:"+PORT+"/json/list"));cel=j.find(t=>t.type==="page");if(cel)break;}catch(e){}await kes(400);}
  const ws=new WebSocket(cel.webSocketDebuggerUrl);
  let id=0;const v={};
  ws.on("message",m=>{const j=JSON.parse(m);if(j.id&&v[j.id]){v[j.id](j);delete v[j.id];}});
  const P=(m,p={})=>new Promise(r=>{const i=++id;v[i]=r;ws.send(JSON.stringify({id:i,method:m,params:p}));});
  await new Promise(r=>ws.on("open",r));
  await P("Runtime.enable");await P("Page.enable");
  const ev=async(e,ap)=>{const r=await P("Runtime.evaluate",{expression:e,awaitPromise:!!ap,returnByValue:true});
    if(r.result.exceptionDetails) return {err:r.result.exceptionDetails.exception?.description};
    return {val:r.result.result.value};};
  const hibak=[];
  ws.on("message",m=>{const j=JSON.parse(m);
    if(j.method==="Runtime.exceptionThrown") hibak.push(j.params.exceptionDetails.exception?.description||"?");
    if(j.method==="Runtime.consoleAPICalled" && j.params.type==="error") hibak.push((j.params.args||[]).map(a=>a.value||a.description).join(" "));});
  await P("Page.navigate",{url:"http://localhost:8910/index.html"});
  await kes(4200);
  let ok=0,buk=0;
  const ell=(n,f)=>{ if(f){ok++;console.log("✓ "+n);} else {buk++;console.log("✗ "+n);} };

  /* hosszú szó beírása */
  await ev("(function(){var b=document.getElementById('szo');b.value='KINAIAUTO 2026 BUDAPEST';b.dispatchEvent(new Event('input'));})()");
  await kes(2500);
  console.log("meret csuszka letezik:", JSON.stringify(await ev("!!document.getElementById('ctrlA-mer')")));
  console.log("betuGomb letezik:", JSON.stringify(await ev("!!document.getElementById('betuGomb')")));
  const m1 = await ev("zaszloMag");
  const w1 = await ev("cA.width");
  console.log("alap zaszloMag:", JSON.stringify(m1.val), "cA.szelesseg:", JSON.stringify(w1.val));
  /* kicsinyítés */
  await ev("(function(){var s=document.getElementById('ctrlA-mer');s.value=6;s.dispatchEvent(new Event('input'));})()");
  await kes(900);
  const m2 = await ev("zaszloMag");
  const w2 = await ev("cA.width");
  const sorok = await ev("sorTordeles(betuk, Math.max(1200, Math.round(1080*1.8)), {zaszloMag: zaszloMag}).sorok.length");
  const sorok18 = await ev("(function(){var s=document.getElementById('ctrlA-mer');s.value=18;s.dispatchEvent(new Event('input'));return sorTordeles(betuk, Math.max(1200, Math.round(1080*1.8)), {zaszloMag: zaszloMag}).sorok.length;})()");
  console.log("kicsi zaszloMag:", JSON.stringify(m2.val), "cA.szelesseg:", JSON.stringify(w2.val), "sorok:", JSON.stringify(sorok.val), "18%-nal:", JSON.stringify(sorok18.val));
  ell("a méret-csúszka kicsinyíti a zászlókat", m2.val < m1.val);
  ell("kisebb méretnél kevesebb sorba tördel (1 sor)", sorok.val === 1);
  ell("a vászon szélessége változik a mérettel", w2.val !== w1.val);

  /* betű-kapcsoló */
  await ev("document.getElementById('betuGomb').click()");
  await kes(800);
  const bl = await ev("betuLatszik");
  ell("a betű-kapcsoló bekapcsol", bl.val === true);
  const gombSzoveg = await ev("document.getElementById('betuGomb').textContent");
  ell("a gomb felirata vált", /elrejt/i.test(gombSzoveg.val||""));

  /* B mód: zászló megjelenik? */
  await ev("document.querySelectorAll('#fulek button')[1].click()");
  await kes(1800);
  const pix = await ev("(function(){try{var s=exportSor(betuk,kepek,cB.width,cB.height,2.0,LOB,cB,zaszloMag);var t=document.createElement('canvas');t.width=s.width;t.height=s.height;var c=t.getContext('2d');c.drawImage(s,0,0);var d=c.getImageData(0,0,t.width,t.height).data;var szines=0,fekete=0;for(var i=0;i<d.length;i+=4){var r=d[i],g=d[i+1],b=d[i+2];if(r+g+b>90)szines++;if(r<25&&g<25&&b<25)fekete++;}return szines+'/'+fekete;}catch(e){return 'HIBA '+e.message;}})()");
  console.log("B mód szines/fekete pixel:", JSON.stringify(pix.val));
  const sp = String(pix.val||"").split("/");
  ell("a B módban a zászló színes (nem fekete blokk)", parseInt(sp[0],10) > 50000);
  ell("a B módban nincs nagy fekete blokk", parseInt(sp[1],10) < 100000);
  const bCanvas = await ev("cB.width");
  ell("a B vászon mérete helyes", bCanvas.val === 1400);

  /* A mód: betűk a vásznon */
  await ev("document.querySelectorAll('#fulek button')[0].click()");
  await kes(900);
  const pixA = await ev("(function(){try{var cb=document.getElementById('cvAbetu');var ctx=cb.getContext('2d');var d=ctx.getImageData(0,0,cb.width,cb.height).data;var feher=0;for(var i=0;i<d.length;i+=4){if(d[i]>200&&d[i+1]>200&&d[i+2]>200)feher++;}return feher;}catch(e){return -1;}})()");
  console.log("A mód 2D réteg fehér pixel (betűk):", JSON.stringify(pixA.val));
  ell("a betűk megjelennek az A módban", pixA.val > 2000);

  /* PNG export */
  await ev("document.getElementById('pngA').click()");
  await kes(2000);
  ell("nincs JavaScript hiba", hibak.length === 0);
  if (hibak.length) console.log("HIBAK:", hibak.slice(0,3));

  console.log("\n" + ok + "/" + (ok+buk) + " teszt sikeres");
  ws.close();chrome.kill();process.exit(0);
})();
