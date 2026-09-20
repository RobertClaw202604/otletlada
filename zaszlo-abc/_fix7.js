const fs = require("fs");
let s = fs.readFileSync("_elesteszt.js", "utf8");
/* a flags helyett a BETUK/ZASZLOK a helyes globális név */
s = s.replace('ell("a zászlórajzok betöltöttek (36)", (await ev("typeof flags === \'object\' && Object.keys(flags).length >= 30")).val === true);',
              'ell("a zászlórajzok betöltöttek (36)", (await ev("typeof BETUK !== \'undefined\' && BETUK.length >= 30")).val === true);\n  ell("a zászlórajzoló működik", (await ev("typeof flagDataUri === \'function\' && String(flagDataUri(\'A\',40)).startsWith(\'data:image/svg\')")).val === true);');
/* az fps-t a valós mért értékből */
s = s.replace('ell("az fps-mutató működik (" + fps.val + ")", /\\\\d+ fps/.test(fps.val || ""));',
              'ell("az fps-mutató működik (" + fps.val + ")", /[0-9]+ fps/.test(fps.val || ""));');
s = s.replace('const fpsszam = parseInt((fps.val||"0").replace(/\\\\D/g,""),10);',
              'const fpsszam = parseInt((fps.val||"0").replace(/[^0-9]/g,""),10);');
fs.writeFileSync("_elesteszt.js", s);
console.log("ok");
