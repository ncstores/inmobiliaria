// SQL Editor JSON exports wrap the single result row as [{ backup: ... }].
export function parseCatalogBackup(input) {
  let backup = input;
  if (Array.isArray(backup) && backup.length === 1 && backup[0]?.backup !== undefined) backup = backup[0].backup;
  else if (backup?.backup !== undefined) backup = backup.backup;
  if (typeof backup === 'string') backup = JSON.parse(backup);

  if (!backup || typeof backup !== 'object' || Array.isArray(backup) ||
      !Array.isArray(backup.properties) || !Array.isArray(backup.locations) ||
      !Array.isArray(backup.types) || !backup.siteContent ||
      typeof backup.siteContent !== 'object' || Array.isArray(backup.siteContent)) {
    throw new Error('El archivo no contiene un backup completo: faltan propiedades, barrios, tipologías o contenido. Exportá el resultado de la consulta completa.');
  }
  if (backup.properties.some((property) => !property || property.id == null || typeof property.title !== 'string' || !Array.isArray(property.images))) {
    throw new Error('El backup contiene propiedades con un formato inválido. No se importaron datos.');
  }
  return backup;
}
