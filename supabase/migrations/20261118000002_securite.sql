-- =============================================================
-- DK IMMOBILIER — Sécurité : Row Level Security et stockage
-- =============================================================

-- Rôle de l'utilisateur connecté
create or replace function public.est_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profils
    where id = auth.uid() and role in ('moderateur', 'admin')
  );
$$;

-- Un vendeur ne peut pas s'attribuer lui-même le badge, la mise en avant
-- ni publier sans modération.
create or replace function public.proteger_champs_annonce() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- auth.uid() nul = contexte serveur de confiance (SQL editor, service_role)
  if auth.uid() is null or public.est_staff() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.verifiee := false;
    new.a_la_une := false;
    new.statut := case when new.statut = 'brouillon' then 'brouillon' else 'en_attente' end;
  else
    new.verifiee := old.verifiee;
    new.verifiee_jusquau := old.verifiee_jusquau;
    new.a_la_une := old.a_la_une;
    new.motif_refus := old.motif_refus;
    -- Le vendeur peut mettre en pause, marquer vendu ou renvoyer en modération
    if new.statut not in ('brouillon', 'en_attente', 'en_pause', 'vendue') then
      new.statut := old.statut;
    end if;
    -- Toute modification d'une annonce publiée la renvoie en modération
    if old.statut = 'publiee' and new.statut = 'publiee'
       and (new.prix_xof, new.titre, new.description, new.superficie_m2)
           is distinct from (old.prix_xof, old.titre, old.description, old.superficie_m2) then
      new.statut := 'en_attente';
      new.verifiee := false;
    end if;
  end if;
  return new;
end $$;

create trigger annonces_protection before insert or update on public.annonces
  for each row execute function public.proteger_champs_annonce();

-- Un utilisateur ne peut pas changer son propre rôle ni son statut KYC
create or replace function public.proteger_profil() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.est_staff() then
    new.role := old.role;
    new.statut_kyc := old.statut_kyc;
  end if;
  return new;
end $$;

create trigger profils_protection before update on public.profils
  for each row execute function public.proteger_profil();

-- ---------- Activation RLS ----------
alter table public.profils                 enable row level security;
alter table public.agences                 enable row level security;
alter table public.regions                 enable row level security;
alter table public.departements            enable row level security;
alter table public.communes                enable row level security;
alter table public.categories              enable row level security;
alter table public.annonces                enable row level security;
alter table public.medias                  enable row level security;
alter table public.documents               enable row level security;
alter table public.verifications           enable row level security;
alter table public.favoris                 enable row level security;
alter table public.recherches_sauvegardees enable row level security;
alter table public.conversations           enable row level security;
alter table public.messages                enable row level security;
alter table public.visites                 enable row level security;
alter table public.signalements            enable row level security;
alter table public.paiements               enable row level security;
alter table public.journal_audit           enable row level security;

-- Référentiels : lecture publique
create policy "lecture publique" on public.regions      for select using (true);
create policy "lecture publique" on public.departements for select using (true);
create policy "lecture publique" on public.communes     for select using (true);
create policy "lecture publique" on public.categories   for select using (true);
create policy "lecture publique" on public.agences      for select using (true);
create policy "staff gère"       on public.agences      for all using (public.est_staff()) with check (public.est_staff());

-- Profils : complets pour soi et le staff ; le public ne voit que la vue « vendeurs »
create policy "profil lisible par soi" on public.profils for select using (id = auth.uid() or public.est_staff());

create view public.vendeurs as
  select id, nom_complet, avatar_url, localite, (statut_kyc = 'valide') as identite_verifiee, agence_id, cree_le
  from public.profils;
grant select on public.vendeurs to anon, authenticated;
create policy "profil modifiable par soi" on public.profils for update
  using (id = auth.uid() or public.est_staff()) with check (id = auth.uid() or public.est_staff());

-- Annonces
create policy "annonces publiées visibles" on public.annonces for select
  using (statut in ('publiee', 'vendue') or vendeur_id = auth.uid() or public.est_staff());
create policy "vendeur KYC crée" on public.annonces for insert
  with check (vendeur_id = auth.uid());
create policy "vendeur ou staff modifie" on public.annonces for update
  using (vendeur_id = auth.uid() or public.est_staff())
  with check (vendeur_id = auth.uid() or public.est_staff());
create policy "vendeur ou staff supprime" on public.annonces for delete
  using (vendeur_id = auth.uid() or public.est_staff());

