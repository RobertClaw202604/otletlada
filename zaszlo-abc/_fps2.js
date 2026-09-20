/* Valós fps-mérés: látható ablak, valódi GPU */
const { spawn } = require("child_process");
const http = require("http");
const WebSocket = require("ws");
const PORT = 9273;
function httpGet(u){return new Promise((res,rej)=>{http.get(u,r=>{let d="";r.on("data",c=>d+=c);r.on("end",()=>res(d));}).on("error",rej);});}
const kes = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",[
    "--remote-debugging-port="+PORT,"--no-first-run","--no-default-browser-check",
    "--window-size=1300,1400","--window-position=900,100",
    "--user-data-dir=/tmp/chrome-fps-"+Date.now()
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
  await kes(4000);
  console.log("GPU:", JSON.stringify(await ev("(function(){var g=cvA.getContext('webgl');var d=g.getExtension('WEBGL_debug_renderer_info');return d?g.getParameter(d.UNMASKED_RENDERER_WEBGL):'ismeretlen';})()")));
  /* 4 mérés */
  for (let i=0;i<4;i++){
    await kes(1600);
    console.log("fps minta "+(i+1)+":", JSON.stringify(await ev("document.getElementById('fpsA').textContent")));
  }
  console.log("zaszlok:", JSON.stringify(await ev("document.getElementById('zaszlok').textContent")));
  console.log("canvas:", JSON.stringify(await ev("cA.width+'x'+cA.height")));
  ws.close();chrome.kill();process.exit(0);
})();
