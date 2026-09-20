const fs=require("fs");
let s=fs.readFileSync("_bvalos.js","utf8");
s=s.replace("var b=document.getElementById('cvBbetu');var rb=b.getBoundingClientRect();",
            "var b=document.getElementById('p-B');var rb=b.getBoundingClientRect();");
s=s.replace('"--window-size=1500,1700"','"--window-size=1500,2000"');
s=s.replace("--window-position=700,40","--window-position=700,0");
fs.writeFileSync("_bvalos.js",s);
console.log("ok");
