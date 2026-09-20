# Hajózási zászló-ábécé fordító — Teljes specifikáció

**Verzió:** v1.0 · **Dátum:** 2026-09-20 · **Státusz:** Ötlet (specifikálva)
**Projekt-azonosító:** `zaszlo-abc`

---

## 1. Egy mondatban

Egy böngészőben futó mini weboldal, amely bármilyen beírt szöveget lefordít a nemzetközi hajózási jelzőzászlókra, és azt háromféleképpen jeleníti meg — egymás mellett, egyesével lépegetve, vagy videóként —, a zászlók valósághű lobogásával.

---

## 2. Mi ez valójában

**Nem üzleti termék, hanem megosztható eszköz.** A cél, hogy az emberek maguktól megosszák — mert róluk szól (a saját nevük, a céges nevük zászlókon). Ez a fajta eszköz **több figyelmet hoz, mint egy szolgáltatáslista**, és természetes módon vezet át a DarwinAI szolgáltatás bemutatására.

**A siker mérőszáma nem a bevétel, hanem:**
- hányan nyitják meg,
- hányan osztják meg (kép vagy videó),
- hányan kattintanak tovább a szolgáltatásra.

---

## 3. Funkcionális követelmények

### 3.1 Bemenet

| Elem | Leírás |
|---|---|
| Szövegmező | Szabad szöveg, max. 40 karakter (a hosszabb olvashatatlan) |
| Érvényes karakterek | A–Z, 0–9, szóköz |
| Kezelés | Kis/nagybetű nem számít; az ékezetek egyszerűsödnek (Á→A, É→E, Ő→O) |
| Ismeretlen karakter | Helykitöltő zászló, illetve a szóköz üres hézag |

### 3.2 A zászlókészlet

- **Nemzetközi jelzőzászlók** (International Code of Signals): 26 betű + 10 számjegy.
- **Helyettesítő zászlók** (*substitutes*): ismétlődő betűk jelölésére — opcionális, v1-ben kihagyható.
- Formátum: **egyedi SVG** minden zászlóra (éles, skálázható, kicsi fájl).
- Minden zászló **2:3 arányú** (a szabványos jelzőzászló-forma).

### 3.3 Megjelenítési módok

#### A) Sorban, egymás mellett
- A teljes szó zászlói **egy sorban**, kifeszítve — ez a klasszikus *signal hoist*.
- Minden zászló alatt a hozzá tartozó betű halványan (kikapcsolható).
- **PNG-export** gomb: a teljes zászlósor letölthető egy képként (2× felbontásban, átlátszó vagy fehér háttérrel).

#### B) Egyesével, egymás után
- Egyszerre **csak egy** zászló látszik — ahogy a jelet egyszerre olvassák.
- Léptetés: **automatikus** (beállítható sebesség: 0,5–3 másodperc) vagy **kézi** (előre/hátra gomb).
- Alul pontjelző: hányadik betűnél tart.
- Opcionális: a betű felirata a zászló alatt.

#### C) Videó
- A teljes folyamat felvétele: a zászlók sorban megjelennek, lobognak, majd a teljes szó látszik.
- **Letölthető** fájl (WebM; MP4, ha a böngésző támogatja).
- Felbontás: 1920×1080 és 1080×1920 (álló, közösségi médiához).
- Időtartam: a szó hosszától függ, kb. 3–8 másodperc.
- **Szerver nélkül** készül: a canvas-t rögzíti a böngésző, helyben.

### 3.4 A lobogás-animáció

Ez a projekt lelke. A zászlók **nem statikusak** — úgy mozognak, mintha szél fújná őket.

**A módszer:** a zászló felületét **függőleges oszlopokra** bontjuk. Minden oszlopot egy **szinusz-görbe** mentén toljuk el:

```
eltolás(x, t) = A · sin(2π · (x / λ) − ω · t) · csillapítás(x)
```

| Jel | Jelentés | Javasolt érték |
|---|---|---|
| `A` | amplitúdó (hullám magassága) | a zászló magasságának 4–8%-a |
| `λ` | hullámhossz | a zászló szélességének ~0,8–1,2-szerese |
| `ω` | szögsebesség (tempó) | lassú, kb. 0,8–1,5 periódus/másodperc |
| `csillapítás` | a rögzített él felé csökken | a rúd felőli szél mozdulatlan |

**Lényeges részletek:**
- A **rögzített él** (a rúd felőli oldal) nem mozdul — a hullám onnan indul.
- A **szabad él** mozog a legnagyobbat.
- A zászló széle is **hullámosan vetül** — nem csak eltolódik, hanem a széle is követi a görbét.
- Opcionális: enyhe **fény-árnyék** a redőknél, hogy vászonszerű legyen.
- Két zászló **kissé eltérő fázisban** lobog — így nem tűnik mechanikusnak.

### 3.5 Felület

- Egy oldal, felül a szövegmező, alatta a három mód füle (A / B / C).
- Mobilon minden egy hasábban, nagy gombokkal.
- Sötét téma az alap (a zászlók jól mutatnak rajta).
- **Nyelv:** magyar, a szövegek rövidek.
- Minden gomb felirata magyar, a technikai kifejezések zárójelben.

---

## 4. Nem-funkcionális követelmények

| Szempont | Elvárás |
|---|---|
| Futás | **Kizárólag böngészőben**, szerver nélkül |
| Telepítés | Nincs — egy statikus oldal |
| Betöltés | 1 másodperc alatt, gyors mobilon is |
| Függőség | **Nincs** külső könyvtár, nincs CDN (mint az Ötletláda) |
| Böngészők | Chrome, Safari, Firefox, Edge (utolsó 2 verzió) |
| Adatvédelem | Semmit nem küld el, semmit nem tárol a szerveren |
| Nyelv | Magyar felület |
| Akadálymentesség | Billentyűzettel is kezelhető, a zászlóknak szöveges címkéje van |

