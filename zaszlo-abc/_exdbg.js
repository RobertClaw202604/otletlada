const { spawn } = require("child_process");
const http = require("http");
const WebSocket = require("ws");
const PORT = 9271;
function httpGet(u){return new Promise((res,rej)=>{http.get(u,r=>{let d="";r.on("data",c=>d+=c);r.on("end",()=>res(d));}).on("error",rej);});}
const kes = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",[
    "--remote-debugging-port="+PORT,"--no-first-run","--no-default-browser-check",
    "--window-size=1300,1400","--window-position=900,100",
    "--user-data-dir=/tmp/chrome-ex-"+Date.now()
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
  await kes(3500);
  console.log("exportSor tipus:", JSON.stringify(await ev("typeof exportSor")));
  console.log("sorTordeles tipus:", JSON.stringify(await ev("typeof sorTordeles")));
  console.log("betuk:", JSON.stringify(await ev("betuk.length")));
  console.log("kepek:", JSON.stringify(await ev("Object.keys(kepek).length")));
  const r = await ev("(function(){ try { var k = exportSor(betuk, kepek, cA.width, cA.height, 1.0, LOB); return k ? k.width+'x'+k.height : 'NULL'; } catch(e) { return 'HIBA: '+e.message; } })()");
  console.log("exportSor eredmeny:", JSON.stringify(r.val || r.err));
  ws.close();chrome.kill();process.exit(0);
})();
