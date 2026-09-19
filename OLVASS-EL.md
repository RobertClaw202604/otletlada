# 💡 Ötletláda — mini weboldal

**A futó, épülő és jövőbeli projektek és ötletek egy oldalon.**

---

## ▶️ Indítás

### 🌐 Online (bármely gépről, bármikor)

**https://robertclaw202604.github.io/otletlada/** — ez az élő, megosztható cím.

### 💻 Helyben (a gépeden)

**Nyisd meg az `index.html`-t** dupla kattintással. Ennyi — fut böngészőben,
nincs telepítés, nincs szerver.

---

## Mit tud

**Egy oldalon látod az összes projektet** — kártyákon, státusz szerint
színezve (🟢 működő · 🔥 elindított · 🔒 zárt · 🆕 ötlet).

**Rákattintasz egy kártyára** → megnyílik a részletes leírás:
- a projekt teljes bemutatása
- **🎯 Mi van még hátra** — a nagy feladatok és a részfeladatok
- **📝 Megjegyzés** — ide írhatsz bármit

---

## 📖 Szakmai alapok — a főoldal másik menüpontja

A fejlécben a **📖 Szakmai alapok** gomb átvisz egy másik nézetre: ez **nem a
te projektjeid listája**, hanem a **közös szakmai háttere** — mi az, amit
minden digitális terméknél meg kell csinálni, és **milyen sorrendben**.

Hat kinyitható szakasz:

| # | Szakasz | Miről szól |
|---|---|---|
| 1 | 🧭 **A hét fázis** | Felfedezés → validálás → építés → bevezetés → növekedés → megtartás → skálázás |
| 2 | 🏗️ **A nagy feladatcsoportok** | 12 csoport (A–L), a standard részfeladatokkal |
| 3 | 📚 **Sikeres esettanulmányok** | Airbnb, Dropbox, Stripe, Slack, Notion, Superhuman, Basecamp |
| 4 | 🔬 **Módszertan** | Lean Startup, Jobs to Be Done, Design Thinking, Business Model Canvas, AARRR |
| 5 | 📋 **A javasolt sorrend** | Hat projekttípus, mindegyiknél a helyes útvonal |
| 6 | ⚠️ **Ami kimarad** | A bukás hét tipikus oka |

**Miért van ez az oldalon?** Hogy a kártyákon szereplő feladatok
**ne ötletszerűek** legyenek, hanem egy ismert szakmai szerkezetet kövessenek.
Ha egy kártyánál nem tudod, mi a következő lépés, itt megnézheted, mit mond a
szakma.

---

## 🎯 A nagy feladatok — minden projektnél ugyanaz a lista

**Ez NEM választható lista!** Minden projektnél **mind a 14 nagy feladat
megjelenik**, és mindegyikhez külön tudsz részfeladatokat felvenni:

> Teljes speckó · Üzleti modell · Kész szoftver · Publikálás ·
> Láthatóság maximalizálás · Sales · Marketing · SEO · eDM / hírlevél ·
> Hirdetés (Ads) · Tartalom / blog · Jogi / adatvédelem · Árazás ·
> Partnerkapcsolat

**Hogyan használod:**
1. **Rákattintasz a nagy feladat nevére** → lenyílik
2. **⬜ pipa** a nagy feladatnál → az egész blokk kész
3. Alatta **részfeladatokat** veszel fel (pl. a *Marketing* alatt:\n   arculat, FB oldal, kampány)
4. A **kis pipával** a részfeladatokat is kipipálod
5. A fejlécen látszik, hány részfeladat kész (pl. `2/3`)

