/* ============================================================
   lobogas.js — a zászló lobogtatása, 4. változat (folytonos)

   MIÉRT EZ A MÓDSZER (a korábbiak tanulsága):
   Az 1–3. változat mind "oszloponként" dolgozott: minden függőleges
   sáv kapott EGY eltolást. Ez mindig csíkozódást okoz, mert a
   szomszédos sávok más-más eltolást kapnak, és a határon megtörik
   a kép — minél több az oszlop, annál sűrűbb a rács.

   Ez a változat NEM oszlopokban gondolkodik: minden EGYES cél-pixel
   forrás-pozícióját külön számolja, sima (bilineáris) interpolációval.
   Így a felület teljesen folytonos — nincs se csík, se varrat, se rács.

     a cél-pixel (x, y) forrás-pozíciója:
        u = x01 + A·sin(2π·x01/λ − ωt)·csillapítás(x01)
        v = y01 + vetülés·cos(...)
   ============================================================ */

const LOB = {
  amplitudo: 0.12,     /* a zászló szélességének ~12%-a */
  hullamhossz: 1.3,    /* a zászló szélességének 1,3-szorosa */
  sebesseg: 0.7,       /* periódus / másodperc */
  csillapitas: 0.9,    /* a hullám a rögzített éltől indul */
  fodro: 0.3,          /* a másodlagos fodrozódás súlya */
  feny: true,          /* redők árnyékolása */
  fazis: 0,            /* két zászló eltérő fázisa */
  vetules: 0.16,       /* a függőleges vetülés mértéke */
  lepcso: 2,           /* belső felbontás-csökkentés (1 = teljes, 2 = fél) */
  elsimitas: 1         /* a szélek lágyítása (pixel) */
};

/* a hullám értéke egy x01 pontban */
function hullamEltolas(x01, t, beall) {
  const b = beall ? Object.assign({}, LOB, beall) : LOB;
  const w = 2 * Math.PI * b.sebesseg;
  const k = 2 * Math.PI / b.hullamhossz;
  const cs = Math.pow(x01, 1 / b.csillapitas);

  const fo = Math.sin(k * x01 - w * t + b.fazis);
  const fo2 = Math.sin(2.3 * k * x01 - 2.1 * w * t + b.fazis * 1.7);
  const f = fo + b.fodro * fo2;

  return {
    dx: cs * f,
    dy: b.vetules * cs * Math.cos(k * x01 - w * t + b.fazis),
    cs: cs,
    f: f,
    /* a hullám analitikus meredeksége — ebből lesz a lágy árnyék.
       Nem a szomszédos pixelek különbségéből, mert az sávos lenne. */
    meredek: cs * (k * Math.cos(k * x01 - w * t + b.fazis) +
                   b.fodro * 2.3 * k * Math.cos(2.3 * k * x01 - 2.1 * w * t + b.fazis * 1.7))
  };
}

/* ---- a forrás-kép pixel-adata, egyszer kiolvasva (gyorsítótár) ----
/* MIÉRT: korábban minden kockában újra létrehoztuk a rejtett vásznat,
   újra kirajzoltuk a képet és újra kiolvastuk a 3,2 millió pixelt.
   Ez önmagában felemésztette a kockaidőt. Most a képhez tartozó
   adatot EGYSZER olvassuk ki, és a képre hivatkozva tároljuk. */
const _forrasCache = new WeakMap();

function forrasAdat(img) {
  let fa = _forrasCache.get(img);
  if (fa) return fa;
  const sv = document.createElement("canvas");
  sv.width = img.width; sv.height = img.height;
  const sc = sv.getContext("2d", { willReadFrequently: true });
  sc.drawImage(img, 0, 0);
  fa = sc.getImageData(0, 0, img.width, img.height).data;
  _forrasCache.set(img, fa);
  return fa;
}

/* ---- a zászló kirajzolása úgy, hogy lobog (folytonos deformáció) ----
   x, y: a zászló bal felső sarka a vásznon
   sz, mag: a zászló mérete pixelben
   t: idő másodpercben */
