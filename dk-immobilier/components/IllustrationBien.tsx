import type { Categorie } from "@/lib/types";

/**
 * Visuel « plan d'architecte » bleu et blanc, affiché tant qu'une annonce n'a pas de photo.
 * Le motif varie selon la catégorie et la graine (id de l'annonce).
 */
export function IllustrationBien({
  categorie,
  graine = "x",
  className = "",
}: {
  categorie: Categorie;
  graine?: string;
  className?: string;
}) {
  const h = [...graine].reduce((s, ch) => (s * 31 + ch.charCodeAt(0)) % 9973, 7);
  const r = (n: number) => ((h * (n + 3)) % 17) - 8; // petite variation déterministe
  const blanc = "#FFFFFF";
  const t = { stroke: blanc, fill: "none", strokeWidth: 2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  const fin = { ...t, strokeWidth: 1, opacity: 0.55 };

  return (
    <svg viewBox="0 0 400 260" className={`block h-full w-full bg-dk ${className}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id={`g-${graine}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke={blanc} strokeOpacity="0.09" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="400" height="260" fill={`url(#g-${graine})`} />

      {categorie === "terrain" && (
        <g>
          <path {...t} d={`M${92 + r(1)} ${62 + r(2)}L${300 + r(3)} ${50 + r(4)}L${322 + r(5)} ${196 + r(6)}L${78 + r(7)} ${208 + r(8)}Z`} strokeDasharray="10 6" />
          {[[92 + r(1), 62 + r(2)], [300 + r(3), 50 + r(4)], [322 + r(5), 196 + r(6)], [78 + r(7), 208 + r(8)]].map(([x, y], i) => (
            <g key={i}><circle cx={x} cy={y} r="6" fill={blanc} /><circle cx={x} cy={y} r="11" {...fin} /></g>
          ))}
          <path {...fin} d="M92 34H300M92 28v12M300 28v12" />
          <text x="196" y="26" fill={blanc} fontSize="12" textAnchor="middle" fontFamily="inherit" opacity=".8">LOT N° {100 + (h % 400)}</text>
          <path {...t} d="M182 130h36M200 112v36" opacity=".7" />
        </g>
      )}

      {categorie === "champ" && (
        <g>
          <path {...t} d="M60 70L340 52L352 210L48 222Z" />
          {Array.from({ length: 9 }).map((_, i) => (
            <path key={i} {...fin} d={`M${70 + i * 32} ${68 - i * 2}C${60 + i * 32} 120 ${84 + i * 32} 160 ${66 + i * 32} ${220 - i}`} />
          ))}
          <circle cx={290 + r(1)} cy={96 + r(2)} r="16" {...t} />
          <path {...t} d={`M${290 + r(1)} ${80 + r(2)}v-14m-8 6 8-6 8 6`} />
          <path {...t} d="M0 236H400" strokeDasharray="12 8" opacity=".8" />
        </g>
      )}

      {categorie === "maison" && (
        <g>
          <path {...t} d="M110 214V118L200 58L290 118V214Z" />
          <path {...t} d="M180 214v-54h40v54" />
          <rect x="126" y="134" width="36" height="30" {...t} />
          <rect x="238" y="134" width="36" height="30" {...t} />
          <path {...fin} d="M144 134v30M126 149h36M256 134v30M238 149h36" />
          <path {...t} d="M60 214H340" />
          <path {...fin} d="M70 232H330M70 226v12M330 226v12" />
          <circle cx={326 + r(2)} cy="70" r="14" {...fin} />
        </g>
      )}

      {categorie === "appartement" && (
        <g>
          <rect x="130" y="40" width="140" height="176" {...t} />
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 3 }).map((_, col) => (
              <rect key={`${row}-${col}`} x={146 + col * 40} y={56 + row * 30} width="28" height="18" {...(row === 2 && col === 1 ? { fill: blanc } : fin)} />
            )),
          )}
          <path {...t} d="M60 216H340M188 216v-22h24v22" />
        </g>
      )}

      {categorie === "local" && (
        <g>
          <path {...t} d="M90 214V96h220v118" />
          <path {...t} d="M80 96l20-36h200l20 36" />
          {Array.from({ length: 6 }).map((_, i) => (
            <path key={i} {...fin} d={`M${100 + i * 34} 60 ${90 + i * 40} 96`} />
          ))}
          <rect x="110" y="120" width="110" height="64" {...t} />
          <path {...t} d="M246 214v-94h44v94" />
          <path {...t} d="M60 214H340" />
        </g>
      )}
    </svg>
  );
}
