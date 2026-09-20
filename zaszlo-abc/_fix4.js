const fs = require("fs");
for (const f of ["index.html", "lobogas-webgl.js"]) {
  let s = fs.readFileSync(f, "utf8");
  s = s.replace(/getContext\("webgl", \{ alpha: true, premultipliedAlpha: false, preserveDrawingBuffer: true \}\)/g,
                'getContext("webgl", { alpha: true, premultipliedAlpha: false })');
  fs.writeFileSync(f, s);
}
console.log("kesz");
