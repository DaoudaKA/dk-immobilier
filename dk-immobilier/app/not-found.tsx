import Link from "next/link";
import { IllustrationBien } from "@/components/IllustrationBien";

export default function Introuvable() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="mx-auto aspect-[16/10] max-w-md overflow-hidden rounded-[2rem]">
        <IllustrationBien categorie="terrain" graine="404" />
      </div>
      <h1 className="mt-8 text-3xl font-bold">Cette parcelle n&apos;existe pas.</h1>
      <p className="mt-2 text-dk/65">L&apos;annonce a peut-être été vendue ou retirée.</p>
      <Link href="/annonces" className="btn-plein mt-6">Voir les annonces</Link>
    </div>
  );
}
