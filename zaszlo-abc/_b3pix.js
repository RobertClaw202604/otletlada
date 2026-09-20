/* Pixel-alapú ellenőrzés: hol van a betű a B vásznon */
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const PORT = 9286;
function httpGet(u){return new Promise((res,rej)=>{http.get(u,r=>{let d="";r.on("data",c=>d+=c);r.on("end",()=>res(d));}).on("error",rej);});}
const kes = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",[
    "--remote-debugging-port="+PORT,"--no-first-run","--no-default-browser-check",
    "--window-size=1300,1500","--window-position=900,80",
    "--user-data-dir=/tmp/chrome-b3-"+Date.now()
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
  await kes(4200);
  await ev("(function(){var b=document.getElementById('szo');b.value='ARWORKS';b.dispatchEvent(new Event('input'));})()");
  await kes(2300);
  await ev("document.querySelectorAll('#fulek button')[1].click()");
  await kes(1800);
  /* a betű-felirat sávjának elemzése: soronként számoljuk a világos pixeleket */
  const r = await ev(`(function(){
    /* a B stádium a rajzolB után: a 2D réteg a cB-n van (nincs külön canvas) */
    var gl=cB.getContext('webgl');
    var kep=new Uint8Array(cB.width*cB.height*4);
    gl.readPixels(0,0,cB.width,cB.height,gl.RGBA,gl.UNSIGNED_BYTE,kep);
    var sorok=[];
    for(var y=0;y<cB.height;y++){
      var db=0;
      for(var x=0;x<cB.width;x++){
        var i=((cB.height-1-y)*cB.width+x)*4;
        if(kep[i]>200&&kep[i+1]>200&&kep[i+2]>200) db++;
      }
      if(db>50) sorok.push(y+':'+db);
    }
    return sorok.length? (sorok[0]+' | '+sorok[sorok.length-1]+' | sorok:'+sorok.length) : 'nincs feher';
  })()`);
  console.log("feher sorok (felulrol):", JSON.stringify(r.val));
  console.log("varhato: a zaszlo feher mintai + a betu savja");
  ws.close();chrome.kill();process.exit(0);
})();
