/* B mód diagnosztika: mi a fekete blokk? */
const { spawn } = require("child_process");
const http = require("http");
const WebSocket = require("ws");
const PORT = 9281;
function httpGet(u){return new Promise((res,rej)=>{http.get(u,r=>{let d="";r.on("data",c=>d+=c);r.on("end",()=>res(d));}).on("error",rej);});}
const kes = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",[
    "--remote-debugging-port="+PORT,"--no-first-run","--no-default-browser-check",
    "--window-size=1300,1400","--window-position=900,100",
    "--user-data-dir=/tmp/chrome-b-"+Date.now()
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
  /* váltás B módra */
  await ev("document.querySelectorAll('#fulek button')[1].click()");
  await kes(1500);
  console.log("mod:", JSON.stringify(await ev("mod")));
  console.log("mutato:", JSON.stringify(await ev("mutato")));
  console.log("betu:", JSON.stringify(await ev("betuk[mutato]")));
  console.log("kepek kulcsok:", JSON.stringify(await ev("Object.keys(kepek).join('')")));
  console.log("van kep ehhez:", JSON.stringify(await ev("!!kepek[betuk[mutato]]")));
  console.log("zaszloE:", JSON.stringify(await ev("zaszloE(betuk[mutato])")));
  console.log("cB meret:", JSON.stringify(await ev("cB.width+'x'+cB.height")));
  console.log("cvB CSS meret:", JSON.stringify(await ev("(function(){var r=document.getElementById('cvB').getBoundingClientRect();return Math.round(r.width)+'x'+Math.round(r.height);})()")));
  console.log("feliratB:", JSON.stringify(await ev("document.getElementById('feliratB').textContent")));
  console.log("FLAG_W/H:", JSON.stringify(await ev("FLAG_W+'/'+FLAG_H")));
  /* pixel teszt a cvB-n */
  console.log("cvB pixels:", JSON.stringify(await ev("(function(){try{var s=exportSor(betuk,kepek,cB.width,cB.height,1.0,LOB,cB);var t=document.createElement('canvas');t.width=s.width;t.height=s.height;var c=t.getContext('2d');c.fillStyle='#000';c.fillRect(0,0,t.width,t.height);c.drawImage(s,0,0);var d=c.getImageData(0,0,t.width,t.height).data;var n=0;for(var i=0;i<d.length;i+=4)if(d[i]>30||d[i+1]>30||d[i+2]>30)n++;return n;}catch(e){return 'HIBA '+e.message;}})()")));
  console.log("_glB attributes:", JSON.stringify(await ev("(function(){var g=cB.getContext('webgl');return g?JSON.stringify(g.getContextAttributes()):'nincs';})()")));
  ws.close();chrome.kill();process.exit(0);
})();