**Új nagy feladatot is felvehetsz** — a lista alján: írd be (pl. „B2B sales"),
és máris ott van. Ez **csak annál a projektnél** jelenik meg, és a 🗑 gombbal
törölhető. A 14 fix blokk nem törölhető, mert azok minden projektnél kellenek.

👉 Ha egy **új nagy feladatot minden projektnél** szeretnél, szólj — és
beírom a `NAGY_FELADATOK` listába a `projektek.js`-ben.

**A kártyán látod a haladást:** hány nagy feladat kész (pl. `3/14`),
hány részfeladat van hátra, és egy zöld folyamatjelző sáv.

**Szűrés és keresés:** a felső gombokkal státusz szerint szűrhetsz,
a keresőmezőben pedig bármire kereshetsz (projektnév, leírás, feladat szövege).

---

## Hol tárolódnak a módosításaid

Amit a felületen írsz, azt a **böngésző tárolja** (localStorage) — ezen a
gépen, ebben a böngészőben. Bezárhatod, újranyithatod, megmarad.

⚠️ **Ez azt jelenti, hogy:** ha másik gépen nyitod meg, ott nem látod a
módosításaidat. Ha a böngésző adatait törlöd, elvesznek.

**Megoldás — mentsd ki:**
- **⬇︎ Adatok mentése (JSON)** — géppel olvasható mentés
- **⬇︎ Összefoglaló Markdown** — szép, olvasható összefoglaló, feladatokkal

- **↺ Minden módosítás visszaállítása** — vissza az eredeti állapotra

👉 **Ha valamit véglegesíteni akarsz, küldd el nekem a JSON-t vagy a
Markdown-t** — és beírom a `projektek.js`-be, így mindenkinél,
minden gépen megjelenik.

---

## A `projektek.js` — ez a forrás

A **`projektek.js`** fájl tartalmazza az összes projekt adatát.
Ezt **te is szerkesztheted** — a weboldal innen épül fel.

Egy projekt így néz ki:

```js
{
  id: "arworks",
  nev: "ARworks",
  url: "https://arworks.hu",
  statusz: "mukodo",            // mukodo | elinditott | zart | otlet | parkolo | elvetve
  kategoria: "Ügynökség / B2B",
  rovid: "Egy soros lényeg.",
  leiras: `Hosszabb leírás. **Félkövér** és \`kód\` is lehet benne.`,
  hatralevo: [                  // a nagy feladat-blokkok
    { feladat: "Teljes speckó", kesz: false },
    { feladat: "Marketing", kesz: false, reszfeladatok: [
        { szoveg: "Arculat", kesz: false },
        { szoveg: "Facebook oldal", kesz: true }
    ]}
  ],
  megjegyzes: ""
}
```

**⚠️ Fontos:** a `hatralevo` listában **mind a 14 nagy feladatnak szerepelnie
kell** — a weboldal a `projektek.js`-ben lévő listát jeleníti meg. Ha kézzel
írsz be újat, másold a `NAGY_FELADATOK` listából a nevét pontosan.

**Új részfeladat:** a `reszfeladatok` listába `{ szoveg: "...", kesz: false }`.

**Új projekt hozzáadása:** másolj le egy teljes blokkot, és írd be a sajátját.

**Új nagy feladat MINDEN projekthez:** a `NAGY_FELADATOK` listába vedd fel —
de utána minden projekt `hatralevo` listájába is be kell írni.

---

## Fájlok

| Fájl | Mi ez |
|---|---|
| **`index.html`** | **ezt nyisd meg** — a teljes felület |
| **`projektek.js`** | **az adatok** — a projektek, feladatok, státuszok |
| `OLVASS-EL.md` | ez a fájl |
| `README.md` | rövid összefoglaló |
| `_test.js` | automata teszt (36/36) — nem kell a használathoz |

---

## 🌐 Az online változat (GitHub)

**Élő oldal:** https://robertclaw202604.github.io/otletlada/

**Forráskód:** https://github.com/RobertClaw202604/otletlada

A **`main` ág** tartalma jelenik meg az élő oldalon (GitHub Pages).
Ha módosítasz valamit és feltöltöd, az oldal 1-2 percen belül frissül.

⚠️ **Fontos:** az online oldalon a módosításaid **a te böngésződben**
tárolódnak — ez nem egy szerver, hanem egy statikus oldal. Ezért van
a **JSON / Markdown export**: amit véglegesíteni akarsz, küldd el nekem,
és beírom a `projektek.js`-be. Akkor mindenkinél, minden gépen megjelenik.

---

## Jelenlegi állapot (2026-09-19)

**17 projekt/ötlet:**
- 🟢 Működő: **2** — ARworks, TabLog
- 🔥 Elindított: **8** — KínaiAuto, DarwinAI, Emlékkönyv, Ex Libris Video,
  Egyéni Tanrend, Databike, CogniView, Ride to Race
- 🔒 Zárt rendszer: **4** — DrinkDeal, SalesGenAI, EventAI, TenderRadar
- 🆕 Ötlet: **3** — Vizsgáztató AI, AI-tudás teszt (HR), Borászatok térképe

Forrás: `knowledge/otletlada-v2.md`

---

*Ötletláda web · 2026-09-19 · ARworks*
