/**
 * Paysages du Sénégal dessinés en bichromie bleu DK / blanc.
 * Servent de visuels tant que de vraies photos ne sont pas fournies,
 * et respectent la charte à deux couleurs.
 */
export type TypeScene = "niayes" | "cote" | "ville" | "fleuve" | "savane" | "casamance";

const B = "#FFFFFF";

function Palmier({ x, y, s = 1, o = 0.9 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} fill="none" stroke={B} strokeWidth={3} strokeLinecap="round">
      <path d="M0 0C6-60 2-120 14-180" />
      <path d="M14-180c-30-6-56 4-74 24M14-180c-22-24-50-30-76-24M14-180c8-30 30-48 58-52M14-180c30-12 60-6 82 12M14-180c26 4 46 22 56 46M14-180c-10 22-30 38-54 46" />
    </g>
  );
}

function Baobab({ x, y, s = 1, o = 0.9 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} fill={B}>
      <path d="M-26 0C-22-40-20-80-24-120h48C20-80 22-40 26 0Z" />
      <path d="M-24-118c-20-6-40-20-56-40l6-4c16 16 34 28 52 32ZM24-118c22-8 40-24 52-44l6 4c-12 22-32 38-56 46ZM-6-120c-4-20-2-40 8-58l6 2c-8 18-10 36-6 56ZM6-120c10-14 24-24 40-28l2 6c-16 4-28 12-36 24Z" />
      <ellipse cx="-80" cy="-166" rx="28" ry="12" opacity=".7" />
      <ellipse cx="78" cy="-168" rx="30" ry="12" opacity=".7" />
      <ellipse cx="6" cy="-184" rx="24" ry="10" opacity=".7" />
      <ellipse cx="48" cy="-150" rx="18" ry="8" opacity=".6" />
    </g>
  );
}

function Maison({ x, y, s = 1, o = 1 }: { x: number; y: number; s?: number; o?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} fill="none" stroke={B} strokeWidth={3} strokeLinejoin="round">
      <path d="M0 0V-70L60-110L120-70V0Z" />
      <path d="M48 0v-36h24V0" />
      <rect x="14" y="-58" width="22" height="18" />
      <rect x="84" y="-58" width="22" height="18" />
    </g>
  );
}

function Borne({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="7" fill={B} />
      <circle cx={x} cy={y} r="15" fill="none" stroke={B} strokeOpacity=".5" strokeWidth="2" />
    </g>
  );
}

