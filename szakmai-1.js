/* ============================================================
   SZAKMAI ALAPOK 1. rész — a termék életciklusa + munkacsoportok
   Forrás: szakmai könyvek és sikeres esettanulmányok
   ============================================================ */

const SZAKMAI_1 = [

{
  id: "fazisok",
  cim: "🧭 A hét fázis — a termék életciklusa",
  rovid: "A digitális termék a felfedezéstől a skálázásig hét szakaszon megy át. A sorrend nem ízlés kérdése: minden fázis a következő bemenetét adja.",
  torzs: `
A sikeres digitális termékek irodalma (Ries: *The Lean Startup*; Blank: *Four Steps to the Epiphany*; Osterwalder: *Business Model Generation*; Cooper–Vlaskovits: *The Lean Entrepreneur*; Cagan: *Inspired*; Ries–Trout: *Positioning*) ugyanarra a gerincre fűzhető fel. A **sorrend** a lényeg: aki a marketinggel kezd, mielőtt a problémát validálta volna, pénzt éget el.

**Az alapelv:** minden fázisnak van egy **belépési feltétele** és egy **kimeneti bizonyítéka**. Ha nincs bizonyíték, nem lépünk tovább — hanem visszamegyünk.

---

### 1. Felfedezés — *Discovery*
**Kérdés:** Valódi, fájó probléma ez, és van-e, aki fizetne érte?
**Bemenet:** nyers ötlet, megfigyelés, saját bosszúság.
**Kimenet:** probléma-hipotézis + legalább 15–20 ügyfélinterjú.
**Eszköz:** *Problem Interview* (Blank) — soha nem a megoldást kínálod, hanem a **múltbeli viselkedést** kérdezed („Mikor történt ez utoljára? Mit tettél akkor? Mennyibe került?").
**Tipikus hiba:** a barátok megkérdezése. Ők kedvesek, nem vevők.
**Kész, ha:** 5+ ember ugyanazt a problémát írta le ugyanazokkal a szavakkal, és tudsz nevet adni a szegmensnek.

### 2. Validálás — *Validation*
**Kérdés:** Meg tudom-e oldani, és hajlandók-e ezért fizetni?
**Bemenet:** probléma-hipotézis.
**Kimenet:** *Minimum Viable Product* — a legkisebb dolog, ami **valódi értéket ad**, nem a legkisebb dolog, amit meg tudok építeni.
**Eszköz:** *Solution Interview*, működő demó, előrendelés, szándéknyilatkozat.
**A döntő mérőszám:** nem a tetszés, hanem az **elköteleződés** — fizetett előfizetés, aláírt LOI, letöltött és használt verzió.
**Kész, ha:** 10 fizető vagy 3 fizetni szándékozó ügyfél van a semminél is.

### 3. Építés — *Build*
**Kérdés:** Működik-e megbízhatóan, valódi felhasználókkal?
**Bemenet:** validált MVP-tézis.
**Kimenet:** működő termék a szűk körben (*private beta*).
**Eszköz:** iteratív fejlesztés, heti kiadás, felhasználói visszajelzés beépítése.
**Az aranyszabály:** *Build–Measure–Learn* ciklus, a lehető legrövidebbre húzva. Ne építs olyat, amire nincs visszajelzés.
**Kész, ha:** a felhasználók **maguktól** visszajönnek, és nem kell noszogatni őket.

### 4. Bevezetés — *Launch*
**Kérdés:** Eljut-e azokhoz, akiknek szól?
**Bemenet:** működő termék.
**Kimenet:** nyilvános elérhetőség, első valódi ügyfelek, első bevétel.
**Eszköz:** *go-to-market* terv — pozicionálás, üzenet, csatorna, árazás.
**Tipikus hiba:** „majd a termék eladja magát". Nem fogja. A kiváló termék és a láthatóság **két külön munka**.
**Kész, ha:** van egy ismételhető folyamat, amely ügyfelet hoz — nem egy szerencsés eset.

### 5. Növekedés — *Growth*
**Kérdés:** Honnan jön a következő száz ügyfél?
**Bemenet:** ismételhető értékesítési folyamat.
**Kimenet:** kiszámítható, mérhető ügyfélszerzés.
**Eszköz:** csatorna-tesztelés (tartalom, SEO, hirdetés, partner, sales), **egyszerre egy csatorna**, amíg nem térül meg.
**A kulcsmérőszám:** *CAC* (ügyfélszerzési költség) vs. *LTV* (ügyfélérték). Ha a LTV nem éri el a **3× CAC**-ot, a növekedés **pénzt éget**, nem értéket épít.
**Kész, ha:** a csatorna önmagát finanszírozza.

### 6. Megtartás — *Retention*
**Kérdés:** Miért maradnak, és miért mennek el?
**Bemenet:** növekvő ügyfélbázis.
**Kimenet:** alacsony lemorzsolódás, magasabb ügyfélérték.
**Eszköz:** bevezetési folyamat (*onboarding*), ügyfélszolgálat, termékfejlesztés a visszajelzésekből, közösség.
**A felismerés:** az új ügyfél megszerzése **5–7× drágább**, mint a meglévő megtartása. A növekedés előbb-utóbb falba ütközik, ha a megtartás lyukas.
**Kész, ha:** a lemorzsolódás alacsony és **csökkenő**.

### 7. Skálázás — *Scale*
**Kérdés:** Kibírja-e a rendszer, ha a tízszeresére nő?
**Bemenet:** kiszámítható szerzés és jó megtartás.
**Kimenet:** több piac, több termék, stabil működés.
**Eszköz:** folyamatautomatizálás, csapatépítés, technikai skálázás, új szegmensek.
**Kész, ha:** a növekedés nem a te személyes jelenléteden múlik.

---

### A visszacsatolás — ez a lényeg
A fázisok **nem szigorúan lineárisak**. Bármelyik szakaszban kiderülhet, hogy egy korábbi feltevés hibás. Ilyenkor **vissza kell menni**, nem előre menekülni. Az esettanulmányok tanulsága: a bukott termékek **90%-a nem a rossz építés**, hanem a **kihagyott validálás** miatt bukik el.

> *„A kudarc legfőbb oka nem az, hogy rosszul építettük meg, amit kellett, hanem hogy rosszat építettünk meg — jól."* — Eric Ries
`
},

{
  id: "munkacsoportok",
  cim: "🏗️ A nagy feladatcsoportok és részfeladataik",
  rovid: "Tizenkét nagy munkacsoport, amely minden digitális terméknél előjön — a stratégiától a jogig. Minden csoportnál ott vannak a standard részfeladatok és a buktatók.",
  torzs: `
Az alábbi 12 csoport **nem ötlet, hanem az ipari gyakorlat**. Egy komoly digitális terméknél mind a 12 megjelenik — a kérdés csak az, hogy **tudatosan** csinálod-e őket, vagy utólag fedezed fel, hogy kimaradt valami.

A sorrend nem véletlen: **A → B → C → D** a gerinc (megérteni, eldönteni, megépíteni, elindítani). Az **E → L** csoportok párhuzamosan futnak, de a belépésük a gerinc állapotától függ.

---

## A. STRATÉGIA ÉS KUTATÁS
*Belépés: van egy ötlet. Kilépés: tudod, kinek, mit, mennyiért.*

- **Probléma-meghatározás** — egy mondatban: kinek a fájdalmát oldod meg. Ha nem megy egy mondatban, nem megy sehogy.
- **Célcsoport-szegmentálás** — kik a legfájóbban érintettek, kik fizetnek a legkönnyebben. Kezdd a legszűkebbel (*beachhead market*, Blank).
- **Piackutatás** — mekkora a piac, ki a versenytárs, mi a helyettesítő megoldás **ma** (lehet, hogy Excel és telefon).
- **Versenytárs-elemzés** — ne a funkcióikat másold, hanem a **hézagaikat** keresd. Hol panaszkodnak a felhasználóik?
- **Ügyfélinterjúk** — 15–20 db, a **múltbeli viselkedésről** kérdezve. Ez a legtöbbet hozó, legkevesebbe kerülő feladat.
- **Pozicionálás** — egy mondat: „Ez a **kategória**, amely **előny**, mert **bizonyíték**." (Ries–Trout)
- **Értékajánlat** — mit nyer, mit veszít, mit tud felmutatni a főnökének.
- **Döntés: megvágjuk vagy elvetjük** — *kill criteria* előre, nem utólag, mert utólag minden ötlet szép.

## B. ÜZLETI MODELL ÉS ÁRAZÁS
*Belépés: tudod, kinek szól. Kilépés: tudod, miből lesz pénz.*

- **Bevételi modell** — előfizetés, egyszeri, tranzakciós díj, licenc, szolgáltatás, freemium. **Egy** modell, nem öt.
- **Árazás** — értékalapú, nem költség-alapú. Mennyit **ér meg** a megoldás az ügyfélnek? (Ha X Ft-ot spórol, az ár lehet X/10.)
- **Árazási struktúra** — csomagok, felhasználószám, használat. Kezdd 2–3 csomaggal, ne hússzal.
- **Költségszerkezet** — fix és változó költség; hol a fedezet. Az egység-gazdaságtan (*unit economics*) itt dől el.
- **LTV / CAC számítás** — ügyfélérték vs. szerzési költség. Ha a LTV nem éri el a **3× CAC**-ot, a növekedés önmagát eszi meg.
- **Terjeszkedési logika** — hogyan lesz a 10 ügyfélből 100: ugyanaz a termék több helyre, vagy a termék mélyebb.
- **Pénzügyi terv** — mikor lesz nullszaldós. Ez a *legfontosabb egyetlen szám* egy induló terméknél.

## C. TERMÉK ÉS SPECIFIKÁCIÓ
*Belépés: van üzleti modell. Kilépés: van, amit építeni lehet.*

- **Teljes specifikáció** — mit tud, mit **nem** tud. A „nem tud" lista legalább olyan fontos.
- **Felhasználói történetek** — *„Mint [szerep], szeretném [cselekvés], hogy [cél]."* Nem technikai feladat, hanem felhasználói szükséglet.
- **Felhasználói folyamatok** — a fő utak rajzban: belépés, érték, visszatérés. Ez a *happy path*.
- **Elsődleges érték pillanata** — a pillanat, amikor a felhasználó megérti, miért jó. Ezt **minél előbb** el kell érni (time-to-value).
- **MVP-határok** — mi az a legkisebb, ami **valódi értéket ad** (nem a legkisebb, amit meg tudok építeni).
- **Megvalósíthatóság** — tudjuk-e megcsinálni a jelenlegi technológiával és költségvetéssel.
- **Prototípus és kattintható demó** — a specifikáció **nem szöveges dokumentum**, hanem amit meg lehet nézni.
- **Technológiai döntések** — platform, architektúra, külső szolgáltatások, adatmodell. A későbbi visszafordítás drága, ezért itt lassan dönts.

## D. ÉPÍTÉS ÉS MINŐSÉG
*Belépés: van specifikáció. Kilépés: van működő, megbízható termék.*

- **Fejlesztés** — rövid ciklusokban, heti kiadással.
- **Verziókezelés** — minden változás nyomon követhető; az eredeti sosem vész el.
- **Tesztelés** — három szint: egység (működik-e a rész), integráció (összeillenek-e), **valódi felhasználóval** (értik-e).
- **Teljesítmény és stabilitás** — gyorsaság, terhelés, hibaarány.
- **Biztonság** — jogosultságok, jelszavak, naplózás, sebezhetőségek.
- **Adatkezelés** — mit tárolsz, hol, meddig, ki fér hozzá.
- **Üzemeltetés** — ki figyeli, mi történik hiba esetén, hogyan áll helyre.
- **Dokumentáció** — átadható tudás, hogy ne csak te tudd működtetni.

## E. JOGI ÉS MEGFELELÉS
*Belépés: tudod, milyen adatot kezelsz. Kilépés: nincs blokkoló jogi kockázat.*

- **Adatvédelmi tájékoztató** — GDPR, mit gyűjt, miért, meddig, kihez kerül.
- **Hozzájárulás-kezelés** — cookie-sáv, sütikezelés, visszavonás lehetősége.
- **Adatfeldolgozói szerződések** — a szolgáltatókkal (felhő, e-mail, analitika).
- **Felhasználási feltételek** — mit vállalsz, mit nem; felelősség korlátozása.
- **Szerzői jogok** — kép, zene, videó, szöveg, betűtípus jogtisztasága. Ez a leggyakoribb utólagos botlás.
- **Védjegy** — a név használható-e, be van-e védve.
- **Szakmai megfelelés** — ha HR, pénzügy vagy egészségügy: iparági előírások.

## F. PUBLIKÁLÁS ÉS INFRASTRUKTÚRA
*Belépés: működő termék. Kilépés: elérhető az interneten.*

- **Domain** — a név legyen meg, és a jogot is ellenőrizd.
- **Tárhely és üzemeltetés** — hol fut, mennyibe kerül, ki üzemelteti.
- **Bevezetés (*deploy*)** — kézi vagy automatikus; legyen visszaállítható.
- **Névjegy és impresszum** — kötelező elem, sokan elfelejtik.
- **Kapcsolat** — valódi elérhetőség, nem csak űrlap.
- **Analitika** — mit mérsz: látogató, konverzió, hol esnek ki.
- **Hibafigyelés** — tudod-e, mielőtt a felhasználó szól.
- **Mentés** — adatvesztés ellen. Az a kérdés, **mikor** lesz baj, nem hogy lesz-e.

## G. LÁTHATÓSÁG ÉS SEO
*Belépés: van élő oldal. Kilépés: megtalálnak a keresők.*

- **Kulcsszókutatás** — mit keresnek valójában, nem amit mi hiszünk.
- **On-page** — cím, alcím, szöveg, képaláírás, belső linkek.
- **Technikai** — oldalbetöltés, mobilnézet, indexelhetőség, sitemap.
- **Tartalom** — rendszeres, hasznos írás a témában. Ez hosszú távon a legjobb ügyfélszerző.
- **Google Business és térkép** — helyi keresésnél nélkülözhetetlen.
- **Külső hivatkozások** — szakmai oldalakról, cikkekből, partnerektől.
- **Mérés** — Search Console, kulcsszó-pozíciók, honnan jön a forgalom.
- **Időtáv** — a SEO **hónapokban** mérhető, nem hetekben. Aki azonnal akar, az hirdet.

## H. MARKETING ÉS ÜZENET
*Belépés: tudod, kinek szólsz. Kilépés: az üzenet eljut.*

- **Márka-alapok** — arculat, szín, betűtípus, hangnem, logó.
- **Üzenet** — a pozicionálás egy mondata minden felületen ugyanaz.
- **Weboldal és landoló oldal** — egy oldal, egy cél. A főcím 5 másodperc alatt mondja meg, mi ez.
- **Tartalomnaptár** — mit, mikor, hol, kinek. Heti rendszeresség veri a nagy dobásokat.
- **E-mail és hírlevél** — a legközvetlenebb, legolcsóbb csatorna, **ha** van listád.
- **Közösségi média** — ott legyél, ahol a célcsoport van, ne mindenhol.
- **Videó** — demo, bemutató, ügyfélsztori. A legtöbb figyelmet ez hozza.
- **Kampányok** — egy kampány, egy üzenet, egy mérőszám.

## I. ÉRTÉKESÍTÉS
*Belépés: van ajánlat, amit el lehet adni. Kilépés: van ügyfél.*

- **Ajánlat és csomag** — mit kapsz, mennyiért, meddig érvényes.
- **Tárgyalási keret** — hol a padló, mi a kedvezmény, mi az, ami nem.
- **Első kapcsolat** — hideg e-mail, telefon, találkozó; mit mondasz az első 30 másodpercben.
- **Bemutató (*demo*)** — a terméket az **ő problémájához** szabva, nem funkciólistával.
- **Kifogáskezelés** — ár, idő, bizalom, döntési jog. Mindre legyen kész válasz.
- **Ajánlatkövetés** — az üzletek nagy része a **második-harmadik** megkeresésnél zárul. A legtöbben feladják az első után.
- **Szerződés és számlázás** — tiszta feltételek, fizetési határidő.
- **Ügyfélbevezetés** — az értékesítés **nem a szerződésnél** ér véget.

## J. MEGTARTÁS ÉS NÖVEKEDÉS
*Belépés: van ügyfél. Kilépés: marad és ajánl.*

- **Bevezetési folyamat (*onboarding*)** — az első élmény dönti el, marad-e.
- **Első érték felmutatása** — minél előbb érezze, hogy jó döntést hozott.
- **Ügyfélszolgálat** — elérhetőség, válaszidő, hozzáállás.
- **Visszajelzési kör** — rendszeresen kérdezd meg, és **építsd be**.
- **Elégedettség mérése** — NPS vagy egyszerű „ajánlanád-e" kérdés.
- **Lemondás csökkentése** — tudod-e, **miért** mennek el? A csend a legdrágább.
- **Ajánlás** — elégedett ügyféltől kérj bemutatást. Ez a legolcsóbb szerzés.
- **Felminősítés** — a meglévő ügyfélnek többet adj el, ez a legkönnyebb bevétel.

## K. SZERVEZET ÉS FOLYAMAT
*Belépés: többen dolgoznak rajta. Kilépés: nem a te fejedben van.*

- **Feladatkezelés** — ki mit, mikorra. Ez az Ötletláda egyik fő célja.
- **Felelősségek** — ki dönt, ki visz végig egy feladatot.
- **Folyamatok leírása** — ismételhető lépések, nem hőstettek.
- **Beszállítók** — fejlesztő, designer, ügyvéd, könyvelő; szerződve.
- **Szellemi tulajdon** — kié a kód, kié a tartalom, kié az adat.
- **Tudásmegosztás** — ha valaki kilép, ne vigye magával a rendszert.

## L. MÉRÉS ÉS DÖNTÉS
*Belépés: minden más fut. Kilépés: tudod, mit érdemes folytatni.*

- **Kulcsmérőszámok** — legfeljebb 5, amely valóban számít (aktiválás, megtartás, bevétel, CAC, LTV).
- **Mérési rendszer** — analitika, események, konverziók, nem csak látogatószám.
- **Bevezetési arány (*activation*)** — hányan érik el az érték pillanatát.
- **Megtartási görbe** — hányan jönnek vissza egy hét, egy hónap múlva.
- **Döntési ritmus** — heti vagy havi áttekintés, előre rögzített szempontok szerint.
- **Folytatás, megvágás vagy elvetés** — a kudarcot **időben** felismerni olcsóbb, mint fenntartani. A legtöbb projekt nem bukik el, hanem **sokáig haldoklik**.

---

### A sorrend, összefoglalva

| Szakasz | Mit csinálsz | Mikor lépsz tovább |
|---|---|---|
| **1. Megérteni** | A, B | Van 5+ validált probléma és egy árazási logika |
| **2. Eldönteni** | C | Van specifikáció és demó, amit meg lehet nézni |
| **3. Megépíteni** | D, E, F | Működik valódi felhasználóval, él az interneten |
| **4. Elindítani** | G, H, I | Van egy ismételhető ügyfélszerzési út |
| **5. Fenntartani** | J, K, L | A növekedés nem rajtad múlik |

**A leggyakoribb hiba:** az **1. szakaszt kihagyni**, és egyből a 3.-ba ugrani — mert építeni izgalmasabb, mint kérdezni. Az esettanulmányok szerint ez a bukás első számú oka.
`
}

];
