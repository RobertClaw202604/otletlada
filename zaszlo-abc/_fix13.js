const fs=require("fs");
let s=fs.readFileSync("_b2vis.js","utf8");
s=s.replace('fs.writeFileSync("_kepek/bmod-betu.png", Buffer.from(sh.result.data,"base64"));',
`const sh2=await P("Page.captureScreenshot",{format:"png",clip:{x:130,y:600,width:1000,height:560,scale:1}});
  fs.writeFileSync("_kepek/bmod-betu2.png", Buffer.from(sh2.result.data,"base64"));
  fs.writeFileSync("_kepek/bmod-betu.png", Buffer.from(sh.result.data,"base64"));`);
fs.writeFileSync("_b2vis.js",s);
console.log("ok");
