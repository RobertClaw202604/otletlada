/* Hol van ténylegesen a tartalom a cB vásznon? */
const { spawn } = require("child_process");
const http = require("http");
const WebSocket = require("ws");
const PORT = 9291;
function httpGet(u){return new Promise((res,rej)=>{http.get(u,r=>{let d="";r.on("data",c=>d+=c);r.on("end",()=>res(d));}).on("error",rej);});}
const kes = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",[
    "--remote-debugging-port="+PORT,"--no-first-run","--no-default-browser-check",
    "--window-size=1400,1500","--window-position=800,40",
    "--user-data-dir=/tmp/chrome-b7-"+Date.now()
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
  console.log("cB natív:", JSON.stringify((await ev("cB.width+'x'+cB.height")).val));
  console.log("zaszloMag:", JSON.stringify((await ev("zaszloMag")).val));
  console.log("mod:", JSON.stringify((await ev("mod")).val));
  console.log("mutato:", JSON.stringify((await ev("mutato")).val));
  console.log("betuk:", JSON.stringify((await ev("betuk.join('')")).val));
  /* a betű sávjának megkeresése */
  const r = await ev(`(function(){
    var gl=cB.getContext('webgl');
    var kep=new Uint8Array(cB.width*cB.height*4);
    gl.readPixels(0,0,cB.width,cB.height,gl.RGBA,gl.UNSIGNED_BYTE,kep);
    var tartomany=[];var start=-1;
    for(var y=0;y<cB.height;y++){
      var db=0;
      for(var x=0;x<cB.width;x++){var i=((cB.height-1-y)*cB.width+x)*4;
        if(kep[i]>60||kep[i+1]>60||kep[i+2]>60)db++;}
      if(db>60){ if(start<0)start=y; }
      else { if(start>=0){tartomany.push(start+'-'+(y-1));start=-1;} }
    }
    if(start>=0)tartomany.push(start+'-'+(cB.height-1));
    return tartomany.join(' | ');
  })()`);
  console.log("nem-háttér sávok (felülről):", JSON.stringify(r.val));
  ws.close();chrome.kill();process.exit(0);
})();
