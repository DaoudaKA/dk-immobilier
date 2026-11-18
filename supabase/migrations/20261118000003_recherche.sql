-- =============================================================
-- DK IMMOBILIER — Recherche (plein texte + filtres + géographie)
-- =============================================================

create or replace view public.annonces_publiques
with (security_invoker = true) as
select
  a.id, a.reference, a.titre, a.description, a.prix_xof, a.negociable, a.superficie_m2,
  a.type_transaction, a.statut_juridique, a.statut, a.verifiee, a.a_la_une, a.quartier,
  a.caracteristiques, a.publiee_le, a.vues, a.vendeur_id,
  c.code  as categorie,
  c.libelle as categorie_libelle,
  co.nom  as commune,
  d.nom   as departement,
  r.nom   as region,
  extensions.st_y(a.point::extensions.geometry) as lat,
  extensions.st_x(a.point::extensions.geometry) as lng,
  case when a.contour is null then null
       else extensions.st_asgeojson(a.contour::extensions.geometry)::jsonb end as contour,
  (select coalesce(jsonb_agg(m.chemin order by m.ordre), '[]'::jsonb)
     from public.medias m where m.annonce_id = a.id and m.type = 'image') as photos
from public.annonces a
join public.categories   c  on c.id  = a.categorie_id
join public.communes     co on co.id = a.commune_id
join public.departements d  on d.id  = co.departement_id
join public.regions      r  on r.id  = d.region_id
where a.statut = 'publiee';

grant select on public.annonces_publiques to anon, authenticated;

-- Recherche principale appelée par l'application (supabase.rpc('rechercher_annonces', {...}))
create or replace function public.rechercher_annonces(
  q                text    default null,
  p_categorie      text    default null,
  p_transaction    public.type_transaction default null,
  p_region         text    default null,
  prix_min         bigint  default null,
  prix_max         bigint  default null,
  surface_min      numeric default null,
  verifiees        boolean default false,
  p_juridique      public.statut_juridique default null,
  p_lat            double precision default null,
  p_lng            double precision default null,
  rayon_km         double precision default null,
  tri              text    default 'recent',   -- recent | prix_asc | prix_desc | surface
  p_limite         int     default 24,
  p_decalage       int     default 0
)
returns setof public.annonces_publiques
language sql stable as $$
  select ap.*
  from public.annonces_publiques ap
  join public.annonces a on a.id = ap.id
  where (q is null or q = '' or a.recherche @@ websearch_to_tsquery('french', q) or ap.titre ilike '%' || q || '%' or ap.commune ilike '%' || q || '%')
    and (p_categorie   is null or ap.categorie = p_categorie)
    and (p_transaction is null or ap.type_transaction = p_transaction)
    and (p_region      is null or ap.region = p_region)
    and (prix_min      is null or ap.prix_xof >= prix_min)
    and (prix_max      is null or ap.prix_xof <= prix_max)
    and (surface_min   is null or ap.superficie_m2 >= surface_min)
    and (not verifiees or ap.verifiee)
    and (p_juridique is null or ap.statut_juridique = p_juridique)
    and (rayon_km is null or p_lat is null or p_lng is null or
         extensions.st_dwithin(a.point, extensions.st_makepoint(p_lng, p_lat)::extensions.geography, rayon_km * 1000))
  order by
    ap.a_la_une desc,
    case when tri = 'prix_asc'  then ap.prix_xof end asc,
    case when tri = 'prix_desc' then ap.prix_xof end desc,
    case when tri = 'surface'   then ap.superficie_m2 end desc,
    ap.publiee_le desc nulls last
  limit least(p_limite, 100) offset p_decalage;
$$;

grant execute on function public.rechercher_annonces to anon, authenticated;

-- Compteur de vues (appelé depuis la fiche annonce)
create or replace function public.incrementer_vues(p_annonce uuid) returns void
language sql security definer set search_path = public as $$
  update public.annonces set vues = vues + 1 where id = p_annonce and statut = 'publiee';
$$;
grant execute on function public.incrementer_vues to anon, authenticated;

-- Création d'une annonce avec coordonnées (évite d'envoyer du WKT depuis le client)
create or replace function public.creer_annonce(
  p_categorie text, p_commune_id int, p_transaction public.type_transaction,
  p_titre text, p_description text, p_prix bigint, p_negociable boolean,
  p_superficie numeric, p_statut_juridique public.statut_juridique,
  p_quartier text, p_lat double precision, p_lng double precision,
  p_caracteristiques jsonb default '{}'::jsonb, p_brouillon boolean default false
) returns uuid
language plpgsql security invoker set search_path = public, extensions as $$
declare
  v_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Connexion requise';
  end if;
  insert into public.annonces (vendeur_id, categorie_id, commune_id, type_transaction, titre, description,
                               prix_xof, negociable, superficie_m2, statut_juridique, quartier, point,
                               caracteristiques, statut)
  values (auth.uid(), (select id from public.categories where code = p_categorie), p_commune_id, p_transaction,
          p_titre, p_description, p_prix, p_negociable, p_superficie, p_statut_juridique, p_quartier,
          st_makepoint(p_lng, p_lat)::geography, p_caracteristiques,
          case when p_brouillon then 'brouillon'::statut_annonce else 'en_attente'::statut_annonce end)
  returning id into v_id;
  return v_id;
end $$;
grant execute on function public.creer_annonce to authenticated;
