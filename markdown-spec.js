/* ============================================================
   markdown-spec.js — minimál markdown-rendelő a specifikációhoz
   Szerver nélkül fut, nincs külső függőség.
   Kezeli: # ## ### ####, felsorolás, sorszámozott lista, táblázat,
   kódblokk, idézet, vízszintes vonal, félkövér, dőlt, kód.
   ============================================================ */

function mdSpec(s) {
  if (!s) return "";
  const esc = t => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* 1. kódblokkokat kiemeljük, hogy a benne lévő jelölést ne alakítsuk */
  const kodok = [];
  s = s.replace(/```[a-z]*\n([\s\S]*?)```/g, (m, b) => {
    kodok.push(b.replace(/\n$/, ""));
    return "\u0000KOD" + (kodok.length - 1) + "\u0000";
  });

  s = esc(s);

  /* 2. soronkénti szerkezetek */
  const sorok = s.split("\n");
  const ki = [];
  let tablazatban = false;
  let listaban = null;   /* "ul" | "ol" | null */
  let kodb = false;

  const zar = () => {
    if (listaban) { ki.push("</" + listaban + ">"); listaban = null; }
  };
  const zarTabla = () => {
    if (tablazatban) { ki.push("</tbody></table>"); tablazatban = false; }
  };

  const inline = t => t
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");

  for (let i = 0; i < sorok.length; i++) {
    const sor = sorok[i];

    /* kódblokk-helyőrző */
    const kh = sor.match(/^\u0000KOD(\d+)\u0000$/);
    if (kh) {
      zar(); zarTabla();
      ki.push("<pre><code>" + kodok[+kh[1]] + "</code></pre>");
      continue;
    }

    /* táblázat: | a | b |  majd  |---|---| */
    if (/^\s*\|.*\|\s*$/.test(sor)) {
      const kov = sorok[i + 1] || "";
      const fejlec = /^\s*\|[\s:|-]+\|\s*$/.test(kov);
      if (fejlec) {
        zar(); zarTabla();
        const cellak = sor.trim().slice(1, -1).split("|").map(c => c.trim());
        ki.push("<table><thead><tr>" +
          cellak.map(c => "<th>" + inline(c) + "</th>").join("") +
          "</tr></thead><tbody>");
        tablazatban = true;
        i++;   /* az elválasztó sort átugorjuk */
        continue;
      }
      if (tablazatban) {
        const cellak = sor.trim().slice(1, -1).split("|").map(c => c.trim());
        ki.push("<tr>" + cellak.map(c => "<td>" + inline(c) + "</td>").join("") + "</tr>");
        continue;
      }
    } else {
      zarTabla();
    }

    /* címsorok */
    let m;
    if ((m = sor.match(/^####\s+(.*)$/))) { zar(); ki.push("<h4>" + inline(m[1]) + "</h4>"); continue; }
    if ((m = sor.match(/^###\s+(.*)$/)))  { zar(); ki.push("<h4>" + inline(m[1]) + "</h4>"); continue; }
    if ((m = sor.match(/^##\s+(.*)$/)))   { zar(); ki.push("<h2>" + inline(m[1]) + "</h2>"); continue; }
    if ((m = sor.match(/^#\s+(.*)$/)))    { zar(); ki.push("<h1>" + inline(m[1]) + "</h1>"); continue; }

    /* vízszintes vonal */
    if (/^\s*(---|\*\*\*)\s*$/.test(sor)) { zar(); ki.push("<hr>"); continue; }

    /* idézet */
    if ((m = sor.match(/^>\s?(.*)$/))) {
      zar();
      ki.push("<blockquote>" + inline(m[1]) + "</blockquote>");
      continue;
    }

    /* felsorolás */
    if ((m = sor.match(/^\s*[-*]\s+(.*)$/))) {
      zarTabla();
      if (listaban !== "ul") { zar(); ki.push("<ul>"); listaban = "ul"; }
      ki.push("<li>" + inline(m[1]) + "</li>");
      continue;
    }

    /* sorszámozott lista */
    if ((m = sor.match(/^\s*\d+\.\s+(.*)$/))) {
      zarTabla();
      if (listaban !== "ol") { zar(); ki.push("<ol>"); listaban = "ol"; }
      ki.push("<li>" + inline(m[1]) + "</li>");
      continue;
    }

    /* üres sor */
    if (/^\s*$/.test(sor)) { zar(); zarTabla(); continue; }

    /* bekezdés */
    zar(); zarTabla();
    ki.push("<p>" + inline(sor) + "</p>");
  }
  zar(); zarTabla();

  return ki.join("\n");
}
