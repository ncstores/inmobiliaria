# Almacenamiento sólo en Vercel

La web y la API se despliegan en Vercel. El catálogo y sus imágenes se almacenan
en Vercel Blob. Supabase sólo se usa para la copia inicial; después de verificar
la migración pueden quitarse sus variables.

## Activación

1. En Vercel, abrir el proyecto → Storage → Create Database/Store → Blob.
   Crear un store **public** y conectarlo a Production. Vercel agrega
   `BLOB_READ_WRITE_TOKEN` automáticamente. No exponer este token al frontend.
2. Crear variables de servidor:
   - `ADMIN_PASSWORD`: una contraseña nueva para el panel.
   - `ADMIN_SESSION_SECRET`: cadena aleatoria larga (al menos 32 bytes).
   - `SUPABASE_URL` y `SUPABASE_ANON_KEY`: acceso al proyecto de origen,
     temporalmente para migrar. También admite los nombres VITE existentes.
3. Crear `VITE_STORAGE_PROVIDER=vercel` y redesplegar.
4. Entrar en `/admin` con `ADMIN_PASSWORD`. Mientras no haya datos, el catálogo
   público muestra un mensaje de carga fallida, nunca datos de ejemplo.
5. En Migración, pulsar **Migrar Supabase a Vercel**. Esto lee el origen sin
   modificarlo y sólo copia conjuntos de datos que todavía no existen en destino.
   Si una copia se interrumpe, se puede repetir para completar los faltantes sin
   reemplazar los ya guardados. Las imágenes
   base64 se convierten a archivos Blob y el JSON guarda las URLs.
6. Recargar el admin y comprobar propiedades, fotos, contenido y listas.
   Editar un dato, recargar desde otro navegador y comprobar persistencia.
7. Retirar las variables Supabase y redesplegar después de verificar la copia.

Antes del paso 3, confirmar que el proyecto de origen esté activo y contenga
los datos reales. La migración no puede recuperar información ya reemplazada.
Conservar una exportación externa del origen antes de activar el nuevo backend.

## Funcionamiento

### Si Supabase restringe su API por cuota

Si Table Editor o SQL Editor todavía permiten consultar, usar en el admin
**Copiar SQL de exportación**, pegarlo en SQL Editor de Supabase y ejecutar.
Exportar el resultado completo en JSON e importarlo mediante **Importar Backup
JSON**. La consulta `src/data/exportCatalog.sql` sólo lee el catálogo, excluye
credenciales y conserva fotos, logo, fondo y coordenadas. El importador acepta
el formato directo de la app y el array de resultados del SQL Editor; rechaza
archivos incompletos antes de guardar. Si SQL Editor también está restringido,
resolver el acceso con Supabase o usar una copia de respaldo previa.

- `/api/storage` permite lecturas de las cuatro claves públicas del catálogo.
- Las escrituras requieren una sesión firmada, HttpOnly, Secure, de 8 horas.
- La contraseña del admin se cambia en Vercel, no se guarda en Blob.
- Cada reemplazo conserva el JSON anterior en `catalog/backups/`.
- Los JSON y fotos del store son públicos: no guardar datos privados ni claves.
- No se utiliza localStorage como sustituto silencioso de un guardado online.
- El desarrollo con API requiere `vercel dev`; `npm run dev` sólo sirve frontend.
- Las imágenes del admin se suben directamente a Blob (máximo 10 MB por imagen)
  con un token de carga autorizado por la sesión. Las peticiones JSON a Functions
  tienen límite de 4.5 MB; las fotos no se envían dentro de ese JSON.
- Esta implementación está pensada para un administrador editando el catálogo;
  ediciones simultáneas pueden reemplazar cambios (última escritura gana).
- Revisar consumo/costos y retención de backups en Vercel Blob.

## Verificación local

```text
npm run build
npm run lint
node --test tests/storage.test.js
```

La activación real requiere sesión válida en Vercel y crear el store/variables.
No borrar el proyecto Supabase hasta comprobar la migración y conservar backup.
