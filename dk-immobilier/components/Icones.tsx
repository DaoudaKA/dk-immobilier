// Icônes au trait, en currentColor (donc toujours bleu ou blanc).
type P = { className?: string };
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const IconeRecherche = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const IconeCarte = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" /><path d="M9 4v14M15 6v14" /></svg>
);
export const IconeListe = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
);
export const IconePin = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const IconeSurface = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><path d="M4 4h16v16H4z" strokeDasharray="3 2.5" /><path d="M8 16 16 8M12 8h4v4" /></svg>
);
export const IconeBouclier = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z" /><path d="m8.8 12 2.2 2.2 4.4-4.4" /></svg>
);
export const IconeDocument = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
);
export const IconeMessage = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12Z" /></svg>
);
export const IconeCalendrier = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
);
export const IconeCoeur = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z" /></svg>
);
export const IconePartage = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6" /></svg>
);
export const IconeTelephone = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><path d="M5 3.5h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.8 6.8l1.4-2.2 4.3 1.7V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5Z" /></svg>
);
export const IconeFleche = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const IconePlus = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><path d="M12 5v14M5 12h14" /></svg>
);
export const IconeOeil = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const IconeEau = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5Z" /></svg>
);
export const IconeUtilisateur = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><circle cx="12" cy="8" r="4" /><path d="M4 20.5c1.4-3.6 4.4-5.5 8-5.5s6.6 1.9 8 5.5" /></svg>
);
export const IconeMenu = ({ className = "size-6" }: P) => (
  <svg {...base} className={className}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const IconeCamera = ({ className = "size-5" }: P) => (
  <svg {...base} className={className}><path d="M4 8h3l2-2.5h6L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
);
