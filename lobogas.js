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
  suruseg: 1,          /* felbontás-szorzó (1 = minden pixel külön számolva) */
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

/* ---- a zászló kirajzolása úgy, hogy lobog (folytonos deformáció) ----
   x, y: a zászló bal felső sarka a vásznon
   sz, mag: a zászló mérete pixelben
   t: idő másodpercben */
function lobogoZaszlo(ctx, img, x, y, sz, mag, t, beall) {
  const b = beall ? Object.assign({}, LOB, beall) : LOB;

  const cx = Math.max(0, Math.floor(x));
  const cy = Math.max(0, Math.floor(y));
  const cw = Math.min(ctx.canvas.width - cx, Math.ceil(sz));
  const ch = Math.min(ctx.canvas.height - cy, Math.ceil(mag));
  if (cw <= 0 || ch <= 0) return;

  /* a forrás-képet egyszer olvassuk ki pixel-adatként */
  const sv = document.createElement("canvas");
  sv.width = img.width; sv.height = img.height;
  sv.getContext("2d").drawImage(img, 0, 0);
  const fa = sv.getContext("2d").getImageData(0, 0, img.width, img.height).data;

  const celAdat = ctx.getImageData(cx, cy, cw, ch);
  const ca = celAdat.data;

  const amp = sz * b.amplitudo;
  const valt = b.suruseg;   /* hány pixelenként számolunk */

  for (let py = 0; py < ch; py += valt) {
    const y01 = py / (ch - 1 || 1);
    for (let px = 0; px < cw; px += valt) {
      const x01 = px / (cw - 1 || 1);
      const h = hullamEltolas(x01, t, b);

      /* a forrás-pozíció: a hullám eltolja a mintavételt */
      const u = x01 - h.dx * b.amplitudo;      /* vízszintes */
      const v = y01 + h.dy * b.vetules;        /* függőleges vetülés */

      if (u < 0 || u > 1 || v < 0 || v > 1) {
        /* a zászlón kívülre eső rész: nem írunk (átlátszó marad) */
        continue;
      }

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

      let r = 0, g = 0, bl = 0, a = 0;
      /* csak a látható (nem átlátszó) forrás-pixeleket vesszük figyelembe */
      const suly = [
        [i00, (1 - tx) * (1 - ty)], [i10, tx * (1 - ty)],
        [i01, (1 - tx) * ty], [i11, tx * ty]
      ];
      for (let q = 0; q < 4; q++) {
        const ii = suly[q][0], wq = suly[q][1];
        const al = fa[ii + 3] / 255;
        r += fa[ii] * wq * al;
        g += fa[ii + 1] * wq * al;
        bl += fa[ii + 2] * wq * al;
        a += al * wq;
      }
      if (a <= 0.001) continue;
      r /= a; g /= a; bl /= a;

      /* a zászló szélének lágyítása: a szélső 1-2 pixel átmenetesen
         tűnik el, így nincs "kivágott" éles kontúr */
      let alfa = 1;
      if (b.elsimitas > 0) {
        const s = b.elsimitas;
        const perem = Math.min(
          x01 * sz / s, (1 - x01) * sz / s,
          y01 * mag / s, (1 - y01) * mag / s);
        alfa = Math.max(0, Math.min(1, perem));
      }

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

      /* a cél-pixel(ek) kitöltése (ha sűrűbben számolunk, blokkot írunk) */
      for (let dy2 = 0; dy2 < valt && py + dy2 < ch; dy2++) {
        for (let dx2 = 0; dx2 < valt && px + dx2 < cw; dx2++) {
          const ti = ((py + dy2) * cw + (px + dx2)) * 4;
          ca[ti] = r; ca[ti + 1] = g; ca[ti + 2] = bl;
          ca[ti + 3] = Math.round(alfa * 255);
        }
      }
    }
  }

  ctx.putImageData(celAdat, cx, cy);
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
