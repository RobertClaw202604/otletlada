const fs = require("fs");
let s = fs.readFileSync("_ujtest.js", "utf8");
/* a tördelés-teszt: 6%-ra állítva (30px mag) 22 zászlónak egy sorban kell lennie */
s = s.replace("s.value=18;", "s.value=6;");
s = s.replace('console.log("kicsi zaszloMag:", JSON.stringify(m2.val), "cA.szelesseg:", JSON.stringify(w2.val), "sorok:", JSON.stringify(sorok.val));',
              'const sorok18 = await ev("(function(){var s=document.getElementById(\'ctrlA-mer\');s.value=18;s.dispatchEvent(new Event(\'input\'));return sorTordeles(betuk, Math.max(1200, Math.round(1080*1.8)), {zaszloMag: zaszloMag}).sorok.length;})()");\n  console.log("kicsi zaszloMag:", JSON.stringify(m2.val), "cA.szelesseg:", JSON.stringify(w2.val), "sorok:", JSON.stringify(sorok.val), "18%-nal:", JSON.stringify(sorok18.val));');
fs.writeFileSync("_ujtest.js", s);
console.log("ok");