-- Médias : suivent la visibilité de l'annonce
create policy "médias visibles" on public.medias for select using (
  exists (select 1 from public.annonces a where a.id = annonce_id)
);
create policy "médias gérés par le vendeur" on public.medias for all using (
  exists (select 1 from public.annonces a where a.id = annonce_id and (a.vendeur_id = auth.uid() or public.est_staff()))
) with check (
  exists (select 1 from public.annonces a where a.id = annonce_id and (a.vendeur_id = auth.uid() or public.est_staff()))
);

-- Documents fonciers : vendeur et staff uniquement
create policy "documents privés" on public.documents for select using (
  public.est_staff() or exists (select 1 from public.annonces a where a.id = annonce_id and a.vendeur_id = auth.uid())
);
create policy "documents déposés par le vendeur" on public.documents for insert with check (
  exists (select 1 from public.annonces a where a.id = annonce_id and a.vendeur_id = auth.uid())
);
create policy "documents validés par le staff" on public.documents for update using (public.est_staff());

-- Vérifications : staff uniquement
create policy "vérifications staff" on public.verifications for all
  using (public.est_staff()) with check (public.est_staff() and verificateur_id = auth.uid());

-- Favoris et recherches : propriétaire uniquement
create policy "mes favoris" on public.favoris for all
  using (utilisateur_id = auth.uid()) with check (utilisateur_id = auth.uid());
create policy "mes recherches" on public.recherches_sauvegardees for all
  using (utilisateur_id = auth.uid()) with check (utilisateur_id = auth.uid());

-- Messagerie : participants uniquement
create policy "mes conversations" on public.conversations for select
  using (auth.uid() in (acheteur_id, vendeur_id) or public.est_staff());
create policy "démarrer une conversation" on public.conversations for insert
  with check (acheteur_id = auth.uid() and acheteur_id <> vendeur_id);

create policy "messages des participants" on public.messages for select using (
  exists (select 1 from public.conversations c
          where c.id = conversation_id and auth.uid() in (c.acheteur_id, c.vendeur_id))
);
create policy "écrire dans ses conversations" on public.messages for insert with check (
  auteur_id = auth.uid() and exists (
    select 1 from public.conversations c
    where c.id = conversation_id and auth.uid() in (c.acheteur_id, c.vendeur_id))
);
create policy "marquer lu" on public.messages for update using (
  exists (select 1 from public.conversations c
          where c.id = conversation_id and auth.uid() in (c.acheteur_id, c.vendeur_id))
);

-- Visites
create policy "visites concernées" on public.visites for select using (
  acheteur_id = auth.uid() or public.est_staff()
  or exists (select 1 from public.annonces a where a.id = annonce_id and a.vendeur_id = auth.uid())
);
create policy "demander une visite" on public.visites for insert with check (acheteur_id = auth.uid());
create policy "répondre à une visite" on public.visites for update using (
  acheteur_id = auth.uid()
  or exists (select 1 from public.annonces a where a.id = annonce_id and a.vendeur_id = auth.uid())
);

-- Signalements : tout le monde peut signaler, le staff traite
create policy "signaler" on public.signalements for insert with check (auteur_id is null or auteur_id = auth.uid());
create policy "staff lit les signalements" on public.signalements for select using (public.est_staff() or auteur_id = auth.uid());
create policy "staff traite" on public.signalements for update using (public.est_staff());

-- Paiements : lecture par le payeur, écriture par le serveur (service_role)
create policy "mes paiements" on public.paiements for select using (utilisateur_id = auth.uid() or public.est_staff());

-- Journal : staff en lecture seule
create policy "journal staff" on public.journal_audit for select using (public.est_staff());

-- ---------- Stockage ----------
insert into storage.buckets (id, name, public)
values ('annonces', 'annonces', true), ('documents', 'documents', false)
on conflict (id) do nothing;

-- Photos : chemin = <uid>/<annonce>/<fichier>
create policy "photos lisibles" on storage.objects for select using (bucket_id = 'annonces');
create policy "photos déposées par leur auteur" on storage.objects for insert
  with check (bucket_id = 'annonces' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "photos supprimées par leur auteur" on storage.objects for delete
  using (bucket_id = 'annonces' and (storage.foldername(name))[1] = auth.uid()::text);

-- Documents fonciers : auteur + staff, jamais publics
create policy "documents lisibles auteur ou staff" on storage.objects for select
  using (bucket_id = 'documents' and ((storage.foldername(name))[1] = auth.uid()::text or public.est_staff()));
create policy "documents déposés par leur auteur" on storage.objects for insert
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
