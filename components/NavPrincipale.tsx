"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const LIENS = [
  { href: "/annonces?transaction=vente", label: "Acheter", cle: "vente" },
  { href: "/annonces?transaction=location", label: "Louer", cle: "location" },
  { href: "/annonces?categorie=champ", label: "Terres agricoles", cle: "champ" },
  { href: "/annonces?verifiees=1", label: "Biens vérifiés", cle: "verifiees" },
  { href: "/guide", label: "Guide", cle: "guide" },
];

export function NavPrincipale({ staff }: { staff: boolean }) {
  const chemin = usePathname();
  const sp = useSearchParams();
  const actif = (cle: string) =>
    cle === "guide" ? chemin.startsWith("/guide")
      : chemin === "/annonces" && (sp.get("transaction") === cle || sp.get("categorie") === cle || (cle === "verifiees" && sp.get("verifiees") === "1"));

  return (
    <nav className="hidden items-center gap-1 text-[15px] font-medium lg:flex" aria-label="Navigation principale">
      {LIENS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`relative rounded-full px-3.5 py-2 transition ${actif(l.cle) ? "text-dk" : "text-dk/70 hover:bg-dk/5 hover:text-dk"}`}
        >
          {l.label}
          {actif(l.cle) && <span className="absolute inset-x-3.5 -bottom-[17px] h-[3px] rounded-full bg-dk" />}
        </Link>
      ))}
      {staff && (
        <Link href="/admin" className={`rounded-full px-3.5 py-2 ${chemin.startsWith("/admin") ? "text-dk" : "text-dk/70 hover:bg-dk/5"}`}>Administration</Link>
      )}
    </nav>
  );
}
