-- Sólo lectura: exporta el catálogo sin modificar tablas ni credenciales.
-- Ejecutar en SQL Editor y exportar el resultado en formato JSON.
select jsonb_build_object(
  'properties', (
    select coalesce(jsonb_agg(
      (to_jsonb(p) - 'map_url' - 'sort_order' - 'updated_at')
      || jsonb_build_object('mapUrl', coalesce(p.map_url, ''))
      order by p.sort_order, p.id
    ), '[]'::jsonb)
    from public.properties p
  ),
  'locations', (select value from public.app_settings where key = 'vergnano_locations'),
  'types', (select value from public.app_settings where key = 'vergnano_types'),
  'siteContent', (select value from public.app_settings where key = 'vergnano_site_content'),
  'exportedAt', now()
) as backup;
