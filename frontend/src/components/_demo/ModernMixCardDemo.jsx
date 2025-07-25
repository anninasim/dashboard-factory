import React from "react";

// --- Parser HTML semplificato per demo ---
function parseMixHTML(htmlString) {
  // Rimuovi tag body/table/tr
  const tdRegex = /<td[^>]*>(.*?)<\/td>/gi;
  const rows = [];
  let match;
  let currentRow = [];
  while ((match = tdRegex.exec(htmlString))) {
    currentRow.push(match[1]);
    if (currentRow.length === 3) {
      rows.push([...currentRow]);
      currentRow = [];
    }
  }
  // Trasforma in oggetti
  return rows.map(([label, main, comps]) => {
    // Lettera
    const letter = label.replace(/<[^>]+>/g, "").trim();
    // Percentuale principale + miscela
    const mainMatch = main.match(/([\d\.]+)%\s*\(([^)]+)\)/);
    let percent = null, miscela = null;
    if (mainMatch) {
      percent = parseFloat(mainMatch[1]);
      miscela = mainMatch[2];
    } else {
      // fallback: solo percentuale
      const p = main.match(/([\d\.]+)%/);
      percent = p ? parseFloat(p[1]) : null;
      miscela = main.replace(/<[^>]+>/g, "").trim();
    }
    // Componenti
    const compLines = comps
      .replace(/<br\s*\/?>(\s*)?/gi, "\n")
      .replace(/&nbsp;/gi, " ")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    const components = compLines.map((line) => {
      const m = line.match(/([\d\.]+)%\s+(.+)/);
      return m
        ? { percent: parseFloat(m[1]), name: m[2] }
        : { percent: null, name: line };
    });
    return { letter, percent, miscela, components };
  });
}

// --- Demo HTML (puoi sostituire con il tuo) ---
const demoHTML = `
<body><table><tr>
<td><b><font size="5px">A</font></b></td>
<td><b><font size="2px">17.50% (H16.13_10 (Misc_mPE80 modificata))</font></b></td>
<td><b><font size="2px"> <BR> 5.00% AIUTODIPROCESSO (MD511502 PE)<BR>4.00% ANTIBLOCKING (PRISMA AD SILBLOC 90010/A)<BR>1.00% ANTIUVXT (MASTER UV 70984 con A430)</font></b></td>
</tr></table></body>
<body><table><tr>
<td><b><font size="5px">B</font></b></td>
<td><b><font size="2px">19.50% (Misc_mPE80)</font></b></td>
<td><b><font size="2px"> <BR> 1.00% ANTIUVXT (MASTER UV 70984 con A430)</font></b></td>
</tr></table></body>
<body><table><tr>
<td><b><font size="5px">C</font></b></td>
<td><b><font size="2px">10.00% (Misc_mPE80)</font></b></td>
<td><b><font size="2px"> <BR> 10.00% COLLAPA_PE (COMPOBIND CB/LL 25100H)<BR>1.00% ANTIUVXT (MASTER UV 70984 con A430)</font></b></td>
</tr></table></body>
`;

const mixData = parseMixHTML(demoHTML);

// --- Card compatta ---
function ModernMixCard({ letter, percent, miscela, components }) {
  // Colore percentuale
  const getColor = (p) => {
    if (p >= 70) return "text-green-400";
    if (p >= 40) return "text-yellow-400";
    return "text-orange-400";
  };
  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-700/40 shadow-sm p-3 flex flex-col gap-2 min-w-[220px] max-w-[320px]">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-extrabold text-cyan-400 w-6 text-center">{letter}</span>
        <span className={`text-lg font-bold ${getColor(percent)}`}>{percent}%</span>
        <span className="text-xs text-slate-300 ml-2 truncate">{miscela}</span>
      </div>
      <div className="flex flex-col gap-1 mt-1">
        {components.map((c, i) => (
          <div key={i} className="flex items-center text-xs text-slate-200">
            {c.percent !== null && (
              <span className={`font-semibold mr-2 ${getColor(c.percent)}`}>{c.percent}%</span>
            )}
            <span className="truncate">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Demo grid ---
export default function ModernMixCardDemo() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 to-slate-800 flex flex-col items-center justify-center p-8">
      <h2 className="text-xl font-bold text-white mb-6">Demo Mix Card Compatta</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mixData.map((data, idx) => (
          <ModernMixCard key={idx} {...data} />
        ))}
      </div>
    </div>
  );
}
