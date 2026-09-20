/* A cBbetu 2D vászon ellenőrzése: hol a betű, mekkora */
const { spawn } = require("child_process");
const http = require("http");
const WebSocket = require("ws");
const PORT = 9293;
function httpGet(u){return new Promise((res,rej)=>{http.get(u,r=>{let d="";r.on("data",c=>d+=c);r.on("end",()=>res(d));}).on("error",rej);});}
const kes = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",[
    "--remote-debugging-port="+PORT,"--no-first-run","--no-default-browser-check",
    "--window-size=1500,1700","--window-position=700,40",
    "--user-data-dir=/tmp/chrome-b9-"+Date.now()
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
  const r = await ev(`(function(){
    var c=document.getElementById('cvBbetu');
    var ctx=c.getContext('2d');
    if(!ctx) return 'NINCS 2D KONTEXTUS';
    var d=ctx.getImageData(0,0,c.width,c.height).data;
    var sorok=[];var start=-1;
    for(var y=0;y<c.height;y++){
      var db=0;
      for(var x=0;x<c.width;x++){var i=(y*c.width+x)*4;
        if(d[i+3]>30 && d[i]>150)db++;}
      if(db>20){if(start<0)start=y;} else {if(start>=0){sorok.push(start+'-'+(y-1));start=-1;}}
    }
    if(start>=0)sorok.push(start+'-'+(c.height-1));
    return 'canvas:'+c.width+'x'+c.height+' | betu savok: '+(sorok.join(' | ')||'NINCS BETU');
  })()`);
  console.log(JSON.stringify(r.val));
  ws.close();chrome.kill();process.exit(0);
})();