export function Scene({ type, className = "", graine = 0 }: { type: TypeScene; className?: string; graine?: number }) {
  const g = graine % 5;
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className={`block h-full w-full bg-dk ${className}`} aria-hidden="true">
      {/* Ciel : soleil et halos */}
      <circle cx={1180 + g * 40} cy={230} r={92} fill={B} opacity=".92" />
      <circle cx={1180 + g * 40} cy={230} r={150} fill={B} opacity=".07" />
      <circle cx={1180 + g * 40} cy={230} r={230} fill={B} opacity=".05" />
      <g stroke={B} strokeOpacity=".18" strokeWidth="3" strokeLinecap="round">
        <path d={`M${180 + g * 30} 170h140M${230 + g * 30} 200h170`} />
        <path d="M620 120h110M660 148h150" />
      </g>

      {type === "niayes" && (
        <g>
          <path d="M0 520C200 470 420 500 640 470S1100 430 1600 480V900H0Z" fill={B} opacity=".08" />
          <Palmier x={210} y={540} s={1.1} o={0.55} />
          <Palmier x={300} y={555} s={0.8} o={0.45} />
          <Palmier x={1420} y={520} s={1.2} o={0.5} />
          <path d="M0 600C300 560 600 590 900 570S1400 560 1600 590V900H0Z" fill={B} opacity=".12" />
          {/* Sillons de maraîchage */}
          <g stroke={B} strokeWidth="3" fill="none" opacity=".75">
            {Array.from({ length: 16 }).map((_, i) => (
              <path key={i} d={`M${-200 + i * 130} 900C${-60 + i * 120} 780 ${120 + i * 110} 700 ${330 + i * 96} 640`} />
            ))}
          </g>
          <path d="M520 860 600 690 1080 668 1180 850Z" fill="none" stroke={B} strokeWidth="4" strokeDasharray="22 14" />
          <Borne x={600} y={690} /><Borne x={1080} y={668} /><Borne x={1180} y={850} /><Borne x={520} y={860} />
          <Maison x={1240} y={640} s={0.9} o={0.9} />
        </g>
      )}

      {type === "cote" && (
        <g>
          <path d="M0 560H1600V900H0Z" fill={B} opacity=".1" />
          <g stroke={B} strokeWidth="3" fill="none" opacity=".6" strokeLinecap="round">
            {Array.from({ length: 7 }).map((_, i) => (
              <path key={i} d={`M${-40 + (i % 2) * 60} ${590 + i * 26}q50-14 100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0`} opacity={1 - i * 0.1} />
            ))}
          </g>
          <path d="M0 900C260 760 620 740 900 770S1400 820 1600 760V900Z" fill={B} opacity=".16" />
          <Palmier x={260} y={830} s={1.5} o={0.85} />
          <Palmier x={380} y={850} s={1.1} o={0.6} />
          {/* Villa contemporaine */}
          <path d="M940 800V640H1020V560H1240V640H1300V800Z" fill="#0B3C8C" />
          <g fill="none" stroke={B} strokeWidth="4" strokeLinejoin="round">
            <path d="M940 800V640H1300V800" />
            <path d="M900 640H1340M1020 640V560H1240V640" />
            <rect x="980" y="680" width="120" height="70" />
            <rect x="1150" y="680" width="100" height="120" />
            <path d="M1040 680v70M980 715h120" strokeOpacity=".6" />
          </g>
          <path d="M860 800H1400" stroke={B} strokeWidth="4" />
        </g>
      )}

      {type === "ville" && (
        <g>
          <g fill={B} opacity=".1">
            <rect x="80" y="420" width="120" height="480" /><rect x="230" y="360" width="90" height="540" />
            <rect x="350" y="460" width="150" height="440" /><rect x="1120" y="380" width="110" height="520" />
            <rect x="1260" y="440" width="140" height="460" /><rect x="1420" y="330" width="100" height="570" />
          </g>
          <g fill="none" stroke={B} strokeWidth="4">
            <rect x="560" y="300" width="170" height="600" />
            <rect x="760" y="400" width="200" height="500" />
            <rect x="990" y="480" width="130" height="420" />
          </g>
          <g fill={B} opacity=".85">
            {Array.from({ length: 10 }).map((_, r) =>
              Array.from({ length: 3 }).map((_, c) => (
                <rect key={`a${r}${c}`} x={580 + c * 50} y={330 + r * 54} width="30" height="26" opacity={(r + c + g) % 4 === 0 ? 1 : 0.25} />
              )),
            )}
            {Array.from({ length: 8 }).map((_, r) =>
              Array.from({ length: 4 }).map((_, c) => (
                <rect key={`b${r}${c}`} x={780 + c * 45} y={430 + r * 56} width="26" height="28" opacity={(r * c + g) % 5 === 0 ? 1 : 0.25} />
              )),
            )}
          </g>
          <path d="M0 860H1600" stroke={B} strokeWidth="4" />
          <path d="M0 880H1600" stroke={B} strokeWidth="2" strokeDasharray="30 20" opacity=".6" />
        </g>
      )}

      {type === "fleuve" && (
        <g>
          <path d="M0 540C300 520 700 540 1000 520S1400 510 1600 530V900H0Z" fill={B} opacity=".08" />
          <path d="M0 700C320 650 600 740 900 690S1380 640 1600 680V760C1380 720 1180 790 900 770S320 720 0 790Z" fill={B} opacity=".28" />
          <g stroke={B} strokeWidth="2.5" opacity=".7">
            {Array.from({ length: 40 }).map((_, i) => (
              <path key={i} d={`M${20 + i * 40} 900v-${40 + ((i * 7) % 30)}M${20 + i * 40} 900l-10-${30 + ((i * 5) % 20)}M${20 + i * 40} 900l10-${30 + ((i * 3) % 20)}`} />
            ))}
          </g>
          <path d="M120 600h340v60H120Z" fill="none" stroke={B} strokeWidth="3" strokeDasharray="16 10" />
          <path d="M520 600h340v60H520Z" fill="none" stroke={B} strokeWidth="3" strokeDasharray="16 10" />
          <Palmier x={1300} y={560} s={0.9} o={0.5} />
        </g>
      )}

      {type === "savane" && (
        <g>
          <path d="M0 610C400 580 800 620 1200 590S1500 600 1600 610V900H0Z" fill={B} opacity=".1" />
          <Baobab x={420} y={720} s={2.2} o={0.95} />
          <Baobab x={1240} y={640} s={1.1} o={0.45} />
          <g stroke={B} strokeWidth="2" opacity=".5" strokeLinecap="round">
            {Array.from({ length: 50 }).map((_, i) => (
              <path key={i} d={`M${i * 33} ${760 + ((i * 13) % 60)}l6-18M${i * 33 + 10} ${760 + ((i * 13) % 60)}l-4-14`} />
            ))}
          </g>
          <path d="M780 880 860 740 1300 730 1380 870Z" fill="none" stroke={B} strokeWidth="4" strokeDasharray="22 14" />
          <Borne x={860} y={740} /><Borne x={1300} y={730} /><Borne x={1380} y={870} /><Borne x={780} y={880} />
        </g>
      )}

      {type === "casamance" && (
        <g>
          <path d="M0 520C300 470 600 520 900 480S1400 470 1600 500V900H0Z" fill={B} opacity=".1" />
          {Array.from({ length: 14 }).map((_, i) => (
            <ellipse key={i} cx={60 + i * 120} cy={520 + ((i * 37) % 50)} rx={90} ry={60} fill={B} opacity={0.1 + (i % 3) * 0.05} />
          ))}
          <Palmier x={180} y={760} s={1.6} o={0.8} />
          <Palmier x={1380} y={740} s={1.4} o={0.7} />
          <path d="M0 780C300 740 700 800 1000 770S1400 750 1600 770V900H0Z" fill={B} opacity=".22" />
          <g stroke={B} strokeWidth="3" fill="none" opacity=".7">
            {Array.from({ length: 6 }).map((_, i) => (
              <path key={i} d={`M${560 + i * 70} 800c-10-40 0-80 20-110M${580 + i * 70} 690c20 10 30 30 30 50`} />
            ))}
          </g>
          <Maison x={1040} y={760} s={0.9} />
        </g>
      )}
    </svg>
  );
}

export function sceneDeRegion(region: string, categorie?: string): TypeScene {
  if (categorie === "appartement" || categorie === "local") return "ville";
  switch (region) {
    case "Dakar": return categorie === "maison" ? "cote" : "ville";
    case "Thiès": return categorie === "champ" ? "niayes" : "cote";
    case "Louga": return "niayes";
    case "Saint-Louis": return "fleuve";
    case "Ziguinchor": case "Sédhiou": case "Kolda": return "casamance";
    default: return categorie === "champ" ? "savane" : "savane";
  }
}
