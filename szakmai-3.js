/* ============================================================
   SZAKMAI ALAPOK 3. rész — sorrend-projekttípusonként + a csoportok összevetése
   ============================================================ */

const SZAKMAI_3 = [

{
  id: "sorrend",
  cim: "📋 A javasolt sorrend — projekttípusonként",
  rovid: "Nem minden projekt megy ugyanazon az úton. Hat tipikus projekttípus, mindegyiknél a helyes sorrend, az első három lépés és a leggyakoribb hiba.",
  torzs: `
A hét fázis minden projektnél ugyanaz, de a **hangsúly és a sorrend** típusonként változik. Az alábbi hat típus lefedi szinte az összes digitális kezdeményezést. Mindegyiknél megadom, **mivel kezdd**, és **hol szokott elakadni**.

---

### 1. Belső eszköz, amit később termékké alakítasz
*Példa a listádból: Ötletláda, Databike, Ride to Race*
**A sorrend:** saját használat → belső csiszolás → külső teszt 3–5 emberrel → nyilvános.
**Első három lépés:** (1) oldd meg a **saját** fájdalmadat, (2) használd naponta 2 hétig, (3) kérdezd meg, másnak is fáj-e.
**A buktató:** azonnal termékként kezelni. Előbb bizonyítani kell, hogy **rajtad kívül** is kell.
**A jel, hogy termékké válhat:** mások kérik, hogy hadd használják.

### 2. B2B szoftver értékesített ügyfelekkel
*Példa: ARworks szolgáltatások, SalesGen, TenderRadar*
**A sorrend:** probléma-interjú a döntéshozóval → egyedi megoldás **egy** ügyfélnek → fizetett pilot → általánosított termék.
**Első három lépés:** (1) 10 interjú a döntéshozóval, (2) egy fizetett próbaprojekt, (3) a tanulságokból termék.
**A buktató:** a terméket **a vevő előtt** megépíteni. B2B-nél a **pilot az MVP**.
**A jel, hogy jó úton vagy:** az első ügyfél fizet, és **ajánl** valakit.

### 3. Előfizetéses fogyasztói termék
*Példa: Emlékkönyv, Ex Libris Video, KínaiAuto (tartalom)*
**A sorrend:** probléma validálása → MVP → megtartás (nem a növekedés!) → növekedés.
**Első három lépés:** (1) landoló oldal + 100 érdeklődő, (2) működő MVP 20 felhasználóval, (3) a 30 napos visszatérési arány mérése.
**A buktató:** hirdetéssel növekedni, amikor a **megtartás** még lyukas. Ez a legdrágább hiba.
**A jel:** a felhasználók **maguktól** visszajönnek.

### 4. Piactér vagy közösségi platform
*Példa: Borászatok térképe, Ride to Race (klubok)*
**A sorrend:** az **egyik oldal** kézben felépítése → a másik oldal → hálózati hatás.
**Első három lépés:** (1) válaszd ki a szűkebb oldalt (pl. a borászatok), (2) szerezz kézzel 20-at, (3) csak utána nyisd a fogyasztói oldalt.
**A buktató:** mindkét oldalt egyszerre nyitni — így **egyik sem** lesz elég sűrű.
**A jel:** az egyik oldal **magától** hozza a másikat.

### 5. Intézményi vagy oktatási megoldás
*Példa: Vizsgáztató AI, Egyéni Tanrend*
**A sorrend:** egy intézmény, egy tantárgy, egy csoport → mérés → kiterjesztés.
**Első három lépés:** (1) egy tanárral vagy vezetővel közös pilot, (2) 1 tantárgy, 10–20 tétel, (3) mérhető eredmény összehasonlítás.
**A buktató:** rögtön rendszerszintű integrációt ígérni (KRÉTA, teljes tanév). Az intézményi döntés **lassú**, kezdd kicsiben.
**A jel:** az intézmény **magától** kéri a kiterjesztést.

### 6. HR vagy szervezeti eszköz
*Példa: AI-tudás teszt (HR)*
**A sorrend:** a **vevő** tisztázása (HR vagy fejvadász?) → egy céggel pilot → referencia → termék.
**Első három lépés:** (1) 10 interjú HR-vezetőkkel, (2) egy céggel élő pilot, (3) írásos referencia.
**A buktató:** a módszertant kidolgozni **vásárló nélkül**. Itt a bizalom a szűk keresztmetszet, nem a technológia.
**A jel:** a cég **fizet** a pilotért, és nevet ad referenciának.

---

### A közös sorrend minden típusnál

| Lépés | Mit csinálsz | Mikor lépsz tovább |
|---|---|---|
| **1.** | Probléma és célcsoport tisztázása | 5+ ember ugyanazt a fájdalmat írja le |
| **2.** | Kicsi, valódi megoldás | Legalább 3 ember használja, nem csak megnézi |
| **3.** | Első fizető vagy elköteleződő ügyfél | Van bevétel vagy aláírt szándék |
| **4.** | Ismételhető szerzés | A folyamat **nem** egyszeri szerencse |
| **5.** | Megtartás és méret | A növekedés nem rajtad múlik |

**Aranyszabály:** az **első három lépés** minden típusnál **kézzel, emberi léptékben** történik. Automatizálni csak azt szabad, ami **bizonyítottan működik**. Aki a folyamat előtt automatizál, az **hibát skáláz**.
`
},

{
  id: "hianyzo",
  cim: "⚠️ Ami a leggyakrabban kimarad — a bukás tipikus okai",
  rovid: "A bukott digitális projektek nem véletlenszerűen halnak meg. Hét visszatérő minta, és hogyan kerüld el őket — a saját listád tanulságaival.",
  torzs: `
Az esettanulmányok és a szakirodalom alapján a kudarc **nem véletlenszerű**. Ugyanaz a hét minta ismétlődik, újra és újra. Ha ezeket elkerülöd, már **az átlagnál jobb eséllyel indulsz**.

---

### 1. A validálás kihagyása
**Hogyan néz ki:** hetekig-hónapokig építesz, mert „úgyis kell". Az első valódi felhasználónál derül ki, hogy nem azt akarja.
**Miért drága:** a **legdrágább hiba**, mert a teljes fejlesztést el lehetett volna kerülni 20 beszélgetéssel.
**Ellenszer:** az első interjúk **az első kód előtt** legyenek meg.

### 2. A „mindenkinek jó" csapda
**Hogyan néz ki:** a célcsoport „minden cég", „minden iskola", „mindenki, aki…".
**Miért drága:** akinek mindenki a célcsoportja, annak **senki sem az**. Az üzenet elkopik, a marketing szétszóródik.
**Ellenszer:** a legszűkebb, legfájóbban érintett csoporttal kezdj (beachhead).

### 3. Építés a láthatóság előtt
**Hogyan néz ki:** elkészül a termék, és **csend** van. Senki nem tud róla.
**Miért drága:** a legjobb termék sem ér semmit, ha senki nem talál rá.
**Ellenszer:** a **bevezetés a fejlesztéssel párhuzamosan** készüljön, ne utána.

### 4. A megtartás elhanyagolása
**Hogyan néz ki:** folyamatosan új ügyfelet hajszolsz, mialatt a régiek csendben elmennek.
**Miért drága:** az új ügyfél megszerzése **többszörösébe kerül** a meglévő megtartásánál. A lyukas vödör soha nem telik meg.
**Ellenszer:** a **lemorzsolódás** legyen az első szám, amit figyelsz.

### 5. Az ár elrejtése
**Hogyan néz ki:** „kérj ajánlatot", „az ár egyedi". A látogató nem tud dönteni, és elmegy.
**Miért drága:** az elrejtett ár **bizalmatlanságot** kelt, és elriasztja a komoly vevőket is.
**Ellenszer:** nyilvános, egyszerű árazás. Ha bonyolult, akkor a **csomagok** tegyék egyszerűvé.

### 6. A szétszórt figyelem
**Hogyan néz ki:** tizenkét projekt félkészen, egyik sem kész. Mindig az jön, amelyik épp izgalmas.
**Miért drága:** a **kontextusváltás** a legnagyobb rejtett költség. Egy befejezett projekt többet ér, mint öt elkezdett.
**Ellenszer:** legfeljebb **1–2 projekt** fut egyszerre, a többi **parkolóban** van. Ez az Ötletláda egyik fő értelme.

### 7. A haldokló projekt
**Hogyan néz ki:** nem bukik meg, nem is nő. Hónapokig „majdnem kész". Nem mersz leállni, mert már sok munka van benne.
**Miért drága:** ez a **legdrágább** vereség, mert folyamatosan viszi az energiát, a pénzt és a figyelmet — miközben a **bevétel nulla**.
**Ellenszer:** előre rögzített **kill criteria**, és a bátorság, hogy ki is mondd.

---

### A saját listád tükrében
Végignézve a 17 projektedet, a minták **jól láthatók**:

- **A validálás** néhány projektnél már megvan (ARworks, TabLog működik, van ügyfél) — másoknál viszont **még hiányzik**. Az „ötlet" státuszú elemeknél ez a **következő lépés**, nem a fejlesztés.
- **A láthatóság** több projektnél gyenge pont: kész a termék, de nincs mögötte üzenet, tartalom, csatorna.
- **A megtartás** a legtöbb projektnél **egyáltalán nem szerepel** a feladatok között — pedig ez a növekedés előfeltétele.
- **A szétszórt figyelem** a legnagyobb rejtett kockázat: **17 projekt** egyszerre nem tud mind futni. A parkoló rovat pont ezért hasznos.
- **Az árazás** több helyen nyitott kérdés, holott a nyilvános ár **bizalmat épít**.

> **Az egyetlen legfontosabb tanulság:** a sorrend nem dísz. Aki a **2. lépést** (validálás) kihagyja, és a **3.-ba** (építés) ugrik, az nem gyorsabban halad — hanem **zöld utat ad a bukásnak**.
`
}

];
