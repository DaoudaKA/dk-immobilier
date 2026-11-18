-- =============================================================
-- DK IMMOBILIER — Données de référence
-- (coordonnées des communes approximatives : centre-ville)
-- =============================================================

insert into public.categories (code, libelle, ordre) values
  ('terrain',     'Terrain',               1),
  ('champ',       'Champ / terre agricole', 2),
  ('maison',      'Maison / villa',        3),
  ('appartement', 'Appartement',           4),
  ('local',       'Local professionnel',   5)
on conflict (code) do nothing;

insert into public.regions (nom) values
  ('Dakar'), ('Thiès'), ('Diourbel'), ('Fatick'), ('Kaolack'), ('Kaffrine'), ('Kolda'),
  ('Kédougou'), ('Louga'), ('Matam'), ('Saint-Louis'), ('Sédhiou'), ('Tambacounda'), ('Ziguinchor')
on conflict (nom) do nothing;

insert into public.departements (region_id, nom)
select r.id, d.nom from (values
  ('Dakar', 'Dakar'), ('Dakar', 'Pikine'), ('Dakar', 'Guédiawaye'), ('Dakar', 'Rufisque'), ('Dakar', 'Keur Massar'),
  ('Thiès', 'Thiès'), ('Thiès', 'Mbour'), ('Thiès', 'Tivaouane'),
  ('Louga', 'Louga'), ('Louga', 'Kébémer'),
  ('Saint-Louis', 'Saint-Louis'), ('Saint-Louis', 'Dagana'),
  ('Diourbel', 'Mbacké'), ('Kaolack', 'Kaolack'), ('Ziguinchor', 'Ziguinchor')
) as d(region, nom)
join public.regions r on r.nom = d.region
on conflict do nothing;

insert into public.communes (departement_id, nom, centre)
select dep.id, c.nom, extensions.st_makepoint(c.lng, c.lat)::extensions.geography
from (values
  ('Dakar',       'Dakar Plateau',  14.6680, -17.4370),
  ('Dakar',       'Ngor-Almadies',  14.7450, -17.5100),
  ('Dakar',       'Mermoz-Sacré-Cœur', 14.7110, -17.4750),
  ('Pikine',      'Pikine',         14.7550, -17.3900),
  ('Guédiawaye',  'Guédiawaye',     14.7760, -17.3950),
  ('Keur Massar', 'Keur Massar',    14.7830, -17.3110),
  ('Rufisque',    'Rufisque',       14.7160, -17.2730),
  ('Rufisque',    'Diamniadio',     14.7230, -17.1830),
  ('Rufisque',    'Bargny',         14.6980, -17.2280),
  ('Rufisque',    'Sangalkam',      14.7870, -17.2290),
  ('Thiès',       'Thiès',          14.7900, -16.9260),
  ('Thiès',       'Pout',           14.7700, -17.0600),
  ('Thiès',       'Kayar',          14.9170, -17.1170),
  ('Mbour',       'Mbour',          14.4200, -16.9640),
  ('Mbour',       'Saly',           14.4470, -17.0130),
  ('Mbour',       'Somone',         14.4880, -17.0830),
  ('Tivaouane',   'Tivaouane',      14.9500, -16.8170),
  ('Tivaouane',   'Mboro',          15.1370, -16.8840),
  ('Tivaouane',   'Darou Khoudoss', 15.1000, -16.8000),
  ('Tivaouane',   'Taïba Ndiaye',   15.0500, -16.9000),
  ('Louga',       'Louga',          15.6180, -16.2240),
  ('Kébémer',     'Kébémer',        15.3700, -16.4400),
  ('Saint-Louis', 'Saint-Louis',    16.0300, -16.4900),
  ('Dagana',      'Richard-Toll',   16.4620, -15.7000),
  ('Mbacké',      'Touba',          14.8500, -15.8800),
  ('Kaolack',     'Kaolack',        14.1500, -16.0700),
  ('Ziguinchor',  'Ziguinchor',     12.5600, -16.2700)
) as c(departement, nom, lat, lng)
join public.departements dep on dep.nom = c.departement
on conflict do nothing;

-- Pour donner le rôle administrateur à votre compte après inscription :
-- update public.profils set role = 'admin' where telephone = '+221XXXXXXXXX';
