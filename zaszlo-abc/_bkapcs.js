/* A B mód betű-kapcsolójának tesztje (a cBbetu 2D rétegen) */
const { spawn } = require("child_process");
const http = require("http");
const WebSocket = require("ws");
const PORT = 9294;
function httpGet(u){return new Promise((res,rej)=>{http.get(u,r=>{let d="";r.on("data",c=>d+=c);r.on("end",()=>res(d));}).on("error",rej);});}
const kes = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",[
    "--remote-debugging-port="+PORT,"--no-first-run","--no-default-browser-check",
    "--window-size=1400,1700","--window-position=800,20",
    "--user-data-dir=/tmp/chrome-b10-"+Date.now()
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
  let ok=0,buk=0;
  const ell=(n,f)=>{ if(f){ok++;console.log("✓ "+n);} else {buk++;console.log("✗ "+n);} };
  await P("Page.navigate",{url:"http://localhost:8910/index.html"});
  await kes(4300);
  await ev("document.querySelectorAll('#fulek button')[1].click()");
  await kes(2200);
  const betuDb = async () => (await ev(`(function(){
    var c=document.getElementById('cvBbetu');var ctx=c.getContext('2d');
    if(!ctx) return -1;
    var d=ctx.getImageData(0,0,c.width,c.height).data;var db=0;
    for(var i=0;i<d.length;i+=4){if(d[i+3]>30&&d[i]>150)db++;}
    return db;
  })()`)).val;
  const b1 = await betuDb();
  console.log("betű pixel bekapcsolva:", b1);
  ell("a B módban megjelenik a nagy betű", b1 > 5000);
  ell("a B kapcsoló gomb létezik és BE van kapcsolva", (await ev("document.getElementById('betuGombB').textContent")).val.includes("elrejt"));
  /* kikapcsolás */
  await ev("document.getElementById('betuGombB').click()");
  await kes(1000);
  const b2 = await betuDb();
  console.log("betű pixel kikapcsolva:", b2);
  ell("a kapcsoló kikapcsolja a betűt", b2 < 500);
  ell("a gomb felirata vált", (await ev("document.getElementById('betuGombB').textContent")).val.includes("mutat"));
  /* vissza */
  await ev("document.getElementById('betuGombB').click()");
  await kes(900);
  ell("visszakapcsolva újra látszik", (await betuDb()) > 5000);
  /* más betűre lépés */
  await ev("document.getElementById('lepE').click()");
  await kes(900);
  const b3 = await betuDb();
  ell("a léptetés után is látszik a betű", b3 > 5000);
  /* méret-csúszka hat a betűre */
  await ev("(function(){var s=document.getElementById('ctrlB-mer');s.value=100;s.dispatchEvent(new Event('input'));})()");
  await kes(1200);
  const b4 = await betuDb();
  ell("nagyobb zászlóméretnél nagyobb a betű", b4 > b1 * 1.15);
  console.log("\n"+ok+"/"+(ok+buk)+" teszt sikeres");
  ws.close();chrome.kill();process.exit(0);
})();
