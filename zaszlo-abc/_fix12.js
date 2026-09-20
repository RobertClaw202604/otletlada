const fs = require("fs");
for (const f of ["_fulltest.js", "_pxtest.js"]) {
  let s = fs.readFileSync(f, "utf8");
  /* a feliratB helyett a mutató és az aktuális betű */
  s = s.replace(/document\.getElementById\('feliratB'\)\.textContent/g,
                "(betuk[mutato]||' ')");
  fs.writeFileSync(f, s);
}
console.log("ok");
