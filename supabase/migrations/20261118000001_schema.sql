-- =============================================================
-- DK IMMOBILIER — Schéma PostgreSQL (Supabase)
-- Terrains, champs et biens immobiliers au Sénégal
-- =============================================================

create extension if not exists postgis with schema extensions;
create extension if not exists pg_trgm with schema extensions;
create extension if not exists unaccent with schema extensions;

-- ---------- Types énumérés ----------
create type public.role_utilisateur as enum ('utilisateur', 'agence', 'moderateur', 'admin');
create type public.statut_kyc       as enum ('non_soumis', 'en_attente', 'valide', 'refuse');
create type public.statut_juridique as enum ('titre_foncier', 'bail', 'deliberation', 'acte_cession', 'autre');
create type public.type_transaction as enum ('vente', 'location', 'bail');
create type public.statut_annonce   as enum ('brouillon', 'en_attente', 'publiee', 'en_pause', 'vendue', 'refusee');
create type public.statut_document  as enum ('en_attente', 'valide', 'refuse');
create type public.statut_visite    as enum ('demandee', 'confirmee', 'annulee', 'effectuee');
create type public.statut_signalement as enum ('ouvert', 'en_cours', 'traite', 'rejete');
create type public.moyen_paiement   as enum ('wave', 'orange_money', 'free_money', 'carte');
create type public.statut_paiement  as enum ('initie', 'reussi', 'echoue', 'rembourse');

-- ---------- Profils (1-1 avec auth.users) ----------
create table public.profils (
  id            uuid primary key references auth.users (id) on delete cascade,
  nom_complet   text not null default '',
  telephone     text unique,
  email         text,
  avatar_url    text,
  localite      text,
  role          public.role_utilisateur not null default 'utilisateur',
  statut_kyc    public.statut_kyc not null default 'non_soumis',
  agence_id     uuid,
  cree_le       timestamptz not null default now(),
  maj_le        timestamptz not null default now()
);

create table public.agences (
  id          uuid primary key default gen_random_uuid(),
  nom         text not null,
  ninea       text unique,
  logo_url    text,
  telephone   text,
  adresse     text,
  description text,
  cree_le     timestamptz not null default now()
);

alter table public.profils
  add constraint profils_agence_fk foreign key (agence_id) references public.agences (id) on delete set null;

-- ---------- Référentiel géographique ----------
create table public.regions (
  id   smallserial primary key,
  nom  text not null unique
);

create table public.departements (
  id         smallserial primary key,
  region_id  smallint not null references public.regions (id),
  nom        text not null,
  unique (region_id, nom)
);

create table public.communes (
  id               serial primary key,
  departement_id   smallint not null references public.departements (id),
  nom              text not null,
  centre           extensions.geography(Point, 4326),
  unique (departement_id, nom)
);

-- ---------- Catégories ----------
create table public.categories (
  id       smallserial primary key,
  code     text not null unique,     -- terrain, champ, maison, appartement, local
  libelle  text not null,
  ordre    smallint not null default 0
);

-- ---------- Annonces ----------
create table public.annonces (
  id                uuid primary key default gen_random_uuid(),
  reference         text not null unique default ('DK-' || upper(substr(md5(random()::text), 1, 6))),
  vendeur_id        uuid not null references public.profils (id) on delete cascade,
  categorie_id      smallint not null references public.categories (id),
  commune_id        int not null references public.communes (id),
  type_transaction  public.type_transaction not null,
  titre             text not null check (char_length(titre) between 8 and 120),
  description       text not null default '',
  prix_xof          bigint not null check (prix_xof > 0),
  negociable        boolean not null default true,
  superficie_m2     numeric(14, 2) not null check (superficie_m2 > 0),
  statut_juridique  public.statut_juridique not null,
  quartier          text,
  point             extensions.geography(Point, 4326) not null,
  contour           extensions.geography(Polygon, 4326),
  -- Champs : eau, sol, clôture, route… / Bâti : pièces, chambres, étage…
  caracteristiques  jsonb not null default '{}'::jsonb,
  statut            public.statut_annonce not null default 'en_attente',
  verifiee          boolean not null default false,
  verifiee_jusquau  date,
  a_la_une          boolean not null default false,
  vues              int not null default 0,
  motif_refus       text,
  recherche         tsvector generated always as (
                      setweight(to_tsvector('french', coalesce(titre, '')), 'A') ||
                      setweight(to_tsvector('french', coalesce(quartier, '')), 'B') ||
                      setweight(to_tsvector('french', coalesce(description, '')), 'C')
                    ) stored,
  publiee_le        timestamptz,
  cree_le           timestamptz not null default now(),
  maj_le            timestamptz not null default now()
);

create index annonces_point_idx    on public.annonces using gist (point);
create index annonces_recherche_idx on public.annonces using gin (recherche);
create index annonces_filtres_idx  on public.annonces (statut, categorie_id, type_transaction, prix_xof);
create index annonces_vendeur_idx  on public.annonces (vendeur_id);
create index annonces_titre_trgm   on public.annonces using gin (titre extensions.gin_trgm_ops);

create table public.medias (
  id          uuid primary key default gen_random_uuid(),
  annonce_id  uuid not null references public.annonces (id) on delete cascade,
  chemin      text not null,            -- chemin dans le bucket « annonces »
  type        text not null default 'image' check (type in ('image', 'video')),
  ordre       smallint not null default 0,
  cree_le     timestamptz not null default now()
);
create index medias_annonce_idx on public.medias (annonce_id, ordre);

