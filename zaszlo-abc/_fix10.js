const fs = require("fs");
let s = fs.readFileSync("_ujtest.js", "utf8");
/* a betű-réteg az önálló cAbetu canvas */
s = s.replace("var ctx=cA.getContext('2d');var d=ctx.getImageData(0,0,cA.width,cA.height).data;",
              "var cb=document.getElementById('cvAbetu');var ctx=cb.getContext('2d');var d=ctx.getImageData(0,0,cb.width,cb.height).data;");
/* a tördelés a valódi max. szélességgel */
s = s.replace("const sorok = await ev(\"sorTordeles(betuk, 1900, {zaszloMag: zaszloMag}).sorok.length\");",
              "const sorok = await ev(\"sorTordeles(betuk, Math.max(1200, Math.round(1080*1.8)), {zaszloMag: zaszloMag}).sorok.length\");");
fs.writeFileSync("_ujtest.js", s);
console.log("ok");