---

## 5. Technikai terv

### 5.1 Fájlszerkezet

```
zaszlo-abc/
├── index.html      — a felület (egyetlen oldal)
├── app.js          — a logika (fordítás, módok, export)
├── flags.js        — a zászlókészlet (SVG-adatok)
├── lobogas.js      — a hullám-animáció (canvas)
├── stilus.css      — a megjelenés
└── OLVASS-EL.md    — rövid útmutató
```

### 5.2 A fordítás

```
beírt szöveg
   → ékezet-egyszerűsítés (Á→A, Ő→O, …)
   → nagybetűsítés
   → karakterenként zászló-azonosító
   → a három mód valamelyike
```

Az ékezet-egyszerűsítés **kulcsfontosságú**: a magyar nevek (pl. „Budaházy Szabolcs") csak így lesznek zászlózhatók.

### 5.3 A renderelés

**Canvas** (nem SVG-dom), mert:
- a lobogást pixel-szinten kell torzítani — azt csak canvas tudja jól,
- a videófelvétel is canvas-ról megy,
- a PNG-export is canvas-ból készül.

A zászlók **SVG-ként tárolva**, de **canvas-re rajzolva** (a `drawImage` egy előre betöltött `Image`-ből).

### 5.4 A videó

```
canvas → captureStream(30)
       → MediaRecorder(WebM)
       → Blob → letölthető link
```

Ez **teljesen helyben** fut, a böngészőben. Nincs feltöltés, nincs szerver, nincs költség.

---

## 6. Határok — mit NEM tud az első verzió

- **Nem** ismeri a teljes jelzés-rendszert (nem fejt meg valódi hajós üzeneteket).
- **Nem** kezel több szót külön zászlósorként (v1: egy folyamatos sor).
- **Nincs** felhasználói fiók, mentett előzmény, galéria.
- **Nincs** hang, zene a videó alá (v2-ben lehet).
- **Nem** szerkeszthető a zászlókészlet a felületen.

Ezek **szándékos** határok: a cél a gyors, egyszerű, megosztható eszköz.

---

## 7. Mérföldkövek

| # | Mérföldkő | Mit tartalmaz | Állapot |
|---|---|---|---|
| 1 | Zászlókészlet | 36 zászló SVG-ben, ellenőrizve | ⬜ |
| 2 | Fordító mag | szöveg → zászlósor, ékezet-kezelés | ⬜ |
| 3 | A mód — sorban | canvas-renderelés + PNG-export | ⬜ |
| 4 | Lobogás | a hullám-animáció, valósághűen | ⬜ |
| 5 | B mód — egyesével | lépegetés, sebesség, pontjelző | ⬜ |
| 6 | C mód — videó | felvétel, letöltés, két felbontás | ⬜ |
| 7 | Felület | a három mód füle, mobil nézet, sötét téma | ⬜ |
| 8 | Publikálás | GitHub Pages, élő cím | ⬜ |

**A 4. mérföldkő (lobogás) a kritikus** — ha az nem lesz meggyőző, az egész elveszti a varázsát. Ezért érdemes **először egyetlen zászlón** kidolgozni, és csak utána terjeszteni ki a teljes sorra.

---

## 8. Nyitott kérdések

1. **Melyik zászlórendszer?** A nemzetközi jelzőzászlók a legismertebbek, de léteznek magyar folyami jelzések is. Javaslat: **nemzetközi** (ez a felismerhető).
2. **Kell-e mind a három mód** az első verzióban, vagy elég az A) + C)?
3. **Legyen-e megosztható link** — a beírt szó az URL-ben, hogy egy kattintással megosztható legyen?
4. **Hova vezessen a szolgáltatás-link?** A DarwinAI oldalára, vagy egy külön landoló oldalra?
5. **Kell-e magyar ékezet a zászlók alatt** (megtartva az eredeti betűt)?

---

## 9. Kockázatok

| Kockázat | Súlyosság | Kezelés |
|---|---|---|
| A lobogás nem lesz meggyőző | **Nagy** | Először egy zászlón kidolgozni, és összevetni valódi zászlófelvétellel |
| A videóexport lassú mobilon | Közepes | Kisebb felbontás, rövidebb szó |
| A zászlók rajzolása pontatlan | Közepes | Ellenőrzött SVG-forrás (hivatalos jelzőzászló-rajzok) |
| A betűk nem férnek el egy sorban | Kicsi | Tördelés több sorba, vagy görgetés |
| A böngésző nem támogatja a felvételt | Kicsi | Ha nincs, a C) mód egyszerűen nem jelenik meg |

---

## 10. Összefoglalás

A projekt **kicsi, önálló és ma megépíthető**. A legnagyobb értéke nem a technológia, hanem a **megoszthatóság**: az emberek a saját nevüket akarják zászlókon látni, és az ilyet szívesen posztolják. A fejlesztés **egy nap alatt** végigvihető, ha a lobogás-animáció sikerül — és éppen ez az, amit érdemes először megcsinálni, mert ez dönti el, hogy az egész működik-e.

**A következő lépés:** egy zászló lobogásának kidolgozása és összevetése valódi felvétellel. Ha az meggyőző, a többi már csak ismétlés.

---

*Dokumentum: `zaszlo-abc-spec.md` · Kapcsolódó: Hajózási zászló-ábécé fordító (Ötletláda)*