-- Documents fonciers privés (bucket « documents », jamais public)
create table public.documents (
  id          uuid primary key default gen_random_uuid(),
  annonce_id  uuid not null references public.annonces (id) on delete cascade,
  type        public.statut_juridique not null,
  chemin      text not null,
  statut      public.statut_document not null default 'en_attente',
  cree_le     timestamptz not null default now()
);

create table public.verifications (
  id               uuid primary key default gen_random_uuid(),
  annonce_id       uuid not null references public.annonces (id) on delete cascade,
  verificateur_id  uuid not null references public.profils (id),
  checklist        jsonb not null default '{}'::jsonb,
  decision         text not null check (decision in ('valide', 'refuse', 'complement')),
  commentaire      text,
  decide_le        timestamptz not null default now()
);

-- ---------- Interactions ----------
create table public.favoris (
  utilisateur_id  uuid not null references public.profils (id) on delete cascade,
  annonce_id      uuid not null references public.annonces (id) on delete cascade,
  cree_le         timestamptz not null default now(),
  primary key (utilisateur_id, annonce_id)
);

create table public.recherches_sauvegardees (
  id              uuid primary key default gen_random_uuid(),
  utilisateur_id  uuid not null references public.profils (id) on delete cascade,
  nom             text not null,
  criteres        jsonb not null,
  alerte_active   boolean not null default true,
  cree_le         timestamptz not null default now()
);

create table public.conversations (
  id           uuid primary key default gen_random_uuid(),
  annonce_id   uuid not null references public.annonces (id) on delete cascade,
  acheteur_id  uuid not null references public.profils (id) on delete cascade,
  vendeur_id   uuid not null references public.profils (id) on delete cascade,
  cree_le      timestamptz not null default now(),
  unique (annonce_id, acheteur_id)
);

create table public.messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.conversations (id) on delete cascade,
  auteur_id        uuid not null references public.profils (id) on delete cascade,
  contenu          text not null check (char_length(contenu) between 1 and 4000),
  lu_le            timestamptz,
  cree_le          timestamptz not null default now()
);
create index messages_conv_idx on public.messages (conversation_id, cree_le);

create table public.visites (
  id           uuid primary key default gen_random_uuid(),
  annonce_id   uuid not null references public.annonces (id) on delete cascade,
  acheteur_id  uuid not null references public.profils (id) on delete cascade,
  creneau      timestamptz not null,
  message      text,
  statut       public.statut_visite not null default 'demandee',
  cree_le      timestamptz not null default now()
);

create table public.signalements (
  id          uuid primary key default gen_random_uuid(),
  annonce_id  uuid not null references public.annonces (id) on delete cascade,
  auteur_id   uuid references public.profils (id) on delete set null,
  motif       text not null,
  details     text,
  statut      public.statut_signalement not null default 'ouvert',
  cree_le     timestamptz not null default now()
);

-- ---------- Monétisation ----------
create table public.paiements (
  id                    uuid primary key default gen_random_uuid(),
  utilisateur_id        uuid not null references public.profils (id),
  annonce_id            uuid references public.annonces (id) on delete set null,
  objet                 text not null,  -- abonnement_pro, mise_en_avant, verification_express
  montant_xof           bigint not null check (montant_xof > 0),
  moyen                 public.moyen_paiement not null,
  reference_agregateur  text unique,
  statut                public.statut_paiement not null default 'initie',
  cree_le               timestamptz not null default now()
);

-- ---------- Journal d'audit ----------
create table public.journal_audit (
  id         bigserial primary key,
  acteur_id  uuid references public.profils (id),
  action     text not null,
  entite     text not null,
  entite_id  text,
  avant      jsonb,
  apres      jsonb,
  cree_le    timestamptz not null default now()
);

-- ---------- Triggers ----------
create or replace function public.maj_horodatage() returns trigger
language plpgsql as $$
begin
  new.maj_le := now();
  return new;
end $$;

create trigger profils_maj  before update on public.profils  for each row execute function public.maj_horodatage();
create trigger annonces_maj before update on public.annonces for each row execute function public.maj_horodatage();

-- Création automatique du profil à l'inscription
create or replace function public.creer_profil() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profils (id, nom_complet, telephone, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nom_complet', ''), new.phone, new.email);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.creer_profil();

-- Date de publication renseignée au passage à « publiee »
create or replace function public.dater_publication() returns trigger
language plpgsql as $$
begin
  if new.statut = 'publiee' and (old.statut is distinct from 'publiee') then
    new.publiee_le := now();
  end if;
  return new;
end $$;

create trigger annonces_publication before update on public.annonces
  for each row execute function public.dater_publication();

-- Journalisation des décisions de modération
create or replace function public.journaliser_annonce() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if old.statut is distinct from new.statut or old.verifiee is distinct from new.verifiee then
    insert into public.journal_audit (acteur_id, action, entite, entite_id, avant, apres)
    values (auth.uid(), 'moderation', 'annonce', new.id::text,
            jsonb_build_object('statut', old.statut, 'verifiee', old.verifiee),
            jsonb_build_object('statut', new.statut, 'verifiee', new.verifiee));
  end if;
  return new;
end $$;

create trigger annonces_audit after update on public.annonces
  for each row execute function public.journaliser_annonce();
