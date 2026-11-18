# CLAUDE.md — DK IMMOBILIER

Ce fichier donne à Claude (et à tout développeur) le contexte complet du projet : vision, cahier des charges, choix techniques, conventions et état d'avancement. **Le lire avant toute modification.**

---

## 1. Contexte du projet

- **Nom** : DK IMMOBILIER
- **Porteur** : Daouda Ka (Master 2 Informatique, spécialité Business Intelligence, UCAD)
- **Objet** : plateforme web (puis mobile) de vente, d'achat et de location de **terrains, champs agricoles et biens immobiliers** au Sénégal.
- **Zones prioritaires** : Dakar, Thiès et la zone des Niayes (Mboro, Darou Khoudoss, Taïba Ndiaye…), puis tout le pays et la diaspora.
- **Langue** : français (v1) ; wolof et anglais prévus en v2. Tout le code métier, les noms de tables et de variables sont **en français**.
- **Devise** : franc CFA (XOF), montants entiers sans décimales.

### Problème adressé
Les transactions foncières passent par le bouche-à-oreille, WhatsApp et des intermédiaires peu vérifiables. Les acheteurs manquent d'informations fiables sur le statut juridique (titre foncier, bail, délibération), la superficie réelle et la localisation. **Les doubles ventes sont fréquentes.**

### Proposition de valeur
1. Annonces géolocalisées sur carte, avec superficie, prix et statut juridique déclaré.
2. Badge **« Bien vérifié »** après contrôle des documents par l'équipe DK IMMOBILIER.
3. Messagerie interne et demande de visite, sans exposer les numéros de téléphone.
4. Accès simple pour la diaspora (visite à distance, biens vérifiés uniquement).

---

## 2. Commandes

```bash
npm install        # installer les dépendances
npm run dev        # serveur de développement → http://localhost:3000
npm run build      # build de production (doit passer sans erreur avant tout commit)
npm run start      # lancer le build
npm run lint       # vérification TypeScript (tsc --noEmit)
```

**Mode démonstration** : sans `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans `.env.local`, l'application tourne avec 12 annonces fictives (`lib/demo-data.ts`). Toute nouvelle fonctionnalité doit **continuer de fonctionner en mode démo** (vérifier `supabaseActif`).

---

## 3. Stack technique

| Couche | Outil | Remarque |
|---|---|---|
| Framework | **Next.js 16** (App Router, React 19, TypeScript strict) | `params` et `searchParams` sont des `Promise` : toujours `await` |
| Styles | **Tailwind CSS 4** (`@theme` dans `app/globals.css`) | Pas de `tailwind.config.js` |
| Police | **Outfit** via `@fontsource-variable/outfit` | Pas de Google Fonts en ligne |
| Base de données | **PostgreSQL + PostGIS** sur **Supabase** | Extensions dans le schéma `extensions` |
| Auth | Supabase Auth : OTP SMS (+221) et lien e-mail | `@supabase/ssr` |
| Stockage | Supabase Storage : bucket `annonces` (public), `documents` (privé) | Chemin `<uid>/<annonce_id>/<fichier>` |
| Cartes | **Leaflet + react-leaflet** + tuiles OpenStreetMap | Chargées côté client uniquement (`components/carte/index.tsx`) |
| Middleware | `proxy.ts` (convention Next 16, remplace `middleware.ts`) | Rafraîchit la session, protège `/publier`, `/compte`, `/admin` |
| Hébergement | Vercel (front) + Supabase (base) | |

**Choix assumé** : le cahier des charges initial proposait NestJS + Prisma. Pour le MVP, on utilise **Next.js seul + Supabase** (plus rapide à livrer pour un développeur seul). Passer à une API NestJS séparée seulement quand une équipe rejoint le projet ou que la charge l'exige. Ne pas ajouter de backend séparé sans en discuter.

---

## 4. Structure du code

```
app/
  layout.tsx               En-tête, pied de page, métadonnées
  globals.css              Charte (couleurs, utilitaires btn-*, .champ, .plan-grid, carte bleue)
  page.tsx                 Accueil (héros, recherche à onglets, régions, sélection, étapes, vérification, FAQ)
  annonces/page.tsx        Recherche (serveur) → components/recherche/Recherche.tsx (client)
  annonces/loading.tsx     Squelette de chargement
  annonces/[id]/page.tsx   Fiche annonce (galerie plein écran, prix comparé, barre de contact mobile)
  guide/page.tsx           Guide d'utilisation (sommaire collant, 9 sections, FAQ)
  favoris/page.tsx         Favoris et recherches enregistrées
  publier/page.tsx         Formulaire de publication (composant client FormulaireAnnonce)
  connexion/page.tsx       Connexion OTP / e-mail
  compte/page.tsx          Tableau de bord vendeur (Server Actions)
  admin/page.tsx           Back-office : modération, badge, signalements (Server Actions)
  signaler/[id]/page.tsx   Signalement
  charte/page.tsx          Charte graphique
  auth/callback/route.ts   Retour du lien e-mail
  auth/deconnexion/route.ts
  manifest.ts, icon.svg    PWA