function lobogoZaszlo(ctx, img, x, y, sz, mag, t, beall) {
  const b = beall ? Object.assign({}, LOB, beall) : LOB;
  const lepcso = b.lepcso > 1 ? b.lepcso : 1;   /* belső felbontás-csökkentés */

  const cx = Math.max(0, Math.floor(x));
  const cy = Math.max(0, Math.floor(y));
  const cw = Math.min(ctx.canvas.width - cx, Math.ceil(sz));
  const ch = Math.min(ctx.canvas.height - cy, Math.ceil(mag));
  if (cw <= 0 || ch <= 0) return;

  /* a belső (számolt) terület: lehet kisebb, mint a cél-terület */
  const bw = Math.ceil(cw / lepcso);
  const bh = Math.ceil(ch / lepcso);

  const fa = forrasAdat(img);
  const celAdat = ctx.getImageData(cx, cy, bw, bh);
  const ca = celAdat.data;

  const amp = sz * b.amplitudo;

  for (let py = 0; py < bh; py++) {
    const y01 = py / (bh - 1 || 1);
    for (let px = 0; px < bw; px++) {
      const x01 = px / (bw - 1 || 1);
      const h = hullamEltolas(x01, t, b);

      /* a forrás-pozíció: a hullám eltolja a mintavételt */
      const u = x01 - h.dx * b.amplitudo;      /* vízszintes */
      const v = y01 + h.dy * b.vetules;        /* függőleges vetülés */

      if (u < 0 || u > 1 || v < 0 || v > 1) continue;

      /* bilineáris interpoláció a forrás-képen */
      const fx = u * (img.width - 1);
      const fy = v * (img.height - 1);
      const x0 = Math.floor(fx), y0 = Math.floor(fy);
      const x1 = Math.min(img.width - 1, x0 + 1);
      const y1 = Math.min(img.height - 1, y0 + 1);
      const tx = fx - x0, ty = fy - y0;

      const i00 = (y0 * img.width + x0) * 4;
      const i10 = (y0 * img.width + x1) * 4;
      const i01 = (y1 * img.width + x0) * 4;
      const i11 = (y1 * img.width + x1) * 4;

      const w00 = (1 - tx) * (1 - ty), w10 = tx * (1 - ty);
      const w01 = (1 - tx) * ty, w11 = tx * ty;
      const a00 = fa[i00 + 3] / 255, a10 = fa[i10 + 3] / 255;
      const a01 = fa[i01 + 3] / 255, a11 = fa[i11 + 3] / 255;

      let a = a00 * w00 + a10 * w10 + a01 * w01 + a11 * w11;
      if (a <= 0.004) continue;

      let r = (fa[i00] * a00 * w00 + fa[i10] * a10 * w10 +
               fa[i01] * a01 * w01 + fa[i11] * a11 * w11) / a;
      let g = (fa[i00 + 1] * a00 * w00 + fa[i10 + 1] * a10 * w10 +
               fa[i01 + 1] * a01 * w01 + fa[i11 + 1] * a11 * w11) / a;
      let bl = (fa[i00 + 2] * a00 * w00 + fa[i10 + 2] * a10 * w10 +
                fa[i01 + 2] * a01 * w01 + fa[i11 + 2] * a11 * w11) / a;

      /* árnyék a redőknél: a hullám analitikus meredekségéből.
         Lágy, folytonos átmenet — nincs sávos árnyalás. */
      if (b.feny) {
        const arny = Math.max(-0.30, Math.min(0.30, h.meredek * 0.09));
        if (arny > 0) {
          r += (255 - r) * arny; g += (255 - g) * arny; bl += (255 - bl) * arny;
        } else if (arny < 0) {
          const s = 1 + arny;
          r *= s; g *= s; bl *= s;
        }
      }

      /* a zászló szélének lágyítása */
      let alfa = 1;
      if (b.elsimitas > 0) {
        const s = b.elsimitas;
        const perem = Math.min(
          x01 * sz / s, (1 - x01) * sz / s,
          y01 * mag / s, (1 - y01) * mag / s);
        alfa = Math.max(0, Math.min(1, perem));
      }

      const ti = (py * bw + px) * 4;
      ca[ti] = r; ca[ti + 1] = g; ca[ti + 2] = bl;
      ca[ti + 3] = Math.round(alfa * 255);
    }
  }

  /* visszaírás a cél-vászonra, felskálázva */
  if (lepcso === 1) {
    ctx.putImageData(celAdat, cx, cy);
  } else {
    const kicsi = document.createElement("canvas");
    kicsi.width = bw; kicsi.height = bh;
    kicsi.getContext("2d").putImageData(celAdat, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(kicsi, 0, 0, bw, bh, cx, cy, cw, ch);
  }
}

/* ---- a zászló betöltése képként (a canvas-hez) ---- */
function zaszloBetolt(betu, szelesseg) {
  return new Promise(function (res, rej) {
    const img = new Image();
    img.onload = function () { res(img); };
    img.onerror = function () { rej(new Error("Nem töltődött be: " + betu)); };
    img.src = flagDataUri(betu, szelesseg);
  });
}
