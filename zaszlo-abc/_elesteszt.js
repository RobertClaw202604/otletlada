/* Az ÉLES oldal ellenőrzése: https://robertclaw202604.github.io/otletlada/zaszlo-fordito.html */
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const PORT = 9270;
const URL = "https://robertclaw202604.github.io/otletlada/zaszlo-fordito.html";
function httpGet(u){return new Promise((res,rej)=>{http.get(u,r=>{let d="";r.on("data",c=>d+=c);r.on("end",()=>res(d));}).on("error",rej);});}
const kes = ms => new Promise(r=>setTimeout(r,ms));
let ok=0,hiba=0;
function ell(nev,jo){ if(jo){ok++;console.log("✓ "+nev);} else {hiba++;console.log("✗ "+nev);} }
(async()=>{
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",[
    "--remote-debugging-port="+PORT,"--no-first-run","--no-default-browser-check",
    "--window-size=1300,1400","--window-position=900,100",
    "--user-data-dir=/tmp/chrome-eles-"+Date.now()
  ],{stdio:"ignore"});
  let cel=null;
  for(let i=0;i<40;i++){try{const j=JSON.parse(await httpGet("http://localhost:"+PORT+"/json/list"));cel=j.find(t=>t.type==="page");if(cel)break;}catch(e){}await kes(400);}
  const ws=new WebSocket(cel.webSocketDebuggerUrl);
  let id=0;const v={};const hibak=[];
  ws.on("message",m=>{const j=JSON.parse(m);if(j.id&&v[j.id]){v[j.id](j);delete v[j.id];}
    if(j.method==="Runtime.exceptionThrown")hibak.push(j.params.exceptionDetails.exception?.description);});
  const P=(m,p={})=>new Promise(r=>{const i=++id;v[i]=r;ws.send(JSON.stringify({id:i,method:m,params:p}));});
  await new Promise(r=>ws.on("open",r));
  await P("Runtime.enable");await P("Page.enable");await P("Network.enable");
  await P("Network.setCacheDisabled",{cacheDisabled:true});
  const ev=async(e,ap)=>{const r=await P("Runtime.evaluate",{expression:e,awaitPromise:!!ap,returnByValue:true});
    if(r.result.exceptionDetails) return {err:r.result.exceptionDetails.exception?.description};
    return {val:r.result.result.value};};

  await P("Page.navigate",{url:URL});
  await kes(5000);

  ell("az éles oldal betöltött", (await ev("!!document.getElementById('szo')")).val === true);
  ell("a motor betöltött (LOB)", (await ev("typeof LOB === 'object'")).val === true);
  ell("a zászlórajzok betöltöttek (36)", (await ev("typeof BETUK !== 'undefined' && BETUK.length >= 30")).val === true);
  ell("a zászlórajzoló működik", (await ev("typeof flagDataUri === 'function' && String(flagDataUri('A',40)).startsWith('data:image/svg')")).val === true);
  ell("az app betöltött (fordit)", (await ev("typeof fordit === 'function'")).val === true);

  const m = await ev(`(function(){
    var src = kepMentes(cvA);
    var t = document.createElement('canvas'); t.width=src.width; t.height=src.height;
    var c = t.getContext('2d'); c.fillStyle='#000'; c.fillRect(0,0,t.width,t.height);
    c.drawImage(src,0,0);
    var d = c.getImageData(0,0,t.width,t.height).data;
    var nem=0; for(var i=0;i<d.length;i+=4) if(d[i]>30||d[i+1]>30||d[i+2]>30) nem++;
    return nem;
  })()`);
  ell("az éles oldalon kirajzolódik a zászlósor (" + m.val + " pixel)", m.val > 100000);

  const fps = await ev("document.getElementById('fpsA').textContent");
  ell("az fps-mutató működik (" + fps.val + ")", /[0-9]+ fps/.test(fps.val || ""));
  const fpsszam = parseInt((fps.val||"0").replace(/[^0-9]/g,""),10);
  ell("a sebesség legalább 40 fps (mért: " + fpsszam + ")", fpsszam >= 40);

  await ev(`(function(){const e=document.getElementById('szo');e.value='ARWORKS';e.dispatchEvent(new Event('input'));})()`);
  await kes(1500);
  ell("a beírás lefut (7 zászló)", (await ev("document.getElementById('zaszlok').textContent")).val === "7");
  ell("az URL frissül (megosztható link)", (await ev("location.search.includes('szo=ARWORKS')")).val === true);

  await ev("document.querySelector('#fulek button[data-m=\"B\"]').click()");
  await kes(700);
  const mb = await ev(`(function(){
    var src = kepMentes(cvB);
    var t = document.createElement('canvas'); t.width=src.width; t.height=src.height;
    var c = t.getContext('2d'); c.fillStyle='#000'; c.fillRect(0,0,t.width,t.height);
    c.drawImage(src,0,0);
    var d = c.getImageData(0,0,t.width,t.height).data;
    var nem=0; for(var i=0;i<d.length;i+=4) if(d[i]>30||d[i+1]>30||d[i+2]>30) nem++;
    return nem;
  })()`);
  ell("a B mód is rajzol (" + mb.val + ")", mb.val > 100000);

  const png = await ev(`(async function(){ return await new Promise(function(res){
    var src = kepMentes(cvA);
    src.toBlob(function(b){ res(b ? b.size : 0); }, 'image/png');
  }); })()`, true);
  ell("az éles PNG-export működik (" + png.val + " byte)", png.val > 20000);

  ell("nincs JavaScript hiba", hibak.length === 0);
  if(hibak.length) console.log("HIBAK: "+hibak.slice(0,2).join(" | "));
  console.log("\n"+ok+"/"+(ok+hiba)+" éles teszt sikeres");
  ws.close();chrome.kill();process.exit(0);
})();
