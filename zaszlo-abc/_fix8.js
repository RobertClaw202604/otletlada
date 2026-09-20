const fs = require("fs");
let s = fs.readFileSync("index.html", "utf8");
s = s.replace(/getContext\("webgl", \{ alpha: true, premultipliedAlpha: false \}\)/g,
              'getContext("webgl", { alpha: true, premultipliedAlpha: false, preserveDrawingBuffer: true })');
fs.writeFileSync("index.html", s);
console.log("html ok", (s.match(/preserveDrawingBuffer/g)||[]).length);
