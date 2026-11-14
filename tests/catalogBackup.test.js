import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCatalogBackup } from '../src/data/catalogBackup.js';

const backup = {
  properties: [{ id: 1, title: 'Departamento real', images: ['data:image/jpeg;base64,abc'], mapUrl: '-38,-62' }],
  locations: ['Centro'], types: ['2 Dormitorios'], siteContent: { brandName: 'Vergnano', logoImage: 'logo' }
};

test('accepts app backups and SQL Editor JSON export wrappers without losing photos or settings', () => {
  for (const input of [backup, { backup }, [{ backup }], [{ backup: JSON.stringify(backup) }]]) {
    assert.deepEqual(parseCatalogBackup(input), backup);
  }
});

test('rejects table-only, truncated and missing-setting exports before writes', () => {
  for (const input of [[], backup.properties, { properties: [] }, { ...backup, siteContent: null }, { ...backup, types: null }]) {
    assert.throws(() => parseCatalogBackup(input), /backup completo/);
  }
  assert.throws(() => parseCatalogBackup({ ...backup, properties: [{ id: 1 }] }), /formato inválido/);
});
