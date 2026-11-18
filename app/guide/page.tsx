import type { Metadata } from "next";
import Link from "next/link";
import {
  IconeBouclier, IconeCalendrier, IconeCamera, IconeDocument, IconeMessage, IconePin, IconeRecherche, IconeUtilisateur,
} from "@/components/Icones";
import { Visuel } from "@/components/Visuel";
import { photo } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Guide d'utilisation",
  description: "Comment rechercher, contacter, acheter, vendre et louer en toute sécurité sur DK IMMOBILIER.",
};

const SOMMAIRE = [
  ["premiers-pas", "Premiers pas"],
  ["rechercher", "Rechercher un bien"],
  ["contacter", "Contacter et visiter"],
  ["acheter", "Acheter en sécurité"],
  ["documents", "Les documents fonciers"],
  ["vendre", "Vendre ou louer"],
  ["verification", "Le badge « Bien vérifié »"],
  ["arnaques", "Éviter les arnaques"],
  ["faq", "Questions fréquentes"],
];

function Section({ id, numero, titre, intro, children }: { id: string; numero: number; titre: string; intro: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-dk/10 pt-12 first:border-0 first:pt-0">
      <p className="text-sm font-semibold text-dk/45">{String(numero).padStart(2, "0")}</p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">{titre}</h2>
      <p className="mt-3 max-w-2xl text-[17px] text-dk/70">{intro}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Etapes({ etapes }: { etapes: [React.ComponentType<{ className?: string }>, string, string][] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2">
      {etapes.map(([Icone, t, d], i) => (
        <li key={t} className="rounded-2xl border border-dk/12 p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-dk text-blanc"><Icone className="size-5" /></span>
            <span className="text-sm font-semibold text-dk/45">Étape {i + 1}</span>
          </div>
          <p className="mt-4 font-semibold">{t}</p>
          <p className="mt-1 text-sm leading-relaxed text-dk/70">{d}</p>
        </li>
      ))}
    </ol>
  );
}

function Liste({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-dk/80">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-dk text-[11px] text-blanc">✓</span>
          {t}
        </li>
      ))}
    </ul>
  );
}

const FAQ: [string, string][] = [
  ["Faut-il un compte pour consulter les annonces ?", "Non. La recherche, la carte et les fiches sont accessibles à tous. Un compte est nécessaire pour contacter un vendeur, demander une visite ou publier."],
  ["Comment créer un compte ?", "Cliquez sur « Se connecter », saisissez votre numéro sénégalais (+221) et recevez un code par SMS. Vous pouvez aussi utiliser votre adresse e-mail. Aucun mot de passe à retenir."],
  ["Combien coûte la publication ?", "Les particuliers publient gratuitement jusqu'à 3 annonces. Des options payantes (mise en avant, vérification express) et des abonnements pour les agences sont proposés."],
  ["Combien de temps avant que mon annonce soit en ligne ?", "Chaque annonce est relue par notre équipe, en général sous 24 heures. Vous êtes prévenu dès sa publication ou si une correction est nécessaire."],
  ["Puis-je modifier mon annonce ?", "Oui, depuis « Mon espace ». Si vous changez le prix, la surface ou la description d'une annonce publiée, elle repasse en modération et le badge éventuel est retiré jusqu'au nouveau contrôle."],
  ["Mes documents sont-ils visibles par les acheteurs ?", "Non. Les documents fonciers que vous déposez sont privés : seuls vous et nos vérificateurs y ont accès."],
  ["DK IMMOBILIER intervient-il dans la vente ?", "Non. DK IMMOBILIER met en relation acheteurs et vendeurs et contrôle les annonces. La vente se conclut entre les parties, devant un notaire."],
  ["Je vis à l'étranger : comment faire ?", "Privilégiez les biens vérifiés, demandez une visite vidéo par la messagerie, mandatez une personne de confiance ou un notaire sur place, et ne versez jamais d'argent hors du cadre notarial."],
];