components/
  Scene.tsx                Paysages SVG bleu/blanc (niayes, cote, ville, fleuve, savane, casamance)
  Visuel.tsx               Photo en bichromie si présente dans public/photos, sinon Scene
  Galerie.tsx              Galerie 1+4 et visionneuse plein écran (clavier ←/→/Échap)
  recherche/Recherche.tsx  Barre de filtres collante, filtres instantanés (URL), puces, panneau « Plus de filtres »
  recherche/Resultats.tsx  Liste + carte synchronisées au survol, « Afficher plus », bascule carte mobile
  EnTete.tsx, NavPrincipale.tsx, MenuMobile.tsx   Barre institutionnelle, menu actif, tiroir mobile
  BoutonFavori.tsx, BoutonPartage.tsx, ListeFavoris.tsx
  Logo.tsx                 Logo (LogoMarque = symbole seul ; Logo = symbole + texte)
  Icones.tsx               Icônes au trait (currentColor)
  IllustrationBien.tsx     Visuel « plan » bleu/blanc quand pas de photo
  AnnonceCard.tsx          Carte d'annonce + BadgeVerifie
  BarreRecherche.tsx, EnTete.tsx, PiedDePage.tsx
  ContactVendeur.tsx       Message, visite, favori, partage (client)
  FormulaireAnnonce.tsx    Publication en 4 étapes (client)
  FormulaireConnexion.tsx  OTP (client)
  carte/                   CarteAnnonces, SelecteurPosition (Leaflet, client)
lib/
  data.ts                  SEUL point d'accès aux données côté serveur (Supabase ou démo)
  supabase/config.ts       supabaseActif, urlPhoto()
  supabase/client.ts       client navigateur
  supabase/server.ts       client serveur (cookies)
  types.ts, format.ts      Types et formatage (prix FCFA, m²/ha, libellés)
  demo-data.ts             Annonces et communes fictives
  favoris.ts               Favoris et recherches enregistrées (localStorage, synchro Supabase)
  photos.ts                Détection des photos déposées dans public/photos
supabase/
  migrations/              Schéma (1), sécurité RLS (2), recherche (3)
  seed.sql                 Catégories, 14 régions, départements, 27 communes
