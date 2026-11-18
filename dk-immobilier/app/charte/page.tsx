import type { Metadata } from "next";
import { IllustrationBien } from "@/components/IllustrationBien";
import { Logo, LogoMarque } from "@/components/Logo";

export const metadata: Metadata = { title: "Charte graphique" };

export default function PageCharte() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dk/50">Identité visuelle</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">Charte graphique DK IMMOBILIER</h1>
      <p className="mt-4 max-w-2xl text-dk/70">
        Deux couleurs, pas une de plus. Le bleu DK porte la confiance et le sérieux d&apos;un acte foncier ; le blanc laisse respirer les annonces. Toutes les nuances sont des transparences du bleu sur le blanc.
      </p>

      <section className="mt-12 grid gap-5 md:grid-cols-2">
        <div className="flex aspect-[16/10] items-center justify-center rounded-[2rem] border border-dk/12 text-[22px]">
          <Logo taille={96} />
        </div>
        <div className="plan-grid-blanc flex aspect-[16/10] items-center justify-center rounded-[2rem] bg-dk text-[22px]">
          <Logo variante="blanc" taille={96} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Le symbole</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-[280px_1fr]">
          <LogoMarque taille={280} />
          <ul className="space-y-4 text-dk/80">
            <li><strong className="text-dk">Le D abrite une maison.</strong> Son contre-poinçon dessine un toit et une porte : le bâti, la famille, le foyer.</li>
            <li><strong className="text-dk">Le K s&apos;ouvre comme une route.</strong> Ses deux branches pointent vers l&apos;avant : l&apos;accès, l&apos;avenir, la transaction.</li>
            <li><strong className="text-dk">La ligne pointillée est un bornage.</strong> Elle reprend le trait des plans cadastraux : la parcelle délimitée, vérifiée, sûre.</li>
            <li><strong className="text-dk">Le carré aux angles arrondis</strong> sert d&apos;icône d&apos;application et de favicon. Zone de protection : un quart de sa largeur tout autour.</li>
          </ul>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">Les deux couleurs</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] border border-dk/12">
            <div className="h-44 bg-dk" />
            <div className="p-6">
              <p className="text-xl font-bold">Bleu DK</p>
              <p className="mt-1 font-mono text-sm text-dk/70">HEX #0B3C8C · RVB 11 60 140 · CMJN 92 57 0 45</p>
              <p className="mt-2 text-sm text-dk/65">Textes, boutons, fonds de marque, icônes.</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-dk/12">
            <div className="h-44 border-b border-dk/12 bg-blanc" />
            <div className="p-6">
              <p className="text-xl font-bold">Blanc</p>
              <p className="mt-1 font-mono text-sm text-dk/70">HEX #FFFFFF · RVB 255 255 255 · CMJN 0 0 0 0</p>
              <p className="mt-2 text-sm text-dk/65">Fonds, textes sur bleu, respiration.</p>
            </div>
          </div>
        </div>
        <div className="mt-5 flex overflow-hidden rounded-2xl border border-dk/12">
          {[100, 80, 60, 40, 20, 10, 5].map((o) => (
            <div key={o} className="flex-1">
              <div className="h-16" style={{ background: `color-mix(in srgb, #0B3C8C ${o}%, #FFFFFF)` }} />
              <p className="py-2 text-center text-xs font-medium">{o} %</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-dk/55">Transparences autorisées du bleu sur blanc : textes secondaires (60–80 %), bordures (10–25 %), fonds légers (5 %).</p>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">Typographie : Outfit</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-[2rem] border border-dk/12 p-8">
            <p className="text-6xl font-extrabold tracking-tight">Aa</p>
            <p className="mt-4 text-3xl font-bold tracking-tight">La bonne terre, au bon prix.</p>
            <p className="mt-3 text-dk/70">Titres en ExtraBold (800) et Bold (700), interlettrage serré.</p>
          </div>
          <div className="rounded-[2rem] border border-dk/12 p-8">
            <p className="text-6xl font-normal">Aa</p>
            <p className="mt-4 text-lg">Champ maraîcher de 2 ha avec forage, sol dior, à 800 m de la route.</p>
            <p className="mt-3 text-dk/70">Textes en Regular (400) et Medium (500), 16 px minimum sur mobile.</p>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">Illustrations « plan »</h2>
        <p className="mt-2 text-dk/70">Quand une annonce n&apos;a pas encore de photo, un plan au trait blanc sur fond bleu la remplace.</p>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          {(["terrain", "champ", "maison", "appartement", "local"] as const).map((c) => (
            <div key={c} className="aspect-[4/3] overflow-hidden rounded-2xl"><IllustrationBien categorie={c} graine={c} /></div>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-5 md:grid-cols-2">
        <div className="rounded-[2rem] border border-dk/12 p-8">
          <h3 className="font-bold">À faire</h3>
          <ul className="mt-3 space-y-2 text-dk/75">
            <li>Logo bleu sur fond blanc, ou blanc sur fond bleu</li>
            <li>Taille minimale du symbole : 24 px à l&apos;écran, 10 mm à l&apos;impression</li>
            <li>Boutons pleins bleus pour l&apos;action principale, contour pour le reste</li>
          </ul>
        </div>
        <div className="rounded-[2rem] border border-dashed border-dk/30 p-8">
          <h3 className="font-bold">À éviter</h3>
          <ul className="mt-3 space-y-2 text-dk/75">
            <li>Toute troisième couleur, dégradé ou ombre colorée</li>
            <li>Déformer, pivoter ou recolorer le logo</li>
            <li>Poser le logo sur une photo chargée</li>
          </ul>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">Fichiers</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="/brand/dk-mark.svg" download className="btn-plein">Symbole bleu (SVG)</a>
          <a href="/brand/dk-mark-inverse.svg" download className="btn-contour">Symbole blanc (SVG)</a>
          <a href="/brand/dk-mark-512.png" download className="btn-contour">Symbole 512 px (PNG)</a>
        </div>
      </section>
    </div>
  );
}