export default function PageGuide() {
  return (
    <>
      {/* En-tête */}
      <section className="relative isolate overflow-hidden bg-dk text-blanc">
        <div className="absolute inset-0 -z-10 opacity-70"><Visuel photo={photo("guide")} scene="ville" graine={2} /></div>
        <div className="absolute inset-0 -z-10 bg-dk/60" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <nav className="text-sm text-blanc/70"><Link href="/" className="hover:text-blanc">Accueil</Link> › Guide d&apos;utilisation</nav>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">Guide d&apos;utilisation</h1>
          <p className="mt-5 max-w-2xl text-lg text-blanc/85">
            Tout ce qu&apos;il faut savoir pour chercher, acheter, vendre ou louer un terrain, un champ ou une maison sur DK IMMOBILIER, en toute sécurité.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#acheter" className="btn-blanc">Je veux acheter</a>
            <a href="#vendre" className="btn border border-blanc/40 text-blanc hover:bg-blanc/10">Je veux vendre</a>
            <a href="#arnaques" className="btn border border-blanc/40 text-blanc hover:bg-blanc/10">Éviter les arnaques</a>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Sommaire */}
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dk/45">Sommaire</p>
          <ol className="mt-3 space-y-1 border-l border-dk/12">
            {SOMMAIRE.map(([id, t], i) => (
              <li key={id}>
                <a href={`#${id}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-[15px] text-dk/70 transition hover:border-dk hover:text-dk">
                  <span className="mr-2 text-dk/40">{i + 1}.</span>{t}
                </a>
              </li>
            ))}
          </ol>
          <div className="mt-8 hidden rounded-2xl bg-dk p-5 text-blanc lg:block">
            <p className="font-semibold">Besoin d&apos;aide ?</p>
            <p className="mt-1 text-sm text-blanc/75">Notre équipe répond par e-mail du lundi au samedi.</p>
            <a href="mailto:contact@dkimmobilier.sn" className="btn-blanc mt-4 w-full py-2 text-sm">Nous écrire</a>
          </div>
        </aside>

        <article className="space-y-16">
          <Section id="premiers-pas" numero={1} titre="Premiers pas" intro="La consultation est libre. Un compte gratuit vous permet de contacter les vendeurs, d'enregistrer vos favoris et de publier vos propres annonces.">
            <Etapes etapes={[
              [IconeUtilisateur, "Créez votre compte", "Cliquez sur « Se connecter », saisissez votre numéro (+221) ou votre e-mail, puis le code reçu par SMS. Indiquez votre nom à la première connexion."],
              [IconeBouclier, "Vérifiez votre identité", "Pour publier, envoyez une photo de votre carte d'identité ou passeport et un selfie depuis « Mon espace ». Cela protège tous les utilisateurs."],
            ]} />
          </Section>

          <Section id="rechercher" numero={2} titre="Rechercher un bien" intro="Depuis l'accueil ou la page Annonces, combinez les filtres : les résultats se mettent à jour instantanément, en liste et sur la carte.">
            <div className="grid gap-6 md:grid-cols-2">
              <Liste items={[
                "Choisissez Acheter, Louer ou Bail, puis le type de bien.",
                "Tapez une ville, une commune ou un quartier : des suggestions apparaissent.",
                "Fixez un prix maximum et une surface minimale (1 ha = 10 000 m²).",
                "Dans « Plus de filtres », choisissez la région, le statut juridique ou les biens vérifiés uniquement.",
              ]} />
              <Liste items={[
                "Survolez une annonce pour la repérer sur la carte, et inversement.",
                "Sur mobile, le bouton « Carte » en bas de l'écran bascule l'affichage.",
                "Touchez le cœur pour enregistrer une annonce dans vos favoris.",
                "« Enregistrer la recherche » vous permet de la relancer en un clic.",
              ]} />
            </div>
          </Section>

          <Section id="contacter" numero={3} titre="Contacter et visiter" intro="Les échanges passent par la messagerie DK IMMOBILIER : votre numéro reste privé tant que vous ne choisissez pas de le partager.">
            <Etapes etapes={[
              [IconeMessage, "Envoyez un message", "Sur la fiche, utilisez « Envoyer un message ». Posez vos questions : documents disponibles, bornage, accès à l'eau, prix."],
              [IconeCalendrier, "Demandez une visite", "Proposez une date et une heure. Le vendeur confirme ou propose un autre créneau dans votre messagerie."],
              [IconePin, "Visitez sur place", "Vérifiez l'accès, le voisinage et les bornes. Pour un champ, demandez à voir le point d'eau et la limite des parcelles."],
              [IconeCamera, "À distance", "Depuis l'étranger, demandez une visite vidéo et faites-vous représenter par une personne de confiance."],
            ]} />
          </Section>

          <Section id="acheter" numero={4} titre="Acheter en sécurité" intro="Un achat foncier se prépare. Suivez ces étapes, dans cet ordre, avant de verser la moindre somme.">
            <ol className="relative space-y-6 border-l-2 border-dk/15 pl-8">
              {[
                ["Demandez les documents", "Titre foncier, bail ou délibération, plan de situation et pièce d'identité du vendeur. Comparez les noms et les surfaces."],
                ["Faites vérifier par un notaire", "Le notaire consulte les registres (conservation foncière, cadastre ou commune selon le statut) et confirme que le vendeur est bien le titulaire du droit."],
                ["Contrôlez le terrain", "Un géomètre agréé vérifie les bornes et la superficie réelle. C'est essentiel pour un champ ou une grande parcelle."],
                ["Signez devant le notaire", "L'acte est signé chez le notaire, qui reçoit les fonds et accomplit les formalités d'enregistrement et de mutation."],
                ["Conservez vos preuves", "Gardez l'acte, les reçus et les échanges. Signalez sur DK IMMOBILIER toute anomalie constatée."],
              ].map(([t, d], i) => (
                <li key={t} className="relative">
                  <span className="absolute -left-[45px] flex size-8 items-center justify-center rounded-full bg-dk text-sm font-bold text-blanc ring-4 ring-blanc">{i + 1}</span>
                  <p className="font-semibold">{t}</p>
                  <p className="mt-1 text-dk/70">{d}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="documents" numero={5} titre="Comprendre les documents fonciers" intro="Au Sénégal, un terrain peut relever de statuts très différents. Le statut est indiqué sur chaque annonce : voici à quoi il correspond.">
            <div className="overflow-hidden rounded-[var(--radius-dk)] border border-dk/12">
              <table className="w-full text-left text-[15px]">
                <thead className="bg-dk text-blanc">
                  <tr><th className="px-5 py-3 font-semibold">Statut</th><th className="px-5 py-3 font-semibold">Ce que c&apos;est</th><th className="hidden px-5 py-3 font-semibold md:table-cell">Points de vigilance</th></tr>
                </thead>
                <tbody className="divide-y divide-dk/10">
                  {[
                    ["Titre foncier", "Droit de propriété définitif, inscrit au Livre foncier et identifié par un numéro.", "Demandez un état des droits réels récent pour vérifier l'absence d'hypothèque ou de litige."],
                    ["Bail", "Droit d'occuper un terrain de l'État pour une durée fixée, souvent avec obligation de mise en valeur.", "Vérifiez la durée restante, les conditions et la possibilité de transformation en titre foncier."],
                    ["Délibération", "Affectation d'une terre du domaine national par le conseil municipal : c'est un droit d'usage, pas une propriété.", "Le transfert doit passer par la commune. Vérifiez la délibération et la mise en valeur exigée."],
                    ["Acte de cession", "Document de transfert établi entre particuliers.", "Statut fragile : faites remonter l'origine du droit avec un notaire avant tout engagement."],
                  ].map(([s, d, v]) => (
                    <tr key={s} className="align-top">
                      <td className="px-5 py-4 font-semibold">{s}</td>
                      <td className="px-5 py-4 text-dk/75">{d}<span className="mt-2 block text-sm text-dk/60 md:hidden">{v}</span></td>
                      <td className="hidden px-5 py-4 text-dk/65 md:table-cell">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-dk/55">Ces explications sont générales. Seul un notaire ou un professionnel du droit peut se prononcer sur un bien précis.</p>
          </Section>

          <Section id="vendre" numero={6} titre="Vendre ou louer votre bien" intro="Une annonce complète et vérifiée reçoit nettement plus de demandes sérieuses. Comptez environ 5 minutes.">
            <Etapes etapes={[
              [IconeDocument, "Décrivez le bien", "« Déposer une annonce » : type, transaction, titre clair (ex. « Champ de 2 ha avec forage à Mboro »), description honnête."],
              [IconePin, "Placez-le sur la carte", "Choisissez la commune puis déplacez le repère à l'emplacement exact. Les acheteurs filtrent beaucoup par zone."],
              [IconeCamera, "Ajoutez des photos", "Jusqu'à 15 photos, de jour, sous plusieurs angles : accès, bornes, point d'eau, façade, pièces principales."],
              [IconeBouclier, "Déposez vos documents", "En privé, pour obtenir le badge « Bien vérifié ». Votre annonce est ensuite relue sous 24 h."],
            ]} />
            <div className="mt-6 rounded-2xl bg-dk/[0.04] p-6">
              <p className="font-semibold">Conseils pour un bon prix</p>
              <p className="mt-1 text-dk/70">Consultez les annonces similaires de votre zone : chaque fiche affiche le prix au m² comparé à la moyenne du secteur. Indiquez « négociable » si vous êtes ouvert à la discussion.</p>
            </div>
          </Section>

          <Section id="verification" numero={7} titre="Le badge « Bien vérifié »" intro="Le badge signale qu'une annonce a passé un contrôle documentaire par notre équipe. Il est daté et valable 6 mois.">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-dk/12 p-6">
                <p className="font-semibold">Ce que nous contrôlons</p>
                <div className="mt-4"><Liste items={["Identité du vendeur et cohérence avec le document", "Type et numéro du document foncier", "Superficie et localisation déclarées", "Absence de doublon ou de signalement"]} /></div>
              </div>
              <div className="plan-grid rounded-2xl border border-dashed border-dk/30 p-6">
                <p className="font-semibold">Ce que le badge ne remplace pas</p>
                <p className="mt-3 text-dk/70">La vérification ne vaut pas acte authentique. L&apos;intervention d&apos;un notaire et, si besoin, d&apos;un géomètre reste indispensable pour toute vente.</p>
              </div>
            </div>
          </Section>

          <Section id="arnaques" numero={8} titre="Éviter les arnaques" intro="La plupart des fraudes suivent les mêmes schémas. Méfiez-vous si vous reconnaissez l'un de ces signaux.">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Un prix très en dessous du marché", "Comparez avec le prix moyen du secteur affiché sur la fiche."],
                ["Une demande d'acompte avant visite", "Ne payez jamais pour « réserver » un bien que vous n'avez pas vu."],
                ["Un vendeur pressé ou injoignable", "Un vendeur sérieux accepte la visite et le passage chez le notaire."],
                ["Des documents refusés ou flous", "Sans document vérifiable, ne vous engagez pas."],
                ["Un paiement hors notaire", "Transfert d'argent à un tiers, espèces, mobile money vers un inconnu : refusez."],
                ["Le même bien proposé par plusieurs personnes", "Signe classique de double vente : signalez l'annonce."],
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl border border-dk/12 p-5">
                  <p className="font-semibold">⚠ {t}</p>
                  <p className="mt-1 text-sm text-dk/70">{d}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-dk p-6 text-blanc">
              <p className="max-w-xl">Un doute ? Utilisez le lien « Signalez-la » sur la fiche de l&apos;annonce. Notre équipe examine chaque signalement.</p>
              <Link href="/annonces" className="btn-blanc">Retour aux annonces</Link>
            </div>
          </Section>

          <Section id="faq" numero={9} titre="Questions fréquentes" intro="Vous ne trouvez pas votre réponse ? Écrivez-nous à contact@dkimmobilier.sn.">
            <div className="divide-y divide-dk/10 border-y border-dk/10">
              {FAQ.map(([q, r]) => (
                <details key={q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold">
                    {q}
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-dk/20 transition group-open:rotate-45 group-open:bg-dk group-open:text-blanc">+</span>
                  </summary>
                  <p className="mt-3 max-w-3xl text-dk/70">{r}</p>
                </details>
              ))}
            </div>
          </Section>

          <div className="flex flex-wrap gap-3">
            <Link href="/annonces" className="btn-plein"><IconeRecherche className="size-4" /> Rechercher un bien</Link>
            <Link href="/publier" className="btn-contour">Déposer une annonce</Link>
          </div>
        </article>
      </div>
    </>
  );
}
