/* Szoros, nagy felbontású kivágás a B stádium alsó feléről */
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const PORT = 9289;
function httpGet(u){return new Promise((res,rej)=>{http.get(u,r=>{let d="";r.on("data",c=>d+=c);r.on("end",()=>res(d));}).on("error",rej);});}
const kes = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",[
    "--remote-debugging-port="+PORT,"--no-first-run","--no-default-browser-check",
    "--window-size=1500,1700","--window-position=700,40",
    "--user-data-dir=/tmp/chrome-b5-"+Date.now()
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
  await P("Page.navigate",{url:"http://localhost:8910/index.html"});
  await kes(4300);
  await ev("document.querySelectorAll('#fulek button')[1].click()");
  await kes(2000);
  await ev("document.getElementById('cvB').scrollIntoView({block:'center'})");
  await kes(800);
  /* a canvas természetes felbontásban: kivonjuk a canvas régióját, de 2x-es nagyítással */
  const pc = JSON.parse((await ev(`(function(){var rc=document.getElementById('cvB').getBoundingClientRect();return JSON.stringify({x:rc.x,y:rc.y,w:rc.width,h:rc.height});})()`)).val);
  const klip = {x:Math.round(pc.x), y:Math.round(pc.y), width:Math.round(pc.w), height:Math.round(pc.h), scale:2};
  const sh=await P("Page.captureScreenshot",{format:"png",clip:klip});
  fs.writeFileSync("_kepek/b-nagy.png", Buffer.from(sh.result.data,"base64"));
  /* csak az alsó negyed */
  const klip2 = {x:Math.round(pc.x), y:Math.round(pc.y+pc.h*0.45), width:Math.round(pc.w), height:Math.round(pc.h*0.55), scale:2};
  const sh2=await P("Page.captureScreenshot",{format:"png",clip:klip2});
  fs.writeFileSync("_kepek/b-alsó.png", Buffer.from(sh2.result.data,"base64"));
  console.log("kesz");
  ws.close();chrome.kill();process.exit(0);
})();
