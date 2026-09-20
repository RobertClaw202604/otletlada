/* Képi ellenőrzés az új funkciókról */
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const PORT = 9284;
function httpGet(u){return new Promise((res,rej)=>{http.get(u,r=>{let d="";r.on("data",c=>d+=c);r.on("end",()=>res(d));}).on("error",rej);});}
const kes = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",[
    "--remote-debugging-port="+PORT,"--no-first-run","--no-default-browser-check",
    "--window-size=1300,1500","--window-position=900,80",
    "--user-data-dir=/tmp/chrome-vis-"+Date.now()
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
  const kep=async(nev)=>{const sh=await P("Page.captureScreenshot",{format:"png"});
    fs.writeFileSync("_kepek/"+nev, Buffer.from(sh.result.data,"base64"));};
  await P("Page.navigate",{url:"http://localhost:8910/index.html"});
  await kes(4200);
  await ev("(function(){var b=document.getElementById('szo');b.value='KINAIAUTO 2026';b.dispatchEvent(new Event('input'));})()");
  await kes(2200);
  await kep("uj-1-sor.png");
  /* betűk be */
  await ev("document.getElementById('betuGomb').click()");
  await kes(1200);
  await kep("uj-2-betuk.png");
  /* kicsi méret */
  await ev("(function(){var s=document.getElementById('ctrlA-mer');s.value=6;s.dispatchEvent(new Event('input'));})()");
  await kes(1200);
  await kep("uj-3-kicsi.png");
  /* B mód */
  await ev("document.querySelectorAll('#fulek button')[1].click()");
  await kes(1800);
  await kep("uj-4-bmod.png");
  console.log("kepek kesz");
  ws.close();chrome.kill();process.exit(0);
})();
