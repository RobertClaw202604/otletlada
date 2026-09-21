/* ============================================================
   projektek.js — a projektek és ötletek adatai
   ============================================================

   EZT A FÁJLT SZERKESZTHETED — a weboldal innen épül fel.

   Egy projekt/ötlet szerkezete:

   {
     id: "arworks",                  // egyedi rövid azonosító
     nev: "ARworks",                 // megjelenő név
     url: "https://arworks.hu",      // opcionális
     specko: "spec-x.html",          // opcionális: külön specifikáció webes linkje
     statusz: "mukodo",              // mukodo | elinditott | zart | otlet | parkolo | elvetve
     kategoria: "Ügynökség / B2B",   // opcionális címke
     rovid: "Egy soros lényeg.",     // a kártyán látszik
     leiras: `Hosszabb leírás...`,   // a részletes nézetben
     hatralevo: [                    // a még hátralévő feladatok
       { szoveg: "...", kesz: false, felelos: "", datum: "" }
     ],
     megjegyzes: ""                  // szabad szöveg
   }

   A "hatralevo" lista elemeihez elég a "szoveg"; a többi mező opcionális.
   A "kesz: true" elemet áthúzva, halványan jeleníti meg.

   Ha egy projektnél nincs "hatralevo", a lista üresen jelenik meg, és
   a felületen hozzá lehet adni.
   ============================================================ */

const STATUSZOK = {
  mukodo:    { cimke: "Működő",        szin: "#2e9e5b", ikon: "🟢" },
  elinditott:{ cimke: "Elindított",    szin: "#e08a00", ikon: "🔥" },
  zart:      { cimke: "Zárt rendszer", szin: "#6b7280", ikon: "🔒" },
  otlet:     { cimke: "Ötlet",         szin: "#FF5100", ikon: "🆕" },
  parkolo:   { cimke: "Parkoló",       szin: "#3b82f6", ikon: "⏸️" },
  elvetve:   { cimke: "Elvetve",       szin: "#9ca3af", ikon: "❌" }
};

/* ============================================================
   A NAGY FELADATOK — ezek FIX blokkok, minden projektnél megjelennek.
   ============================================================

   ⚠️ Ez NEM választható lista! Minden projektnél MINDEGYIK blokk
   megjelenik, és alájuk lehet egyedi részfeladatokat felvenni.

   A sorrend itt szabályozható. Ha új nagy blokkot akarsz (pl. „B2B sales"),
   ide vedd fel, és minden projektnél meg fog jelenni.

   A felületen a projekten belül is hozzá lehet adni nagy feladatot —
   az csak annál a projektnél jelenik meg.
   ============================================================ */

const NAGY_FELADATOK = [
  "Teljes speckó",
  "Üzleti modell",
  "Kész szoftver",
  "Publikálás",
  "Láthatóság maximalizálás",
  "Sales",
  "Marketing",
  "SEO",
  "eDM / hírlevél",
  "Hirdetés (Ads)",
  "Tartalom / blog",
  "Jogi / adatvédelem",
  "Árazás",
  "Partnerkapcsolat"
];