public/brand/              Logo SVG/PNG
public/photos/             Photos du site (accueil.jpg, guide.jpg, dakar.jpg…) — voir LISEZ-MOI.txt
```

---

## 5. Charte graphique (règles strictes)

- **Deux couleurs uniquement** : bleu DK `#0B3C8C` (`dk`) et blanc `#FFFFFF` (`blanc`).
- Les nuances sont des **opacités du bleu** : `text-dk/60`, `border-dk/15`, `bg-dk/5`. **Jamais** de gris, de vert, de rouge, de dégradé ni d'ombre colorée autre que bleue. Les messages d'erreur et de succès restent en bleu/blanc.
- Typographie : Outfit — titres en 700/800 avec `tracking-tight`, texte en 400/500.
- Boutons : `btn-plein` (action principale), `btn-contour` (secondaire), `btn-blanc` (sur fond bleu).
- Champs : classe `.champ` ; étiquettes : `.etiquette`.
- Motifs : `.plan-grid` / `.plan-grid-blanc` (quadrillage de plan) et `.bornage` (ligne pointillée du logo).
- Coins arrondis : `rounded-[var(--radius-dk)]` (1,25 rem) ou `rounded-[2rem]` pour les grands blocs.
- **Photos** : les photos de marque (accueil, régions, guide) sont affichées en **bichromie** (classe `.bichromie` : niveaux de gris + bleu en mode « screen »). Sans photo, le composant `Scene` dessine un paysage. Les photos des annonces envoyées par les vendeurs restent en couleur.
- **Inspiration UX** : grands portails immobiliers (recherche à onglets, filtres instantanés, liste et carte synchronisées, galerie plein écran, favoris) et sites de service public (barre institutionnelle, fil d'Ariane, guide avec sommaire, langage clair, mentions de vigilance).
- **Logo** : le D contient une maison (contre-poinçon), le K s'ouvre comme une route, la ligne pointillée évoque le bornage d'une parcelle. Ne jamais le déformer ni le recolorer. Taille minimale du symbole : 24 px.

---

## 6. Base de données (PostgreSQL / Supabase)

### Tables principales
| Table | Rôle |
|---|---|
| `profils` | 1-1 avec `auth.users` (nom, téléphone, rôle, statut KYC) — créé par trigger à l'inscription |
| `agences` | Comptes professionnels (NINEA) |
| `regions`, `departements`, `communes` | Référentiel géographique du Sénégal |
| `categories` | terrain, champ, maison, appartement, local |
| `annonces` | Offre : prix, superficie, statut juridique, `point` (geography), `contour`, `caracteristiques` (JSONB), statut, `verifiee`, `recherche` (tsvector) |
| `medias` | Photos (bucket `annonces`) |
| `documents` | Pièces foncières privées (bucket `documents`) |
| `verifications` | Décisions des vérificateurs (checklist JSONB) |
| `favoris`, `recherches_sauvegardees` | Suivi acheteur |
| `conversations`, `messages` | Messagerie |
| `visites` | Demandes de visite |
| `signalements` | Annonces suspectes |
| `paiements` | Wave, Orange Money, Free Money, carte (prête, non branchée) |
| `journal_audit` | Traçabilité des décisions de modération |

### Vues et fonctions
- `annonces_publiques` : annonces publiées + catégorie, commune, région, `lat`/`lng`, photos.
- `vendeurs` : profil public **sans téléphone**.
- `rechercher_annonces(...)` : plein texte français + filtres + rayon PostGIS (`st_dwithin`) + tri.
- `creer_annonce(...)` : création avec coordonnées (le client n'envoie jamais de WKT).
- `incrementer_vues(id)`.

### Enums
`role_utilisateur` (utilisateur, agence, moderateur, admin) · `statut_kyc` · `statut_juridique` (titre_foncier, bail, deliberation, acte_cession, autre) · `type_transaction` (vente, location, bail) · `statut_annonce` (brouillon, en_attente, publiee, en_pause, vendue, refusee) · `moyen_paiement`.

### Règles de sécurité (à ne jamais affaiblir)
- **RLS activé sur toutes les tables.**
- Trigger `proteger_champs_annonce` : un vendeur ne peut pas mettre `verifiee`, `a_la_une`, ni publier lui-même ; modifier le prix, le titre, la description ou la surface d'une annonce publiée la **renvoie en modération** et retire le badge.
- Trigger `proteger_profil` : un utilisateur ne peut pas changer son rôle ni son statut KYC.
- `auth.uid()` nul = contexte serveur de confiance (SQL editor, service_role).
- Les documents fonciers ne sont lisibles que par leur auteur et le staff (`est_staff()`).
- Le téléphone d'un vendeur n'est jamais exposé publiquement.

### Migrations
Toute évolution du schéma = **nouveau fichier** `supabase/migrations/AAAAMMJJHHMMSS_description.sql`. Ne jamais modifier une migration déjà appliquée en production. Tester avec un PostgreSQL 16 + PostGIS local avant de livrer.

---

## 7. Conventions de code

- TypeScript strict, pas de `any`.
- Noms métier en français (`annonce`, `vendeur`, `prix_xof`, `superficie_m2`), sans accents dans les identifiants.
- Composants serveur par défaut ; `"use client"` seulement si état, événements ou Leaflet.
- Lecture des données côté serveur **uniquement via `lib/data.ts`** (qui gère aussi le mode démo).
- Écritures : Server Actions (`"use server"`) ou client Supabase navigateur protégé par RLS.
- Formatage : toujours `formatPrix`, `formatSurface`, `formatDate` de `lib/format.ts` (≥ 10 000 m² affiché en hectares).
- Textes d'interface : phrases courtes, vouvoiement, français correct (« FCFA », espaces insécables gérés par `format.ts`).
- Mobile d'abord : tester à 360 px de large, connexions 3G.
- Avant de terminer une tâche : `npm run build` doit passer.

---

## 8. Cahier des charges (résumé de référence)

### 8.1 Objectifs à 12 mois après lancement
- 2 000 annonces actives, dont au moins 30 % vérifiées
- 10 000 utilisateurs inscrits
- Temps moyen de réponse d'un vendeur < 24 h
- Zéro litige de double vente sur les biens badgés

### 8.2 Types de biens
| Catégorie | Exemples | Transactions |
|---|---|---|
| Terrains | Terrain à bâtir, parcelle viabilisée, lotissement | Vente |
| Champs / terres agricoles | Maraîchage, verger, terre irrigable, pâturage | Vente, location, bail |
| Biens bâtis | Maison, villa, appartement, immeuble | Vente, location |
| Locaux professionnels | Bureau, magasin, entrepôt | Vente, location |

**Hors périmètre v1** : signature électronique d'actes notariés, crédit immobilier intégré, séquestre du prix de vente.

### 8.3 Acteurs et rôles
| Rôle | Droits principaux |
|---|---|
| Visiteur | Consulter annonces, carte, prix |
| Acheteur / locataire (OTP) | Favoris, alertes, messagerie, visite, offre |
| Vendeur particulier | Jusqu'à 3 annonces gratuites, dépôt de documents |
| Agence / promoteur (NINEA) | Annonces illimitées selon abonnement, vitrine, équipe |
| Modérateur / vérificateur | Valider annonces et documents, badge, signalements |
| Administrateur | Tout paramétrer |

### 8.4 Fonctionnalités (P1 = MVP, P2 = v2, P3 = évolutions)
**Compte** — P1 : connexion par téléphone + OTP ou e-mail ; profil ; KYC (CNI/passeport + selfie) obligatoire pour publier. P2 : Google / Apple.

**Publication** — P1 : formulaire guidé par catégorie (titre, description, prix XOF, négociable, superficie m²/ha) ; localisation (région → commune → quartier) + point sur la carte ; statut juridique ; jusqu'à 15 photos + 1 vidéo ; caractéristiques champs (eau, sol, clôture, route) et bâti (pièces, chambres, étage, état) ; documents privés ; brouillon / publication / pause / vendu. P2 : mise en avant payante, dessin du contour de la parcelle.

**Recherche** — P1 : plein texte + filtres (catégorie, transaction, prix, surface, région, statut juridique, « vérifiés uniquement ») ; vue liste et carte ; fiche complète ; favoris ; partage WhatsApp. P2 : alertes sur recherches sauvegardées, recherche par rayon. P3 : estimation du prix au m² par zone.

**Mise en relation** — P1 : messagerie interne ; numéro masqué tant que non connecté ; demande de visite avec créneau. P2 : visite vidéo (diaspora), offre d'achat avec suivi.

**Confiance** — P1 : badges « Bien vérifié » et « Vendeur vérifié » ; signalement. P2 : avis après transaction.

**Paiements** — P1 : abonnements pro et options via agrégateur (PayDunya, PayTech ou CinetPay) pour Wave, Orange Money, Free Money, carte ; facture PDF. P3 : acompte sécurisé via partenaire agréé.

**Notifications** — P1 : in-app, push PWA, e-mail ; SMS pour OTP et visite confirmée.

### 8.5 Back-office
Tableau de bord · file de modération avec détection des doublons · vérification foncière (checklist, notes, badge daté, historique) · gestion des utilisateurs et KYC · signalements · référentiels · offres et tarifs · paiements · pages de contenu (FAQ, CGU) · journal d'audit · exports CSV/Excel.

### 8.6 Processus de vérification d'un bien
1. Le vendeur dépose ses documents (titre foncier, bail, délibération, plan, CNI).
2. Le vérificateur contrôle identité, superficie, localisation, numéro de titre.
3. Si besoin : vérification auprès des Domaines / du Cadastre, ou visite d'un agent de terrain.
4. Décision enregistrée ; badge attribué pour **6 mois**, puis revérification.
5. Mention obligatoire : le badge ne remplace pas un acte notarié.

### 8.7 Exigences non fonctionnelles
| Domaine | Exigence |
|---|---|
| Performance | Pages en < 2,5 s en 3G/4G ; images WebP/AVIF |
| Hors connexion | PWA installable, favoris consultables, brouillon sauvegardé localement |
| Disponibilité | 99,5 % ; sauvegarde quotidienne + PITR, restauration testée chaque mois |
| Montée en charge | 50 000 annonces, 1 000 utilisateurs simultanés |
| Accessibilité | WCAG 2.1 AA |
| SEO | Rendu serveur, URL lisibles, sitemap, Open Graph pour WhatsApp |
| Maintenabilité | TypeScript, tests ≥ 70 % sur la logique métier |
| Observabilité | Suivi des erreurs (Sentry), journaux, alertes |

### 8.8 Sécurité et conformité
HTTPS, protection CSRF/XSS, limitation des tentatives OTP, documents chiffrés et liens temporaires signés, RBAC sur chaque accès, détection de fraude (photos en double, prix anormalement bas, contours qui se chevauchent), tests d'intrusion avant lancement. Données personnelles : loi sénégalaise n° 2008-12, déclaration à la CDP. CGU et politique de confidentialité validées par un juriste.

**Question ouverte** : statut juridique de DK IMMOBILIER (simple plateforme d'annonces ou agent immobilier agréé), à trancher avec un juriste avant le lancement.

### 8.9 Planning (MVP ≈ 18 semaines, sprints de 2 semaines)
| Phase | Durée | Contenu |
|---|---|---|
| 0. Cadrage | 2 sem. | Ateliers, parcours, backlog |
| 1. Design UX/UI | 3 sem. | Maquettes, charte |
| 2. Socle technique | 2 sem. | Dépôts, CI/CD, base, auth OTP |
| 3. MVP fonctionnel | 8 sem. | Annonces, carte, recherche, messagerie, visites, back-office |
| 4. Paiements et tests | 2 sem. | Agrégateur, tests de charge et sécurité |
| 5. Pilote | 1 sem. | Dakar, Thiès, Niayes |
| 6. Version 2 | 3–4 mois | Mobile, alertes, offres, avis, langues, visite vidéo |

### 8.10 Modèle économique
Annonces gratuites pour les particuliers (3 max.), abonnements mensuels pour agences et promoteurs, options payantes (mise en avant, vérification express), commission sur les visites accompagnées pour la diaspora.

### 8.11 Critères de recette
Chaque fonctionnalité P1 testée sur un Android d'entrée de gamme en 3G ; temps de chargement conformes ; aucun défaut bloquant ; sauvegarde et restauration démontrées.

---

## 9. État d'avancement

### Fait
- Charte graphique bleu/blanc, logo SVG/PNG, icônes PWA, page `/charte`
- Accueil, recherche avec filtres, vue carte, fiche annonce, annonces similaires
- Publication en 4 étapes (position sur carte, photos, documents privés, brouillon)
- Connexion OTP SMS / e-mail, déconnexion, protection des pages privées
- Mon compte (mes annonces, compteurs, pause / vendu / republier)
- Back-office (modération, publication avec badge 6 mois, refus motivé, signalements)
- Signalement d'annonce, page 404
- Refonte v2 : barre institutionnelle, menu mobile en tiroir, héros avec recherche à onglets et suggestions de lieux, cartes par région
- Recherche instantanée : filtres sans rechargement, puces supprimables, panneau « Plus de filtres » (région, statut juridique, vérifiés), tri, liste/carte synchronisées, « Afficher plus », squelette de chargement
- Fiche : galerie + visionneuse plein écran, partage natif, favori, explication du statut juridique, prix au m² comparé au secteur, conseils de vigilance, barre de contact mobile
- Page Guide d'utilisation complète, page Favoris, brouillon de publication enregistré automatiquement
- Schéma PostgreSQL complet testé (PostGIS, RLS, triggers, recherche géographique, audit)
- Mode démonstration sans base

### À faire (par priorité)
1. Configurer le projet Supabase réel et un fournisseur SMS pour l'OTP
2. Page messagerie (liste des conversations + Supabase Realtime sur `messages`)
3. Gestion des visites côté vendeur (confirmer / annuler)
4. Parcours KYC (dépôt CNI + selfie, validation dans `/admin`)
5. Ajouter les vraies photos de marque dans public/photos
6. Paiements Wave / Orange Money via agrégateur + factures PDF
7. Alertes sur recherches sauvegardées (e-mail / push)
8. Dessin du contour de la parcelle (`contour`) et détection des chevauchements
9. Sitemap, Open Graph image par annonce, pages CGU / confidentialité / FAQ
10. Tests automatisés, Sentry, CI GitHub Actions
11. v2 : application React Native / Expo, wolof et anglais

---

## 10. Points d'attention pour Claude

- Répondre et écrire l'interface **en français**.
- Ne jamais introduire une troisième couleur.
- Ne jamais affaiblir les politiques RLS ni les triggers de protection.
- Conserver le mode démo fonctionnel.
- Ne pas exposer le téléphone des vendeurs ni les documents fonciers.
- Les coordonnées des communes du `seed.sql` sont approximatives (centres-villes).
- Avant de livrer : `npm run build` sans erreur et vérification visuelle (desktop + mobile).
