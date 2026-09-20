const fs = require("fs");
let s = fs.readFileSync("lobogas-webgl.js", "utf8");

/* 1) a globális kontextus-állapot helyett kontextusonkénti tároló */
s = s.replace(
`/* ---- a WebGL-környezet (egyszer jön létre) ---- */
let _gl = null, _program = null, _terulet = null;
let _egyszer = null;

function glElokeszit(canvas) {
  if (_gl && _gl.canvas === canvas) return true;
  /* Ha MÁR van kontextus egy másik vásznon, és az export-renderhez
     kell egy új: a régi kontextus megtartása mellett nem lehet
     ugyanazt a programot/textúrát használni (azok kontextushoz
     kötöttek). Ezért az export KÜLÖN, saját motort használ. */
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false,
                                          preserveDrawingBuffer: true });
  if (!gl) return false;
  _gl = gl;`,
`/* ---- a WebGL-környezet (vásznanként külön!) ----
   FONTOS: egy oldalon több vászon is lehet (A/B/C mód), mindegyik
   SAJÁT WebGL-kontextussal. A program, a textúrák és a uniform-helyek
   KONTEKSTUSHOS kötöttek — ezért vásznanként külön kell tárolni.
   (Ha egyetlen közös _gl lenne, a második vásznon a program és a
   textúra érvénytelen lenne: fekete blokk jelenne meg.) */
const _motorok = new WeakMap();   /* canvas -> { gl, program, egyszer, texturak } */

function glElokeszit(canvas) {
  const meglevo = _motorok.get(canvas);
  if (meglevo) return true;
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false,
                                          preserveDrawingBuffer: true });
  if (!gl) return false;`);

/* 2) a program létrehozása után tároljuk a motort */
s = s.replace(
`  gl.useProgram(program);
  _program = program;`,
`  gl.useProgram(program);`);

/* 3) a uniform-helyek: _egyszer -> motor.egyszer */
s = s.replace(
`  /* a uniform-helyek egyszer lekérve */
  _egyszer = {`,
`  /* a uniform-helyek egyszer lekérve */
  const _egyszer = {`);

s = s.replace(
`    zaszlo: gl.getUniformLocation(program, "zaszlo")
  };
  return true;
}`,
`    zaszlo: gl.getUniformLocation(program, "zaszlo")
  };
  _motorok.set(canvas, { gl: gl, program: program, egyszer: _egyszer, texturak: new Map() });
  return true;
}`);

/* 4) glTextura: canvas szerinti cache + helyes gl */
s = s.replace(
`const _texturak = new Map();
function glTextura(img) {
  if (_texturak.has(img)) return _texturak.get(img);
  const gl = _gl;
  const tex = gl.createTexture();`,
`function glTextura(motor, img) {
  if (motor.texturak.has(img)) return motor.texturak.get(img);
  const gl = motor.gl;
  const tex = gl.createTexture();`);

s = s.replace(
`  _texturak.set(img, tex);
  return tex;
}`,
`  motor.texturak.set(img, tex);
  return tex;
}`);

fs.writeFileSync("lobogas-webgl.js", s);
console.log("ok");
