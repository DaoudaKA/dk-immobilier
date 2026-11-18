# DK IMMOBILIER

Plateforme de vente, d'achat et de location de **terrains, champs et biens immobiliers** au Sénégal.

- **Front + API** : Next.js 16 (App Router, TypeScript), Tailwind CSS 4
- **Base de données** : PostgreSQL + PostGIS via **Supabase** (auth par SMS/e-mail, stockage des photos et documents, sécurité RLS)
- **Cartes** : Leaflet + OpenStreetMap, en monochrome bleu
- **Charte** : deux couleurs uniquement, bleu DK `#0B3C8C` et blanc `#FFFFFF`, police Outfit

## Démarrer en 2 minutes (mode démonstration)

```bash
npm install
npm run dev
```

Ouvrez http://localhost:3000. Sans clés Supabase, le site tourne avec 12 annonces fictives : vous pouvez tout parcourir (accueil, recherche, carte, fiche, formulaire de publication, compte, administration, charte).

## Ajouter vos photos

Déposez vos photos dans `public/photos/` (voir `LISEZ-MOI.txt` pour les noms : `accueil.jpg`, `dakar.jpg`, `niayes.jpg`…).
Elles s'affichent automatiquement en bichromie bleu/blanc. En production, relancez `npm run build` après l'ajout.

## Passer en production avec Supabase

1. Créez un projet sur https://supabase.com (région la plus proche : Europe Ouest).
2. Dans **SQL Editor**, exécutez dans l'ordre :
   - `supabase/migrations/20261118000001_schema.sql` (tables, PostGIS, triggers)
   - `supabase/migrations/20261118000002_securite.sql` (RLS, buckets de stockage)
   - `supabase/migrations/20261118000003_recherche.sql` (recherche, vues, fonctions)
   - `supabase/seed.sql` (régions, départements, communes, catégories)

   Ou avec la CLI : `supabase link` puis `supabase db push` et `supabase db seed`.
3. **Authentication > Providers** : activez *Phone* (fournisseur SMS : Twilio, MessageBird, Vonage…) et/ou *Email*.
   Ajoutez `http://localhost:3000/auth/callback` et votre domaine dans *URL Configuration*.
4. Copiez `.env.example` en `.env.local` et renseignez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Inscrivez-vous sur le site, puis donnez-vous le rôle administrateur :
   ```sql
   update public.profils set role = 'admin' where telephone = '+22177XXXXXXX';
   ```
   La page **/admin** devient accessible (modération, badge « Bien vérifié », signalements).

## Déploiement

- **Vercel** : importez le dépôt GitHub, ajoutez les 3 variables d'environnement, déployez.
- La base reste sur Supabase (sauvegardes automatiques).

## Structure

```
app/
  page.tsx                 Accueil (recherche, catégories, annonces, vérification)
  annonces/page.tsx        Recherche avec filtres, vue liste / carte
  annonces/[id]/page.tsx   Fiche annonce (galerie, caractéristiques, carte, contact)
  publier/                 Formulaire en 4 étapes (bien, position sur carte, prix, photos/documents)
  connexion/               Connexion par code SMS ou lien e-mail
  compte/                  Mes annonces, favoris, conversations, visites
  admin/                   Back-office : modération, vérification, signalements
  signaler/[id]/           Signalement d'une annonce suspecte
  guide/                   Guide d'utilisation complet
  favoris/                 Favoris et recherches enregistrées
  charte/                  Charte graphique (logo, couleurs, typographie)
components/                Logo, cartes Leaflet, cartes d'annonce, formulaires, icônes
lib/
  data.ts                  Accès aux données (Supabase ou démo)
  supabase/                Clients navigateur et serveur
  demo-data.ts             Annonces fictives
supabase/
  migrations/              Schéma PostgreSQL complet
  seed.sql                 Référentiel géographique du Sénégal
public/brand/              Logo SVG et PNG
proxy.ts                   Session Supabase + protection des pages privées
```

## Sécurité intégrée

- Row Level Security sur toutes les tables : chacun ne lit et ne modifie que ce qui le concerne.
- Un vendeur ne peut ni publier sans modération, ni s'attribuer le badge, ni changer son rôle (triggers).
- Toute modification du prix ou du texte d'une annonce publiée la renvoie en modération.
- Documents fonciers dans un bucket privé, visibles par le vendeur et l'équipe uniquement.
- Téléphone des vendeurs jamais exposé publiquement (vue `vendeurs`).
- Journal d'audit des décisions de modération.

## Prochaines étapes (v2)

- Paiements Wave / Orange Money via PayDunya, PayTech ou CinetPay (table `paiements` prête)
- Messagerie temps réel (Supabase Realtime sur la table `messages`)
- Alertes sur recherches sauvegardées (table `recherches_sauvegardees` prête)
- Dessin du contour de la parcelle (colonne `contour` prête)
- Application mobile React Native / Expo
"# dk-immobilier" 
