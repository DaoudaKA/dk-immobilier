type Props = {
  variante?: "bleu" | "blanc";
  taille?: number;
  avecTexte?: boolean;
  className?: string;
};

/**
 * Logo DK IMMOBILIER.
 * Le D abrite une maison dans son contre-poinçon, le K s'ouvre comme une route,
 * et la ligne pointillée rappelle le bornage d'une parcelle.
 */
export function LogoMarque({ variante = "bleu", taille = 40, className }: Omit<Props, "avecTexte">) {
  const fond = variante === "bleu" ? "#0B3C8C" : "#FFFFFF";
  const trait = variante === "bleu" ? "#FFFFFF" : "#0B3C8C";
  return (
    <svg viewBox="0 0 200 200" width={taille} height={taille} className={className} aria-hidden="true">
      <rect width="200" height="200" rx="46" fill={fond} />
      <g transform="translate(-8 -6)" fill={trait}>
        <path fillRule="evenodd" d="M34 50H64A40 40 0 0 1 104 90V110A40 40 0 0 1 64 150H34Z M52 94L69 75L86 92V132H52Z" />
        <path d="M63 112H75V132H63Z" />
        <path d="M116 50H134V150H116Z M134 84L159 50H181L134 112Z M147 96L182 150H160L136 113Z" />
        <path d="M34 168H182" stroke={trait} strokeWidth="5" strokeDasharray="11 7" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

export function Logo({ variante = "bleu", taille = 40, avecTexte = true, className = "" }: Props) {
  const couleurTexte = variante === "bleu" ? "text-dk" : "text-blanc";
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMarque variante={variante} taille={taille} />
      {avecTexte && (
        <span className={`flex flex-col leading-none ${couleurTexte}`}>
          <span className="text-[1.35em] font-extrabold tracking-tight">DK</span>
          <span className="mt-0.5 text-[0.62em] font-semibold tracking-[0.32em]">IMMOBILIER</span>
        </span>
      )}
    </span>
  );
}