const PROJEKTEK = [

  /* ==================== 🟢 MŰKÖDŐ ==================== */
  {
    id: "arworks",
    nev: "ARworks",
    url: "https://arworks.hu",
    statusz: "mukodo",
    kategoria: "Ügynökség / B2B",
    rovid: "Egyedi VR, AR, 3D és AI megoldások üzleti célokra — 16 éve.",
    leiras: `**Egyedi VR, AR, 3D és AI megoldások üzleti célokra.** B2B — tréning, értékesítés, kiállítások, promóció, digitális ügyfélkiszolgálás.

A weboldal Budapesten, **2011 óta** fut. Egyedi fejlesztések, adaptálható platformok, kész szoftverek. Fő navigáció: Munkáink / Megoldások / Szolgáltatások / Szektorok / Technológiák / Tudástér / Rólunk. Belépő a **célból** indul: „Mit szeretne elérni?" (oktatás, termékbemutatás, látogatóbevonzás, értékesítés, promóció, AI-asszisztens, mobil/web, „még nem tudom").

**Referenciák:** Medtronic (McGRATH VR-tréning, Quest 3 + AI páciensek), SAAB Gripen AR, Honda konfigurátor, V-Híd VR, AI-karakterek.

**Tudásbázis:** 181 projekt magyar leírással, 32 angol leírással, YouTube-videókkal.`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: false },
      { feladat: "Üzleti modell", kesz: false },
      { feladat: "Kész szoftver", kesz: false },
      { feladat: "Publikálás", kesz: false },
      { feladat: "Láthatóság maximalizálás", kesz: false },
      { feladat: "Sales", kesz: false,
        reszfeladatok: [
          { szoveg: "Ügynökségi célcsoport bővítése (prospect-list)", kesz: false }
        ] },
      { feladat: "Marketing", kesz: false },
      { feladat: "SEO", kesz: false,
        reszfeladatok: [
          { szoveg: "Szerver-migráció (SEO-checklista kész)", kesz: false }
        ] },
      { feladat: "eDM / hírlevél", kesz: false,
        reszfeladatok: [
          { szoveg: "12 hetes eDM kampány ügynökségeknek", kesz: false }
        ] },
      { feladat: "Hirdetés (Ads)", kesz: false },
      { feladat: "Tartalom / blog", kesz: false },
      { feladat: "Jogi / adatvédelem", kesz: false },
      { feladat: "Árazás", kesz: false },
      { feladat: "Partnerkapcsolat", kesz: false }
    
    ]
  },
  {
    id: "tablog",
    nev: "TabLog",
    url: "https://tablog.pro",
    statusz: "mukodo",
    kategoria: "SaaS / Munkaerő",
    rovid: "Munkaidőnyilvántartás, vendégérkeztetés és beléptetés — mobillal.",
    leiras: `**Munkaidőnyilvántartás, vendégérkeztetés és beléptetésmenedzsment** — mobillal, papír- és érintésmentesen. **6 éve** működik.

Három termékvonal:
- **TabLog Work** — munkaidőmérés mobillal, bárhonnan
- **TabLog Visitor** — recepció nélküli, papírmentes vendégérkeztetés (irodai + irodaházi)
- **Access Control** — kulcsnélküli beléptetés mobillal

Nyelvek: HU / EN / DE. Árazás nyilvános. Ügyfélreferenciák a főoldalon.

**Kapcsolat:** info@tablog.pro, +36 70 883 1821`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: false },
      { feladat: "Üzleti modell", kesz: false },
      { feladat: "Kész szoftver", kesz: false },
      { feladat: "Publikálás", kesz: false },
      { feladat: "Láthatóság maximalizálás", kesz: false },
      { feladat: "Sales", kesz: false },
      { feladat: "Marketing", kesz: false },
      { feladat: "SEO", kesz: false },
      { feladat: "eDM / hírlevél", kesz: false },
      { feladat: "Hirdetés (Ads)", kesz: false },
      { feladat: "Tartalom / blog", kesz: false },
      { feladat: "Jogi / adatvédelem", kesz: false },
      { feladat: "Árazás", kesz: false },
      { feladat: "Partnerkapcsolat", kesz: false }
    ]
    
  },

  /* ==================== 🔥 ELINDÍTOTT ==================== */
  {
    id: "kinaiauto",
    nev: "KínaiAuto",
    url: "https://www.kinaiauto.com",
    statusz: "elinditott",
    kategoria: "Autó / Portál",
    rovid: "Független magyar kínai autó-iránytű — 78 modell, 14 márka.",
    leiras: `**Független magyar nyelvű kínai autó-iránytű.** Kategória, ársáv és hajtás szerint szűrhető teljes hazai kínálat.

**78 modell, 14 márka:** BAIC, BYD, Chery, Dongfeng, Firefly, Geely, Jaecoo, Leapmotor, Maxus, MG, NIO, Omoda, Voyah, XPENG.

Élő szűrés (kategória, ársáv 0–71,2 M Ft, üzemanyag), modell-összehasonlítás, márkák, tudástár, **ajánlatkérés egy kattintással**. Ársávok 5–8 M Ft-tól 30 M Ft felettig. Rendezés ár / hossz / csomagtartó / hatótáv / teljesítmény szerint.

**Kreatív:** 25 elem, Panda karakterrel, Nano Banana Pro-val generálva.`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: false },
      { feladat: "Üzleti modell", kesz: false },
      { feladat: "Kész szoftver", kesz: false },
      { feladat: "Publikálás", kesz: false },
      { feladat: "Láthatóság maximalizálás", kesz: false },
      { feladat: "Sales", kesz: false },
      { feladat: "Marketing", kesz: false,
        reszfeladatok: [
          { szoveg: "3 kampányirány kidolgozása (ismertség / szándék / lead)", kesz: true }
        ] },
      { feladat: "SEO", kesz: false },
      { feladat: "eDM / hírlevél", kesz: false },
      { feladat: "Hirdetés (Ads)", kesz: false,
        reszfeladatok: [
          { szoveg: "Google Ads anyagok készítése", kesz: false },
          { szoveg: "Meta / FB hirdetések feltöltése (API)", kesz: false }
        ] },
      { feladat: "Tartalom / blog", kesz: false },
      { feladat: "Jogi / adatvédelem", kesz: false },
      { feladat: "Árazás", kesz: false },
      { feladat: "Partnerkapcsolat", kesz: false }
    
    ]
  },
  {
    id: "darwinai",
    nev: "DarwinAI",
    url: "https://darwinai.hu",
    statusz: "elinditott",
    kategoria: "AI / Oktatás",
    rovid: "AI tanácsadás, oktatás és fejlesztés magyar vállalkozásoknak.",
    leiras: `⚠️ **Domain:** \`darwinai.hu\` (a \`darwin.ai\` NEM az övé)

**AI tanácsadás, AI oktatás, AI fejlesztés** magyar vállalkozásoknak. „Az AI az evolúció következő nagy ugrása."

Három irány:
- **AI tanácsadás** — stratégiától a megvalósításig
- **AI oktatás és workshop** — gyakorlati, a saját feladataikon
- **AI fejlesztés** — egyedi megoldások, automatizációk

Van **6+1 modell**, Prezentációk, Projektek (62 publikált projekt/POC/vizuál), Hírlevél, **Prompt Library**, Partnerek & média, Referenciák, AI csapatépítő, Bio.

**Darwin hírlevél:** külön rendszer — The Neuron + The Rundown AI forrásokból gyűjt, deduplikál, szelektál, Mailchimp-draftot készít.`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: false,
        reszfeladatok: [
          { szoveg: "Teljes speckó", kesz: false }
        ] },
      { feladat: "Üzleti modell", kesz: false },
      { feladat: "Kész szoftver", kesz: false },
      { feladat: "Publikálás", kesz: false },
      { feladat: "Láthatóság maximalizálás", kesz: false },
      { feladat: "Sales", kesz: false },
      { feladat: "Marketing", kesz: false },
      { feladat: "SEO", kesz: false },
      { feladat: "eDM / hírlevél", kesz: false,
        reszfeladatok: [
          { szoveg: "Hírlevél automatikus gyűjtés élesítése", kesz: true },
          { szoveg: "Hírlevél-lista építése", kesz: false }
        ] },
      { feladat: "Hirdetés (Ads)", kesz: false },
      { feladat: "Tartalom / blog", kesz: false },
      { feladat: "Jogi / adatvédelem", kesz: false },
      { feladat: "Árazás", kesz: false },
      { feladat: "Partnerkapcsolat", kesz: false }
    
    ]
  },
  {
    id: "emlekkonyv",
    nev: "Emlékkönyv",
    url: "https://www.emlekkonyv.com",
    statusz: "elinditott",
    kategoria: "AI / Fogyasztói",
    rovid: "AI-alapú életrajzíró — életed mozaikjait rendezi.",
    leiras: `**AI-alapú életrajzíró.** AI beszélgetőtárs, amely segít felidézni és megőrizni a történeteidet.

React SPA (Vite), Google Identity Services a Drive-integrációhoz (választható \`gdrive\` tárolási mód), Google Analytics (G-CX2V9WD4QH). Felhő tárolás.

**Infrastruktúra:** Vercel (projekt: „life"), FB Messenger webhook (kulcsszavas auto-reply), FB App Review lezárva, adatvédelmi / terms / data-deletion oldalak megvannak.

**Kampány:** Friends1 eDM-ek elküldve (5 fő), Friends2 vár. FB poszt kampány: 7 poszt + képek kész. Kommunikációs terv kész.`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: false },
      { feladat: "Üzleti modell", kesz: false },
      { feladat: "Kész szoftver", kesz: false },
      { feladat: "Publikálás", kesz: false },
      { feladat: "Láthatóság maximalizálás", kesz: false,
        reszfeladatok: [
          { szoveg: "Vercel Analytics bekapcsolása a dashboardon", kesz: false }
        ] },
      { feladat: "Sales", kesz: false,
        reszfeladatok: [
          { szoveg: "Sales", kesz: false }
        ] },
      { feladat: "Marketing", kesz: false,
        reszfeladatok: [
          { szoveg: "FB poszt kampány indítása", kesz: false }
        ] },
      { feladat: "SEO", kesz: false },
      { feladat: "eDM / hírlevél", kesz: false,
        reszfeladatok: [
          { szoveg: "Friends2 eDM kiküldése", kesz: false }
        ] },
      { feladat: "Hirdetés (Ads)", kesz: false },
      { feladat: "Tartalom / blog", kesz: false },
      { feladat: "Jogi / adatvédelem", kesz: false },
      { feladat: "Árazás", kesz: false },
      { feladat: "Partnerkapcsolat", kesz: false }
    
    ]
  },
  {
    id: "exlibris",
    nev: "Ex Libris Video",
    url: "https://exlibrisvideo.hu",
    statusz: "elinditott",
    kategoria: "AI / Könyv",
    rovid: "Könyvespolc-videóból könyvkatalógus — ingyenes, regisztráció nélkül.",
    leiras: `**Könyvespolc-videóból könyvkatalógus.** Telefonnal végigpásztázod a polcodat, az AI kiolvassa a gerinceket → böngészhető, szép katalógus saját linken, borítókkal, statisztikákkal, **Excel-exporttal**.

„Ingyenes, regisztráció nélkül." Magyar ÉS idegen nyelvű könyvek felismerése. Feltöltés: MP4/MOV/WebM videó vagy JPEG/PNG/WebP fotó, fájlonként max 1 GB, összesen 30 fájl. Kollekciók kezelése, HU/EN felület.

**Erősség:** ingyenes eszköz → vírusos potenciál, könyves/olvasós közösségek, SEO a könyvfelismerés témára.`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: false,
        reszfeladatok: [
          { szoveg: "Teljes speckó", kesz: false }
        ] },
      { feladat: "Üzleti modell", kesz: false },
      { feladat: "Kész szoftver", kesz: false },
      { feladat: "Publikálás", kesz: false,
        reszfeladatok: [
          { szoveg: "Publikálás / láthatóság", kesz: false }
        ] },
      { feladat: "Láthatóság maximalizálás", kesz: false },
      { feladat: "Sales", kesz: false },
      { feladat: "Marketing", kesz: false,
        reszfeladatok: [
          { szoveg: "Marketing a könyves közösségekben", kesz: false }
        ] },
      { feladat: "SEO", kesz: false },
      { feladat: "eDM / hírlevél", kesz: false },
      { feladat: "Hirdetés (Ads)", kesz: false },
      { feladat: "Tartalom / blog", kesz: false },
      { feladat: "Jogi / adatvédelem", kesz: false },
      { feladat: "Árazás", kesz: false },
      { feladat: "Partnerkapcsolat", kesz: false }
    
    ]
  },
  {
    id: "egyenitanrend",
    nev: "Egyéni Tanrend",
    url: "https://egyenitanrend.hu",
    statusz: "elinditott",
    kategoria: "Oktatás / AI",
    rovid: "AI-val támogatott tanulás magántanulóknak.",
    leiras: `**AI-val támogatott tanulás magántanulóknak.**

React SPA, mobilra optimalizálva (PWA-jellegű: theme-color, apple-mobile-web-app tagek). Technológiai stack: **Three.js** (3D), **KaTeX** (matematikai képletek), **Markdown** — tehát interaktív, matematika-orientált tanulási környezet.

🔗 **Kapcsolódási pont:** a **Vizsgáztató AI** (lásd lent) ugyanebbe az oktatási irányba mutat — érdemes együtt gondolni rájuk.`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: false },
      { feladat: "Üzleti modell", kesz: false,
        reszfeladatok: [
          { szoveg: "Üzleti modell", kesz: false }
        ] },
      { feladat: "Kész szoftver", kesz: false },
      { feladat: "Publikálás", kesz: false },
      { feladat: "Láthatóság maximalizálás", kesz: false },
      { feladat: "Sales", kesz: false },
      { feladat: "Marketing", kesz: false },
      { feladat: "SEO", kesz: false,
        reszfeladatok: [
          { szoveg: "Láthatóság / SEO szülők felé", kesz: false }
        ] },
      { feladat: "eDM / hírlevél", kesz: false },
      { feladat: "Hirdetés (Ads)", kesz: false },
      { feladat: "Tartalom / blog", kesz: false },
      { feladat: "Jogi / adatvédelem", kesz: false },
      { feladat: "Árazás", kesz: false },
      { feladat: "Partnerkapcsolat", kesz: false }
    
    ]
  },
  {
    id: "databike",
    nev: "Databike",
    url: "https://databike.hu",
    statusz: "elinditott",
    kategoria: "Sport / Adatbázis",
    rovid: "Magyar kerékpárverseny-eredmények és versenyzők adatbázisa.",
    leiras: `**Magyar kerékpárverseny-eredmények és versenyzők** adatbázisa.

Versenyek, versenyzők, klubok, versenysorozatok és statisztikák egy helyen. Sportágak: **MTB, cyclo-cross, BMX, országút**. Korosztály: **U7-től felnőttig**. SEO-ra optimalizált (robots index/follow, og:image, twitter card, canonical).

👤 **Személyes kapcsolódás:** Szabolcs 10 éves fia, Marci komoly kerékpáros versenyző.`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: false },
      { feladat: "Üzleti modell", kesz: false },
      { feladat: "Kész szoftver", kesz: false },
      { feladat: "Publikálás", kesz: false },
      { feladat: "Láthatóság maximalizálás", kesz: false },
      { feladat: "Sales", kesz: false },
      { feladat: "Marketing", kesz: false },
      { feladat: "SEO", kesz: false,
        reszfeladatok: [
          { szoveg: "SEO a versenyeredmény kulcsszavakra", kesz: false }
        ] },
      { feladat: "eDM / hírlevél", kesz: false },
      { feladat: "Hirdetés (Ads)", kesz: false },
      { feladat: "Tartalom / blog", kesz: false },
      { feladat: "Jogi / adatvédelem", kesz: false },
      { feladat: "Árazás", kesz: false },
      { feladat: "Partnerkapcsolat", kesz: false,
        reszfeladatok: [
          { szoveg: "Klubok / versenyzők bevonása, közösségépítés", kesz: false }
        ] }
    
    ]
  },
  {
    id: "cogniview",
    nev: "CogniView (VR CAP)",
    url: "https://cogniview.hu",
    statusz: "elinditott",
    kategoria: "VR / Védelmi ipar",
    rovid: "VR kognitív mérés WebXR-ben — védelmi, munkaalkalmassági, sportági.",
    leiras: `**VR Cognitive Assessment Platform** — védelmi, munkaalkalmassági és sportági **kognitív mérés WebXR-ben**.

Telepíthető webapp (manifest, PWA), WebXR-alapú. Technológia: Three.js + saját VR stack. Nemzetközi (EN) felület.

**Szektor:** védelmi ipar, munkaalkalmasság, sport — illeszkedik az ARworks B2B profilhoz. Illeszkedik az **EDF pályázati** irányhoz is.`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: false },
      { feladat: "Üzleti modell", kesz: false,
        reszfeladatok: [
          { szoveg: "Üzleti modell (B2B / B2G)", kesz: false }
        ] },
      { feladat: "Kész szoftver", kesz: false },
      { feladat: "Publikálás", kesz: false },
      { feladat: "Láthatóság maximalizálás", kesz: false },
      { feladat: "Sales", kesz: false },
      { feladat: "Marketing", kesz: false,
        reszfeladatok: [
          { szoveg: "Szakmai publikációk, kiállítások", kesz: false }
        ] },
      { feladat: "SEO", kesz: false },
      { feladat: "eDM / hírlevél", kesz: false },
      { feladat: "Hirdetés (Ads)", kesz: false },
      { feladat: "Tartalom / blog", kesz: false },
      { feladat: "Jogi / adatvédelem", kesz: false },
      { feladat: "Árazás", kesz: false },
      { feladat: "Partnerkapcsolat", kesz: false,
        reszfeladatok: [
          { szoveg: "Kapcsolódás az EDF pályázathoz", kesz: false }
        ] }
    
    ]
  },
  {
    id: "ridetorace",
    nev: "Ride to Race",
    url: "https://ridetorace.com",
    statusz: "elinditott",
    kategoria: "Sport / Oktatás (EN)",
    rovid: "Parent Academy fiatal kerékpárosok versenyzéséhez — 6 nyelven.",
    leiras: `**Parent Academy for Youth Cycling** — gyakorlati szülői útmutató fiatal kerékpárosok versenyzéséhez. „Nem adatbázis, hanem egy út, amelyet együtt jártok be."

Tartalom: **Skills (27 téma)**, **Race Day (6)**, **Bike Setup (6)**, Book, Articles, Clubs. 5 tanulási útvonal, **6 nyelv**. Ingyenes letölthető **Race-Day Checklist** (lead-mágnes!) → feliratkozás. Témák: pedálozás/kadencia, fékezés, váltás, kanyarvonal, rajt, emelkedő.

👤 **Személyes kapcsolódás:** Marci versenyzése ihlette.

⭐ **Ez a legkiforrottabb lead-tölcsér-logika** az egész portfólióban — érdemes mintaként használni a többinél.`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: false },
      { feladat: "Üzleti modell", kesz: false },
      { feladat: "Kész szoftver", kesz: false },
      { feladat: "Publikálás", kesz: false },
      { feladat: "Láthatóság maximalizálás", kesz: false,
        reszfeladatok: [
          { szoveg: "Láthatóság maximalizálása (nemzetközi)", kesz: false }
        ] },
      { feladat: "Sales", kesz: false },
      { feladat: "Marketing", kesz: false },
      { feladat: "SEO", kesz: false },
      { feladat: "eDM / hírlevél", kesz: false },
      { feladat: "Hirdetés (Ads)", kesz: false },
      { feladat: "Tartalom / blog", kesz: false },
      { feladat: "Jogi / adatvédelem", kesz: false },
      { feladat: "Árazás", kesz: false },
      { feladat: "Partnerkapcsolat", kesz: false,
        reszfeladatok: [
          { szoveg: "Klubokkal partnerség", kesz: false }
        ] }
    
    ]
  },

  /* ==================== 🔒 ZÁRT RENDSZEREK ==================== */
  {
    id: "drinkdeal",
    nev: "DrinkDeal",
    url: "https://drinkdeal.hu",
    statusz: "zart",
    kategoria: "Bor / Kereskedelem",
    rovid: "Zárt ital/bor kereskedelmi rendszer.",
    leiras: `**Zárt (nem publikus) ital/bor kereskedelmi rendszer.** Nyilvános oldal nem elérhető — részletek Szabolcstól.

🔗 **Kapcsolódás:** a **Borászatok térképe** ötlet adatforrása egy másik borászati rendszer (nem ez).`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: false },
      { feladat: "Üzleti modell", kesz: false },
      { feladat: "Kész szoftver", kesz: false },
      { feladat: "Publikálás", kesz: false },
      { feladat: "Láthatóság maximalizálás", kesz: false },
      { feladat: "Sales", kesz: false },
      { feladat: "Marketing", kesz: false },
      { feladat: "SEO", kesz: false },
      { feladat: "eDM / hírlevél", kesz: false },
      { feladat: "Hirdetés (Ads)", kesz: false },
      { feladat: "Tartalom / blog", kesz: false },
      { feladat: "Jogi / adatvédelem", kesz: false },
      { feladat: "Árazás", kesz: false },
      { feladat: "Partnerkapcsolat", kesz: false }
    ]
    
  },
  {
    id: "salesgen",
    nev: "SalesGenAI",
    statusz: "zart",
    kategoria: "Sales / AI",
    rovid: "Proaktív cold-ajánlat-küldő sales rendszer.",
    leiras: `**Proaktív cold-ajánlat-küldő sales rendszer** — felkutatás + egyedi ajánlat automatikus kiküldése.

🔗 **Kapcsolódó:** A4C SalesGen projekt (Vas Zoltán, Lovable + Perplexity + Gemini, 20 000 Ft/h + ÁFA).`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: false },
      { feladat: "Üzleti modell", kesz: false },
      { feladat: "Kész szoftver", kesz: false },
      { feladat: "Publikálás", kesz: false },
      { feladat: "Láthatóság maximalizálás", kesz: false },
      { feladat: "Sales", kesz: false },
      { feladat: "Marketing", kesz: false },
      { feladat: "SEO", kesz: false },
      { feladat: "eDM / hírlevél", kesz: false },
      { feladat: "Hirdetés (Ads)", kesz: false },
      { feladat: "Tartalom / blog", kesz: false },
      { feladat: "Jogi / adatvédelem", kesz: false },
      { feladat: "Árazás", kesz: false },
      { feladat: "Partnerkapcsolat", kesz: false }
    ]
    
  },
  {
    id: "eventai",
    nev: "EventAI",
    statusz: "zart",
    kategoria: "Rendezvény / AI",
    rovid: "Rendezvényszervezési AI rendszer.",
    leiras: `**Rendezvényszervezési AI rendszer.** Részletek Szabolcstól.`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: false },
      { feladat: "Üzleti modell", kesz: false },
      { feladat: "Kész szoftver", kesz: false },
      { feladat: "Publikálás", kesz: false },
      { feladat: "Láthatóság maximalizálás", kesz: false },
      { feladat: "Sales", kesz: false },
      { feladat: "Marketing", kesz: false },
      { feladat: "SEO", kesz: false },
      { feladat: "eDM / hírlevél", kesz: false },
      { feladat: "Hirdetés (Ads)", kesz: false },
      { feladat: "Tartalom / blog", kesz: false },
      { feladat: "Jogi / adatvédelem", kesz: false },
      { feladat: "Árazás", kesz: false },
      { feladat: "Partnerkapcsolat", kesz: false }
    ]
    
  },
  {
    id: "tenderradar",
    nev: "TenderRadar",
    statusz: "zart",
    kategoria: "Pályázat / AI",
    rovid: "Pályázatfigyelő / tender-radar rendszer.",
    leiras: `**Pályázatfigyelő / tender-radar** rendszer. Részletek Szabolcstól — nagy potenciál, ha pályázati hírek automatizált figyelése + szűrése.

🔗 **Kapcsolódás:** az **EDF pályázat** (SIMTRAIN-MSAI) partnerkeresése ugyanezt a problémát oldja meg kézzel.`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: false },
      { feladat: "Üzleti modell", kesz: false },
      { feladat: "Kész szoftver", kesz: false },
      { feladat: "Publikálás", kesz: false },
      { feladat: "Láthatóság maximalizálás", kesz: false },
      { feladat: "Sales", kesz: false },
      { feladat: "Marketing", kesz: false },
      { feladat: "SEO", kesz: false },
      { feladat: "eDM / hírlevél", kesz: false },
      { feladat: "Hirdetés (Ads)", kesz: false },
      { feladat: "Tartalom / blog", kesz: false },
      { feladat: "Jogi / adatvédelem", kesz: false },
      { feladat: "Árazás", kesz: false },
      { feladat: "Partnerkapcsolat", kesz: false }
    ]
    
  },

  /* ==================== 🆕 ÖTLETEK ==================== */
  {
    id: "vizsgaztato-ai",
    nev: "Vizsgáztató AI",
    statusz: "otlet",
    kategoria: "Oktatás / AI",
    rovid: "Szóbeli vizsgáztató AI — terem tele laptoppal, a diák szóban válaszol.",
    leiras: `**A probléma:** a leadandó írásbeli feladatokat a diákok AI-val csinálják, ezért nem működnek. A megoldás: terem tele laptoppal, mindegyiken **vizsgáztató AI** fut, a diáknak **szóban** kell válaszolnia. Az élő szóbeli válasz nem pótolható otthonról AI-val.

**Hol tartunk:**
- ✅ Spec v0.2 kész
- ✅ **Működő, letölthető mockup** a Drive-on (valódi DeepSeek-értékeléssel)
- ✅ 24 tétel teljes tananyaggal, 206 checklist-pont, 6 demó vizsgázó
- ✅ 5 vizsgáztató-variáns az A/B teszthez
- ✅ Tesztelve: 41/41 · 41/41 · 21/21 · 4/4

**Eddig ezzel akarunk eljutni** (Szabolcs, 2026-09-19) — a továbbvitel külön döntés.

🔗 **Kapcsolódó:** Egyéni Tanrend.

**Nyitott kérdések:** AI-értékelés megbízhatósága, jog/etika (adatzárás, átláthatóság), tanári felügyelet, teremzaj / egy-mikrofon kockázat, a % jogi súlya, felvétel megőrzése.`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: false },
      { feladat: "Üzleti modell", kesz: false },
      { feladat: "Kész szoftver", kesz: false,
        reszfeladatok: [
          { szoveg: "V5 — valódi A/B teszt méréssel", kesz: false },
          { szoveg: "Kész szoftver (backend proxy, kulcs a szerveren)", kesz: false },
          { szoveg: "Kréta integráció (később)", kesz: false },
          { szoveg: "Tanári admin felület", kesz: false }
        ] },
      { feladat: "Publikálás", kesz: false,
        reszfeladatok: [
          { szoveg: "Pilot kiválasztása (1 tantárgy, 1 évfolyam, 10–20 tétel)", kesz: false }
        ] },
      { feladat: "Láthatóság maximalizálás", kesz: false },
      { feladat: "Sales", kesz: false },
      { feladat: "Marketing", kesz: false },
      { feladat: "SEO", kesz: false },
      { feladat: "eDM / hírlevél", kesz: false },
      { feladat: "Hirdetés (Ads)", kesz: false },
      { feladat: "Tartalom / blog", kesz: false },
      { feladat: "Jogi / adatvédelem", kesz: false },
      { feladat: "Árazás", kesz: false },
      { feladat: "Partnerkapcsolat", kesz: false }
    
    ]
  },
  {
    id: "ai-tudas-teszt",
    nev: "AI-tudás teszt (HR)",
    statusz: "otlet",
    kategoria: "HR / AI",
    rovid: "Állásjelentkezok AI-tudásának mérése — a saját gépükön oldanak meg feladatot, a rendszer értékel.",
    leiras: `**Állásjelentkezok AI-tudásának mérése a cégek HR-területére.** A jelölt az interjún **a saját gépén** old meg egy, a rendszer **böngészojében** kapott feladatot, és az eredményt oda másolja be.

Közben **bármilyen AI-toolt** használhat, amelyet akar — épp ez a lényeg: nem az AI-tiltás a cél, hanem annak mérése, hogy **mennyire tudja használni**. Ez a mai munkakörök egyik legfontosabb készsége, és eddig senki nem méri.

Az érték nem a felület, hanem a **rendszer knowhow-ja**:
- **Feladatok kitalálása** — valós, munkakörhöz illo feladatok
- **Feladat-adatbázis** — iparáganként / pozíciónként / nehézségi szintenként
- **Variabilitás** — minden jelölt más feladatot kap, nem szivárog ki
- **Beadás** — könnyen kezelheto, auditálható folyamat
- **Értékelés** — az eredmény automatikus/minoségi megítélése, összehasonlítható pontszámmal

**Miért most:** a HR-eseknek nincs eszközük az AI-kompetencia mérésére, miközben a jelentkezok 90%-a használ AI-t. Egy „AI-tudás" pontszám az önéletrajz mellé új, védheto kategória.

🔗 **Kapcsolódás:** ugyanaz a vizsgáztató/értékelo mag, mint a **Vizsgáztató AI**-nál — közös technológia, két piac (oktatás / HR). A feladat-generálás és az AI-értékelés ugyanaz a probléma.

⚠️ **Csak ötlet** — nincs mögötte speckó, üzleti modell vagy fejlesztés.

**Nyitott kérdések:** Ki a vevő (HR-osztály vagy fejvadász ügynökség)? Hogyan bizonyítható, hogy a jelölt nem csalt? Mérheto-e egyáltalán a tudás, vagy csak az eszközhasználat? Árazás (nyilvános / céges elofizetés)?`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: false,
        reszfeladatok: [
          { szoveg: "Teljes speckó", kesz: false }
        ] },
      { feladat: "Üzleti modell", kesz: false,
        reszfeladatok: [
          { szoveg: "Üzleti modell (ki a vevő: HR vagy fejvadász?)", kesz: false }
        ] },
      { feladat: "Kész szoftver", kesz: false,
        reszfeladatok: [
          { szoveg: "Kapcsolódás a Vizsgáztató AI motorjához", kesz: false }
        ] },
      { feladat: "Publikálás", kesz: false },
      { feladat: "Láthatóság maximalizálás", kesz: false },
      { feladat: "Sales", kesz: false },
      { feladat: "Marketing", kesz: false },
      { feladat: "SEO", kesz: false },
      { feladat: "eDM / hírlevél", kesz: false },
      { feladat: "Hirdetés (Ads)", kesz: false },
      { feladat: "Tartalom / blog", kesz: false },
      { feladat: "Jogi / adatvédelem", kesz: false },
      { feladat: "Árazás", kesz: false },
      { feladat: "Partnerkapcsolat", kesz: false }
    
    ]
  },
  {
    id: "boraszat-terkep",
    nev: "Borászatok interaktív térképe",
    statusz: "otlet",
    kategoria: "Bor / Térkép",
    rovid: "Teljes interaktív hazai borászati térkép a borvidékekkel és borászatokkal.",
    leiras: `Van egy **másik** rendszerük (NEM az ARworks boros rendszere), amelyben gyűlnek a borászatok és boraik. Abból lehetne egy valódi, teljes interaktív hazai borászati térkép: a történelmi borvidékek mellett a borászatok is rajta.

**Nyitott kérdések:** Melyik rendszer pontosan, van-e API/adatexport? Adatminőség/jogok? Célközönség? Üzleti modell?

🔗 **Kapcsolódó:** DrinkDeal.`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: false,
        reszfeladatok: [
          { szoveg: "Teljes speckó", kesz: false }
        ] },
      { feladat: "Üzleti modell", kesz: false,
        reszfeladatok: [
          { szoveg: "Üzleti modell", kesz: false }
        ] },
      { feladat: "Kész szoftver", kesz: false,
        reszfeladatok: [
          { szoveg: "Adatforrás tisztázása (melyik rendszer, van-e API)", kesz: false }
        ] },
      { feladat: "Publikálás", kesz: false },
      { feladat: "Láthatóság maximalizálás", kesz: false },
      { feladat: "Sales", kesz: false },
      { feladat: "Marketing", kesz: false },
      { feladat: "SEO", kesz: false },
      { feladat: "eDM / hírlevél", kesz: false },
      { feladat: "Hirdetés (Ads)", kesz: false },
      { feladat: "Tartalom / blog", kesz: false },
      { feladat: "Jogi / adatvédelem", kesz: false },
      { feladat: "Árazás", kesz: false },
      { feladat: "Partnerkapcsolat", kesz: false }
    
    ]
  },

  {
    id: "zaszlo-abc",
    nev: "Hajózási zászló-ábécé fordító",
    statusz: "mukodo",
    kategoria: "Mini web / Szórakozás",
    specko: "spec-zaszlo-abc.html",
    proba: "zaszlo-lobogas-proba.html",
    proba2: "zaszlo-lobogas-persp.html",
    keszLink: "zaszlo-fordito.html",
    rovid: "Bármilyen szöveget lefordít hajózási jelzőzászlókra — és lobogó animációval megmutatja.",
    leiras: `Egy **mini weboldal**, amely bármilyen beírt szöveget lefordít a **nemzetközi hajózási jelzőzászló-ábécére** (International Code of Signals — Signal Flags), majd háromféleképpen megjeleníti.

**Hogyan működik:**
- Beírsz egy szót vagy nevet → a betűk zászlókká alakulnak (A–Z, 0–9).
- A szóközök és az ismeretlen karakterek helyén üres hely jelenik meg.

**Három megjelenítési mód:**

**A) Egymás mellett, egy sorban** — a zászlók kifeszítve, mint egy zászlósor (*signal hoist*). Így látszik a teljes szó egyben, és ez a legjobb **megosztható kép** (PNG export gomb).

**B) Egymás után, egyesével** — egyszerre csak **egy** zászló látszik, és a következő betűre lép (automatikusan, beállítható sebességgel, vagy gombra). Olyan, mint a jelzőfény — jól mutatja be, hogyan olvassák a zászlójeleket egyszerre egyet.

**C) Videóként** — az egész folyamat felvétele: a zászlók sorban megjelennek, majd **lobognak**. Letölthető videó (WebM/MP4), így posztható közösségi médiára.

**A lényeg — a zászlók lobogása:** a zászlók **animáltan hullámoznak**, ahogy a szélben. Ez adja a varázsát: nem statikus képek, hanem élő, lobogó zászlók. A hullámzás **valósághűen** készül (csillapított rezgés, nem lineáris), és a zászló alakja is követi a redőket.

**Miért jó ez az ARworks-nak:**
Ez egy **tökéletes megosztható kis eszköz** — könnyen terjed („írd be a nevedet, megnézheted zászlókkal"), és természetesen vezet át a kommunikációba. Az emberek szívesen megosztják az ilyesmit, mert róluk szól. Ez a legjobb belépő: **előbb játszik, aztán kérdez**.

**Technikai vázlat:**
- Zászló-készlet: SVG-ben (26 betű + 10 számjegy + helyettesítő zászlók).
- Megjelenítés: HTML Canvas vagy SVG.
- Lobogás: Canvas-en **hullám-deformáció** (a zászló oszlopai függőlegesen eltolva egy szinusz-görbe mentén, időben eltolva) — ez a klasszikus megoldás.
- Videó: Canvas-ról MediaRecorder → WebM (böngészőben, **szerver nélkül**!). Így nincs szükség szerverre, minden a böngészőben fut.

**Nyitott kérdések:** Melyik zászlórendszert (nemzetközi jelzőzászlók, vagy magyar folyami jelzések)? Kell-e a három mód mind, vagy elég az egyik? Legyen-e linkgenerátor („zászlós név linkje")?

🔗 **Kapcsolódó:** Ötletláda, DarwinAI — ez is a megosztható, figyelmet hozó kategória.`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: true,
        reszfeladatok: [
          { szoveg: "Melyik zászlókészlet (nemzetközi jelzőzászló / magyar folyami)", kesz: true },
          { szoveg: "A három megjelenítési mód véglegesítése", kesz: true }
        ] },
      { feladat: "Üzleti modell", kesz: false,
        reszfeladatok: [
          { szoveg: "Vezet-e ez át szolgáltatáskérésbe / kapcsolatfelvételbe", kesz: false }
        ] },
      { feladat: "Kész szoftver", kesz: true,
        reszfeladatok: [
          { szoveg: "Zászlókészlet SVG-ben (26 betű + 10 számjegy)", kesz: true },
          { szoveg: "Canvas-renderelő és a lobogás-animáció", kesz: true },
          { szoveg: "A) sorban egymás mellett + PNG export", kesz: true },
          { szoveg: "B) egyesével lépegető mód (sebességállítás)", kesz: true },
          { szoveg: "C) videófelvétel MediaRecorder-rel (WebM)", kesz: true }
        ] },
      { feladat: "Publikálás", kesz: true,
        reszfeladatok: [
          { szoveg: "GitHub Pages-re kitelepítés (szerver nélkül fut)", kesz: true }
        ] },
      { feladat: "Láthatóság maximalizálás", kesz: false },
      { feladat: "Sales", kesz: false },
      { feladat: "Marketing", kesz: false,
        reszfeladatok: [
          { szoveg: "Megosztható példák (híres nevek, cégnevek zászlókkal)", kesz: false }
        ] },
      { feladat: "SEO", kesz: false },
      { feladat: "eDM / hírlevél", kesz: false },
      { feladat: "Hirdetés (Ads)", kesz: false },
      { feladat: "Tartalom / blog", kesz: false,
        reszfeladatok: [
          { szoveg: "Rövid cikk: hogyan olvassák a hajósok a jelzőzászlókat", kesz: false }
        ] },
      { feladat: "Jogi / adatvédelem", kesz: false },
      { feladat: "Árazás", kesz: false },
      { feladat: "Partnerkapcsolat", kesz: false,
        reszfeladatok: [
          { szoveg: "Hajós / vitorlás klubok, vitorlás iskolák", kesz: false }
        ] }
    
    ]
  },

  {
    id: "ivfsimpro",
    nev: "IVF Sim Pro",
    url: "https://ivfsimpro.com",
    statusz: "mukodo",
    kategoria: "Medtech / VR oktatás",
    rovid: "A világ első VR és webböngészős ICSI/embrió-biopszia szimulátora — orvosi szakképzésre.",
    leiras: `Az **IVF Sim Pro (ivfsimpro.com)** egy mesterséges megtermékenyítési (IVF) oktató-szimulátor szoftver: VR és webböngészős változatban tanítja az **ICSI** (intracitoplazmatikus spermium-injekció) és az **embrió-biopszia** lépéseit. A világ első ilyen VR megoldása ezen a területen.

**Mit tud:**
- **Teljes folyamat szimuláció** élethű virtuális laborban, valós méretű mikroszkóppal — a kezelőgombok egy valódi IVF-mikroszkóp funkcióit utánozzák.
- **Valós idejű visszajelzés**: hibák, tűbeállítások mindig láthatók, a lépések és a következő művelet a képernyőn követhető.
- **Végtelen gyakorlás** ritka és deformált mintákkal is, drága laboreszközök, petesejt/spermium-készlet és oktató nélkül.
- **Vizsgáztatás**: eljárási tudás, sebesség és pontosság mérése, tudásfrissítés.

**Hogyan érhető el:**
- **VR app** Oculus Quest I/II-n (teljesen immerzív, valós méretű labor).
- **Web app** laptoppal/PC-vel (Safari, Chrome, Edge; a tűket billentyűzettel kezelni).

**Célcsoport:** orvosi egyetemek, IVF-klinikák, szakképző intézmények, gyakorló szakemberek.
- **Egyéni szakembereknek:** előfizetés **40 USD/hó**, saját eszközön.
- **Szervezeteknek:** havi/éves előfizetés csomagban, **telepítéssel, képzéssel és support vonallal**.

**Ami már kész:** a **VR app**, a **webapp** és a **weboldal** is él. Az **ARworks** fejlesztette (VR/AR/3D fejlesztő, más orvosi immerzív megoldásokra is nyitott); a szakmai kérdéseket a The IVF Company válaszolja meg.

**Ami hiányzik / a következő lépés:** **sales és kommunikáció.** Ehhez **van Mailchimp kontaktlistánk** — meg kell szólítani a klinikákat, egyetemeket és szakképzőket.

**Lehetőségek:**
- Meglévő Mailchimp lista szegmentálása és célzott eDM-sorozat (klinikák, egyetemek, oktatóközpontok).
- Bemutatóvideó / demó elérhetővé tétele a döntéshozóknak.
- Intézményi csomag (telepítés + képzés + support) hangsúlyozása a magasabb értékű szerződésekhez.
- Konferenciák, IVF/ART szakmai rendezvények, egyetemi kapcsolatok.
- Több nyelvű üzenet (a termék már eleve nemzetközi).

**Nyitott kérdések:** Melyik Mailchimp lista pontosan (audience ID)? Ki a döntéshozó az intézményeknél (laborvezető, szakképzési felelős, beszerzés)? Van-e kész bemutatóvideó, esettanulmány vagy ügyfél-referencia? Mi az első kampány célja (demó / előfizetés / intézményi ajánlat)?

🔗 **Kapcsolódó:** ARworks, CogniView (VR mérés), a darwinai.hu kommunikációs modell.`,
    hatralevo: [
      { feladat: "Teljes speckó", kesz: true,
        reszfeladatok: [
          { szoveg: "Termék és funkciók (VR + web app, ICSI + embrió-biopszia)", kesz: true },
          { szoveg: "Weboldal és csomagok (egyéni / intézményi)", kesz: true }
        ] },
      { feladat: "Üzleti modell", kesz: true,
        reszfeladatok: [
          { szoveg: "Előfizetés: 40 USD/hó egyéni, intézményi csomag telepítéssel", kesz: true },
          { szoveg: "Magasabb értékű intézményi szerződések kidolgozása", kesz: false }
        ] },
      { feladat: "Kész szoftver", kesz: true,
        reszfeladatok: [
          { szoveg: "VR app Oculus Quest I/II-re", kesz: true },
          { szoveg: "Web app böngészőben (Safari, Chrome, Edge)", kesz: true },
          { szoveg: "Weboldal (ivfsimpro.com)", kesz: true }
        ] },
      { feladat: "Publikálás", kesz: true },
      { feladat: "Láthatóság maximalizálás", kesz: false,
        reszfeladatok: [
          { szoveg: "Bemutatóvideó / demó a döntéshozóknak", kesz: false },
          { szoveg: "Esettanulmány / ügyfél-referencia összeállítása", kesz: false }
        ] },
      { feladat: "Sales", kesz: false,
        reszfeladatok: [
          { szoveg: "Mailchimp kontaktlista szegmentálása (klinikák, egyetemek, szakképzők)", kesz: false },
          { szoveg: "Döntéshozók azonosítása (laborvezető, szakképzési felelős, beszerzés)", kesz: false },
          { szoveg: "Intézményi ajánlat / pilot program kidolgozása", kesz: false },
          { szoveg: "Outreach-sorozat a meglévő listára", kesz: false }
        ] },
      { feladat: "Marketing", kesz: false,
        reszfeladatok: [
          { szoveg: "Pozicionálás: „a világ első VR ICSI-szimulátora”", kesz: false },
          { szoveg: "Szakmai üzenetek (idő- és költségmegtakarítás, végtelen gyakorlás)", kesz: false }
        ] },
      { feladat: "SEO", kesz: false,
        reszfeladatok: [
          { szoveg: "Kulcsszavak: ICSI training simulator, IVF VR training, embryo biopsy simulation", kesz: false }
        ] },
      { feladat: "eDM / hírlevél", kesz: false,
        reszfeladatok: [
          { szoveg: "Célzott eDM-sorozat a meglévő Mailchimp listára", kesz: false },
          { szoveg: "Intézményi döntéshozóknak szóló, rövidebb demó-ajánló levél", kesz: false }
        ] },
      { feladat: "Hirdetés (Ads)", kesz: false,
        reszfeladatok: [
          { szoveg: "LinkedIn célzás: IVF-klinika / egyetemi / medtech döntéshozók", kesz: false }
        ] },
      { feladat: "Tartalom / blog", kesz: false,
        reszfeladatok: [
          { szoveg: "Szakmai cikk: hogyan gyorsítja a VR a szakképzést", kesz: false }
        ] },
      { feladat: "Jogi / adatvédelem", kesz: false,
        reszfeladatok: [
          { szoveg: "Oktatási célú adatkezelés és megfelelés (medtech környezet)", kesz: false }
        ] },
      { feladat: "Árazás", kesz: true,
        reszfeladatok: [
          { szoveg: "Egyéni: 40 USD/hó", kesz: true },
          { szoveg: "Intézményi: csomagár telepítéssel és támogatással", kesz: false }
        ] },
      { feladat: "Partnerkapcsolat", kesz: false,
        reszfeladatok: [
          { szoveg: "The IVF Company (szakmai partner) kapcsolat erősítése", kesz: false },
          { szoveg: "IVF/ART szakmai konferenciák és egyetemi kapcsolatok", kesz: false },
          { szoveg: "Dubai IVF Training Centre (pre-session helyszín)", kesz: false }
        ] }
    
    ]
  }
];
