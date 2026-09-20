/* Ellenőrzés: tényleg megjelenik-e a nagy betű a B módban (pixel + kép) */
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const PORT = 9288;
function httpGet(u){return new Promise((res,rej)=>{http.get(u,r=>{let d="";r.on("data",c=>d+=c);r.on("end",()=>res(d));}).on("error",rej);});}
const kes = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",[
    "--remote-debugging-port="+PORT,"--no-first-run","--no-default-browser-check",
    "--window-size=1400,1600","--window-position=800,60",
    "--user-data-dir=/tmp/chrome-b4-"+Date.now()
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
  /* B fül */
  await ev("document.querySelectorAll('#fulek button')[1].click()");
  await kes(1800);
  /* a B stádium pozíciója a lapon */
  const poz = await ev(`(function(){
    var p=document.getElementById('p-B');var r=p.getBoundingClientRect();
    var c=document.getElementById('cvB');var rc=c.getBoundingClientRect();
    return JSON.stringify({panel:{x:r.x,y:r.y,w:r.width,h:r.height},canvas:{x:rc.x,y:rc.y,w:rc.width,h:rc.height},scrollY:window.scrollY});
  })()`);
  console.log("poz:", poz.val);
  const pp = JSON.parse(poz.val);
  /* görgessünk a B panelre */
  await ev("document.getElementById('cvB').scrollIntoView({block:'center'})");
  await kes(700);
  const poz2 = await ev(`(function(){var c=document.getElementById('cvB');var rc=c.getBoundingClientRect();return JSON.stringify({x:rc.x,y:rc.y,w:rc.width,h:rc.height});})()`);
  console.log("canvas a kepernyon:", poz2.val);
  const pc = JSON.parse(poz2.val);
  const klip = {x:Math.max(0,Math.round(pc.x)), y:Math.max(0,Math.round(pc.y)),
                width:Math.round(Math.min(pc.w, pc.x+pc.w>1400?1400-pc.x:pc.w)),
                height:Math.round(Math.min(pc.h, pc.y+pc.h>1600?1600-pc.y:pc.h)), scale:1};
  console.log("klip:", JSON.stringify(klip));
  const sh=await P("Page.captureScreenshot",{format:"png",clip:klip});
  fs.writeFileSync("_kepek/b-egyedul.png", Buffer.from(sh.result.data,"base64"));
  /* pixel: a betű sávjában van-e fehér */
  const r2 = await ev(`(function(){
    var gl=cB.getContext('webgl');
    var kep=new Uint8Array(cB.width*cB.height*4);
    gl.readPixels(0,0,cB.width,cB.height,gl.RGBA,gl.UNSIGNED_BYTE,kep);
    var sorok=[];
    for(var y=cB.height-1;y>=0;y--){   /* felulrol */
      var db=0;
      for(var x=0;x<cB.width;x++){var i=(y*cB.width+x)*4;
        if(kep[i]>200&&kep[i+1]>200&&kep[i+2]>200)db++;}
      if(db>80)sorok.push(cB.height-1-y);
    }
    return sorok.length? (sorok[0]+' .. '+sorok[sorok.length-1]+' ('+sorok.length+' sor)') : 'nincs';
  })()`);
  console.log("feher savok:", JSON.stringify(r2.val));
  const kapcsolo = await ev("document.getElementById('betuGombB').textContent");
  console.log("B kapcsolo:", JSON.stringify(kapcsolo.val));
  await ev("document.getElementById('betuGombB').click()");
  await kes(900);
  const r3 = await ev(`(function(){
    var gl=cB.getContext('webgl');
    var kep=new Uint8Array(cB.width*cB.height*4);
    gl.readPixels(0,0,cB.width,cB.height,gl.RGBA,gl.UNSIGNED_BYTE,kep);
    var utolso=-1;
    for(var y=cB.height-1;y>=0;y--){
      for(var x=0;x<cB.width;x++){var i=(y*cB.width+x)*4;
        if(kep[i]>200&&kep[i+1]>200&&kep[i+2]>200){utolso=Math.max(utolso,cB.height-1-y);break;}}
    }
    return utolso;
  })()`);
  console.log("kikapcsolt allapotban az utolso feher sor:", JSON.stringify(r3.val));
  console.log("kesz");
  ws.close();chrome.kill();process.exit(0);
})();
