# Hajózási zászló-ábécé fordító — használat

**Élő oldal:** https://robertclaw202604.github.io/otletlada/zaszlo-fordito.html

## Mit tud

Bármilyen szöveget (max. 40 karakter) lefordít a **nemzetközi hajózási
jelzőzászló-ábécére** (International Code of Signals), és **lobogó
animációval** megmutatja. Az ékezetek automatikusan egyszerűsödnek
(Á→A, Ő→O, Ű→U stb.), a kisbetűkből nagybetű lesz.

## A három megjelenítési mód

### A) Sorban — `zászlósor`
A zászlók egymás mellett, kifeszítve, mint egy igazi zászlósor
(*signal hoist*). Így látszik a teljes szó egyben.

- **PNG letöltése** — átlátszó/sötét hátterű kép.
- **PNG (fehér háttér)** — nyomtatáshoz, dokumentumba.
- **Link másolása** — megosztható link, amelyben benne van a szó.
  Aki megnyitja, ugyanazt látja.

### B) Egyesével
Egyszerre csak **egy** zászló látszik, nagyban. Lépegethetsz
(Előző / Következő, vagy ← → billentyű), illetve **automatikusan**
léptetheted 0,5 / 1 / 1,5 / 2 / 3 másodperces tempóban. Így látszik,
ahogyan a jelet valójában olvassák: egyszerre egyet.

### C) Videó
A teljes folyamat felvétele: a zászlók sorban megjelennek, majd
lobognak. A videó **teljesen a böngészőben** készül (nincs szerver,
nincs feltöltés).

- Felbontás: 1920×1080 (fekvő), 1080×1920 (álló, közösségi), 1280×720
- Hossz: 3–12 másodperc
- Háttér: sötét vagy világos
- Letöltés: WebM (a legtöbb böngésző és közösségi oldal elfogadja)

## A lobogás

- A **rögzített él** (a rúd felőli oldal) nem mozdul.
- A **szabad él** mozog a legnagyobbat.
- A zászló **körvonala is hullámzik** — nem marad téglalap, hanem
  perspektivikusan torzul, mint egy igazi szélben lobogó zászló.
- A szomszédos zászlók **kissé eltérő fázisban** lobognak, hogy ne
  tűnjön mechanikusnak.

## A csúszkák

| Csúszka | Mit állít |
|---|---|
| **Amplitúdó** | Mekkorát hullámzik a zászló. |
| **Hullámhossz** | Milyen sűrű a redőzet. |
| **Tempó** | Milyen gyorsan lobog. |
| **Fodrozódás** | A másodlagos, finomabb hullám erőssége. |
| **Mélység-torzítás** | A körvonal perspektivikus torzulása. 0 = sík, 1 = természetes, 2 = erős. |

## Technikai háttér

- A zászlók **SVG-ben** készülnek (`flags.js`), 2:3 arányban, 36 jel
  (26 betű + 10 számjegy).
- A lobogást **WebGL** számolja (`lobogas-webgl.js`), csillapított
  szinusz-rezgéssel — ez adja a valósághű mozgást.
- **Teljesítmény:** 60 fps 16 zászlónál, 1716×930 képponton
  (Apple M4, ANGLE/Metal). A kulcs a **textúra-cache**: zászlónként
  egyszer töltődik fel a kép a videokártyára.
- **Nincs szerver, nincs külső függőség** — minden a böngészőben fut.

## Fájlok

| Fájl | Szerep |
|---|---|
| `zaszlo-fordito.html` | A teljes oldal (ez az, amit meg kell nyitni). |
| `zaszlo-app.js` | A fordítás, a rajzolás és az exportok logikája. |
| `lobogas-webgl.js` | A WebGL lobogás-motor. |
| `flags.js` | A 36 jelzőzászló SVG-rajza. |

Az oldal működéséhez mind a négy fájl kell, **ugyanabban a mappában**.

## Verzió

- 2026-09-20 — teljes mini web (A/B/C mód, PNG + videó export).
  Az 5. mérföldkő (perspektivikus torzítás) motorja van benne.
