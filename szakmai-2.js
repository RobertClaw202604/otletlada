/* ============================================================
   SZAKMAI ALAPOK 2. rész — esettanulmányok + módszertan
   ============================================================ */

const SZAKMAI_2 = [

{
  id: "esettanulmanyok",
  cim: "📚 Sikeres esettanulmányok — mi működött és miért",
  rovid: "Hét közismert termék rövid esete, mindegyikből egy átvihető tanulsággal. Nem a szerencse, hanem a sorrend és a validálás a közös elem.",
  torzs: `
Az alábbi esetek jól dokumentáltak, és mindegyikből **egy konkrét, átvihető tanulság** hozható ki. A hangsúly nem azon van, hogy „nagy cég lett", hanem hogy **melyik lépést csinálták meg időben**.

---

### Airbnb — a hanyatló ötlet újraélesztése
**Helyzet:** 2008-ban levegőben lógott a cég. Bevétel alig, befektető nem.
**Amit tettek:** nem új funkciókat építettek, hanem **kimentek New Yorkba**, és **személyesen fényképezték le a szállásokat**. A jobb fotó több foglalást hozott.
**Tanulság:** ha nincs növekedés, ne építs — **menj ki a felhasználókhoz**, és nézd meg, mi hiányzik. A megoldás gyakran nem technikai. És: a *bevétel* a legegyszerűbb validáció, nem a felhasználószám.

### Superhuman — a meghívásos lassítás
**Helyzet:** e-mail kliens, sokkal teljesítményorientáltabb, mint a Gmail.
**Amit tettek:** **egy évig nem volt nyilvános**. Minden új felhasználót élőben, videóhívásban vezettek be, és **mérték, hány másodperc alatt végzi el ugyanazt a feladatot**.
**Tanulság:** a **jó felhasználói élmény nem skálázódik azonnal** — előbb tudnod kell, mi a helyes folyamat. A *time-to-value* (mennyi idő alatt ér célba) jobb mérőszám, mint a felhasználószám.

### Dropbox — a demóvideó, amely helyettesítette a terméket
**Helyzet:** nem volt kész termék, de kellett volna befektető.
**Amit tettek:** egy **3 perces videót** tettek ki, amely megmutatta, hogyan fog működni. A várólista **75 000 főre** ugrott egy éjszaka alatt.
**Tanulság:** a **keresletet a termék előtt is lehet mérni** — demóval, videóval, landoló oldallal. Ha nincs kereslet a demóra, nem lesz a termékre sem. Ez a legolcsóbb validáció.

### Stripe — a fejlesztői élmény mint termék
**Helyzet:** 2010-ben a fizetési integráció rémálom volt (napok, hetek).
**Amit tettek:** a hangsúly **nem a pénzügyi háttérre**, hanem a **dokumentációra és az első integráció élményére** került: hét sor kód, öt perc.
**Tanulság:** ha a célcsoport szakmai (fejlesztő, pénzügyes, orvos), akkor **a belépési élmény az elsődleges termék**. A döntő kérdés: mennyi idő alatt éri el az első sikert?

### Slack — a belső eszközből lett termék
**Helyzet:** egy belső kommunikációs eszköz egy játékfejlesztő cégnél, amelynek a játéka megbukott.
**Amit tettek:** felismerték, hogy **maguk a fejlesztők** szerették használni a belső eszközt, és kiadták termékként. A növekedés **a csapatokon belülről** indult: egy ember behúzta a többit.
**Tanulság:** a legjobb validáció az, ha **saját magad vagy a felhasználó**, és a termék **magától terjed** a csapaton belül. A belső fájdalom valódi piac lehet.

### Notion — a közösség mint növekedési motor
**Helyzet:** az első verzió (2016) túl bonyolult volt, és megbukott.
**Amit tettek:** újraírták **egyszerűbbre**, majd **sablonokat és közösséget** építettek: a felhasználók megosztották egymással a saját felépítéseiket.
**Tanulság:** a **felhasználói közösség olcsóbb, mint a hirdetés**, ha a termékből megosztható dolgot lehet csinálni. A kudarc utáni **újraírás** nem szégyen — a tanulság beépítése a lényeg.

### Basecamp — a szűk fókusz és a nyilvános árazás
**Helyzet:** projektmenedzsment a sok szereplős piacon.
**Amit tettek:** **egy** dolgot csináltak jól, és **nyilvánosan, egyszerűen áraztak** — nem volt tárgyalás, nem volt „kérj ajánlatot".
**Tanulság:** a **nyilvános ár** bizalmat épít és szűri a nem odaillő vevőt. A szűk fókusz nem hátrány: kevesebb funkció, de **egyértelmű pozicionálás**.

---

### A közös minta — öt pont
1. **Előbb kérdeztek, aztán építettek.** A legtöbb esetben volt 10–100 konkrét beszélgetés vagy mérés, mielőtt a termék elkészült.
2. **Volt egy „érték pillanat", amit mértek.** Nem a letöltést számolták, hanem azt, mennyi idő alatt éri el a felhasználó a hasznot.
3. **Nem egyszerre nyitottak minden csatornára.** Egy csatornát csiszoltak, amíg meg nem térült.
4. **A visszajelzést beépítették, nem legyűrték.** Ahol a felhasználó panasza eljutott a fejlesztésbe, ott maradtak az ügyfelek.
5. **A társadalmi igazolás beépült a termékbe.** Meghívás, megosztható sablon, közösség — így a növekedés nem csak pénzből jött.

> **A legfontosabb tanulság:** a válságban **nem új funkció kellett**, hanem **közelebb menni a felhasználóhoz**. Az Airbnb-t nem egy okos kód mentette meg, hanem egy fényképezőgép.
`
},

{
  id: "modszertan",
  cim: "🔬 Módszertan — hogyan dolgozz, ne csak mit",
  rovid: "Nyolc bevált keretrendszer, mindegyikhez a kérdéssel, amelyet ha nem teszel fel, drágán jön elő. Lean Startup, JTBD, Design Thinking, Business Model Canvas és társai.",
  torzs: `
A **mit** csinálj fentebb van (a 12 munkacsoport). Ez a rész a **hogyanról** szól: a keretrendszerekről, amelyek segítenek, hogy ne hagyd ki a fontos lépést. Mindegyik mögött **egy kérdés** van.

---

### 1. Lean Startup — Építs, mérj, tanulj
**A ciklus:** *Build → Measure → Learn*, minél rövidebbre húzva. A cél nem a tökéletes termék, hanem a **lehető leggyorsabb tanulás**.
**A kérdés:** Mi az a legkisebb dolog, amit megépíthetek, és amiből **valódi tanulságot** kapok?
**Eszköz:** MVP, *pivot* (irányváltás) vagy *persevere* (kitartás) döntés.
**Buktató:** az MVP-t „félkész terméknek" értelmezni. Az MVP **mérőeszköz**.

### 2. Jobs to Be Done — Milyen munkát végez el a termék?
**A gondolat:** az emberek nem terméket vesznek, hanem **egy munkát akarnak elvégeztetni** (*job*). A fúrót nem azért veszik, mert fúró kell, hanem mert lyuk kell — és igazából a polc.
**A kérdés:** Milyen munkát bízna a felhasználó a termékre, és mi az, amit **helyette** csinál most?
**Eszköz:** a „helyettesítő megoldás" feltérképezése — az igazi versenytárs gyakran nem egy cég, hanem a **megszokás**.
**Buktató:** funkciólistában gondolkodni a munka helyett.

### 3. Design Thinking — A felhasználó középpontba állítása
**Az öt lépés:** empátia, probléma-meghatározás, ötletelés, prototípus, tesztelés.
**A kérdés:** Mit **érez** és mit **mond** a felhasználó — és hol tér el a kettő?
**Eszköz:** megfigyelés, interjú, papírprototípus, gyors teszt.
**Buktató:** a prototípustól félni. A prototípus célja a **gyors tévedés**, nem a szép eredmény.

### 4. Business Model Canvas — Egy lapon az egész üzlet
**A kilenc blokk:** vevőszegmensek, értékajánlat, csatornák, ügyfélkapcsolat, bevételi források, kulcserőforrások, kulcstevékenységek, kulcspartnerek, költségstruktúra.
**A kérdés:** Melyik blokk a **leggyengébb**? Ott dől el az üzlet.
**Eszköz:** egyetlen A4-es lap, amit bárki átlát.
**Buktató:** a canvast kész dokumentumnak tekinteni. Ez **hipotézis-térkép**, nem üzleti terv.

### 5. Value Proposition Canvas — Az illeszkedés
**A gondolat:** a vevő oldalán a **fájdalmak**, a **nyereségek** és a **munkák**; a termék oldalán a **fájdalomcsillapítók**, **hasznok** és **termékek**.
**A kérdés:** Van-e valódi **illeszkedés** (*fit*), vagy csak jó terméket találtunk egy nem létező problémára?
**Buktató:** a termék oldalát részletesen kidolgozni, a vevő oldalát meg tippelni.

### 6. RICE és hasonló pontozás — Mit építs először?
**A képlet:** *Reach* (elérés) × *Impact* (hatás) × *Confidence* (bizonyosság) / *Effort* (ráfordítás).
**A kérdés:** Ha csak **egy** dolgot csinálhatnék meg ebben a hónapban, melyik hozna többet?
**Buktató:** mindent fontosnak jelölni. Ha minden elsőbbséget élvez, semmi sem.

### 7. AARRR — A vevő útja
**Az öt lépés:** *Acquisition* (megszerzés), *Activation* (aktiválás), *Retention* (megtartás), *Revenue* (bevétel), *Referral* (ajánlás).
**A kérdés:** A tölcsér **melyik szakaszán** veszítem a legtöbb embert?
**Eszköz:** tölcsér-mérés, konverziós arányok szakaszonként.
**Buktató:** a tetejére önteni a forgalmat, amikor a lyuk az **aktiválásnál** vagy a **megtartásnál** van.

### 8. Kill criteria — Mikor állj le?
**A gondolat:** **előre** rögzíteni, mi az a pont, aminél feladod. Utólag minden projekt szép, és mindig van még egy hónap.
**A kérdés:** Mi az a szám vagy dátum, amelynél **kimondom**, hogy ez nem megy?
**Buktató:** a haldokló projekt. A legtöbb nem bukik el, hanem **évekig elhúzódik** — ez a legdrágább vereség.

---

### Hogyan illesztem ezt a rendszerhez
- **A csoportok** (A–L) megmondják, **mit** kell elvégezni.
- **A módszerek** megmondják, **hogyan** gondolkodj róla.
- **A fázisok** (7 lépés) megmondják, **hol tartasz**.
- **A kill criteria** megmondja, **mikor állj meg**.

Ez a négy együtt adja a szakmai keretet. A kártyákon szereplő feladatok ennek a keretnek a projekt-specifikus kitöltései.
`
}

];
