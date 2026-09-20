/* A B stádium valódi méretben, megbízható görgetéssel */
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const PORT = 9292;
function httpGet(u){return new Promise((res,rej)=>{http.get(u,r=>{let d="";r.on("data",c=>d+=c);r.on("end",()=>res(d));}).on("error",rej);});}
const kes = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",[
    "--remote-debugging-port="+PORT,"--no-first-run","--no-default-browser-check",
    "--window-size=1500,2000","--window-position=700,0",
    "--user-data-dir=/tmp/chrome-b8-"+Date.now()
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
  await kes(2200);
  /* görgetés a panel tetejére, majd mérés */
  await ev("(function(){var p=document.getElementById('p-B');window.scrollTo(0, p.getBoundingClientRect().top + window.scrollY - 20);})()");
  await kes(900);
  const info = JSON.parse((await ev(`(function(){
    var b=document.getElementById('p-B');var rb=b.getBoundingClientRect();
    return JSON.stringify({x:rb.x,y:rb.y,w:rb.width,h:rb.height,scrollY:window.scrollY});
  })()`)).val);
  console.log("cvBbetu a kepernyon:", JSON.stringify(info));
  const klip={x:Math.max(0,Math.round(info.x)),y:Math.max(0,Math.round(info.y)),
              width:Math.round(Math.min(info.w, 1500-Math.max(0,info.x))),
              height:Math.round(Math.min(info.h, 1700-Math.max(0,info.y))),scale:1};
  const sh=await P("Page.captureScreenshot",{format:"png",clip:klip});
  fs.writeFileSync("_kepek/b-valos.png", Buffer.from(sh.result.data,"base64"));
  console.log("kesz, klip:", JSON.stringify(klip));
  ws.close();chrome.kill();process.exit(0);
})();
