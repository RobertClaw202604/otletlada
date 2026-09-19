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
- **🎯 Mi van még hátra** — a feladatlista
- **📝 Megjegyzés** — ide írhatsz bármit

**Feladatot írhatsz fel** közvetlenül a részletes nézetben:
1. Válassz **típust** a legördülőből (Teljes speckó, Üzleti modell,
   Kész szoftver, Publikálás, Láthatóság maximalizálás, Sales, Marketing,
   SEO, eDM, Hirdetés, Tartalom, Jogi, Árazás, Partnerkapcsolat, Egyéb)
2. Írd be, **mit kell megcsinálni**
3. **+ Hozzáadás**

A kész feladatot bepipálod → áthúzva, a lista aljára kerül.
A 🗑 gombbal törölhetsz.

**A kártyán látod a haladást:** hány feladat van hátra, és egy zöld
folyamatjelző sáv mutatja, mennyi készült el.

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
  hatralevo: [
    { szoveg: "Szerver-migráció", tipus: "Publikálás", kesz: false },
    { szoveg: "eDM kampány", tipus: "eDM / hírlevél", kesz: false }
  ],
  megjegyzes: ""
}
```

**Új projekt hozzáadása:** másolj le egy blokkot, és írd be a sajátját.
A weboldal automatikusan felveszi.

**Új feladat:** a `hatralevo` listába egy új `{ szoveg: "...", tipus: "..." }`.
Elég ennyi is: `{ szoveg: "..." }`.

**Új státusz:** a `STATUSZOK` objektumban vehetsz fel újat (szín + ikon + címke).

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

**16 projekt/ötlet:**
- 🟢 Működő: **2** — ARworks, TabLog
- 🔥 Elindított: **8** — KínaiAuto, DarwinAI, Emlékkönyv, Ex Libris Video,
  Egyéni Tanrend, Databike, CogniView, Ride to Race
- 🔒 Zárt rendszer: **4** — DrinkDeal, SalesGenAI, EventAI, TenderRadar
- 🆕 Ötlet: **2** — Vizsgáztató AI, Borászatok térképe

Forrás: `knowledge/otletlada-v2.md`

---

*Ötletláda web · 2026-09-19 · ARworks*
