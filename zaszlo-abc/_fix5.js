const fs = require("fs");
let s = fs.readFileSync("_pxtest.js", "utf8");
s = s.replace(/const forras = kepMentes\(cv\);/g,
              "const forras = exportSor(betuk, kepek, cv.width, cv.height, (performance.now()-t0)/1000, LOB);");
s = s.replace(/const forras=kepMentes\(cv\);/g,
              "const forras=exportSor(betuk, kepek, cv.width, cv.height, (performance.now()-t0)/1000, LOB);");
fs.writeFileSync("_pxtest.js", s);
console.log("ok", (s.match(/exportSor/g)||[]).length);
