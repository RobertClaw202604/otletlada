/* ============================================================
   _gen-spec.js — a spec .md-ből legenerálja a beágyazott szöveget
   Futtatás: node _gen-spec.js
   Eredmény: spec-zaszlo-abc-szoveg.js (window.SPEC_SZOVEG = "...")
   ============================================================ */

const fs = require("fs");
const path = require("path");

const be = path.join(__dirname, "zaszlo-abc-spec.md");
const ki = path.join(__dirname, "spec-zaszlo-abc-szoveg.js");

if (!fs.existsSync(be)) {
  console.error("Nincs meg a forrás: " + be);
  process.exit(1);
}

const nyers = fs.readFileSync(be, "utf8");
/* JSON.stringify biztosítja, hogy minden speciális karakter épségben maradjon */
const out =
  "/* Automatikusan generálva: _gen-spec.js — ne szerkeszd kézzel! */\n" +
  "/* Forrás: zaszlo-abc-spec.md */\n" +
  "window.SPEC_SZOVEG = " + JSON.stringify(nyers) + ";\n";

fs.writeFileSync(ki, out, "utf8");
console.log("Kész: " + path.basename(ki) + " (" + out.length + " byte)");
console.log("Forrás hossza: " + nyers.length + " karakter");
