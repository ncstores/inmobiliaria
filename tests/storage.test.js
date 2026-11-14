import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/storage.js';

process.env.BLOB_READ_WRITE_TOKEN = 'test-only';
process.env.ADMIN_PASSWORD = 'test-password';
process.env.ADMIN_SESSION_SECRET = 'test-session-secret-not-for-production';

async function request(body, cookie = '') {
  const response = {
    statusCode: 200, headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
    end() { return this; }
  };
  await handler({ method: 'POST', headers: { cookie }, body }, response);
  return response;
}

test('anonymous writes and migration are rejected before accessing storage', async () => {
  for (const action of ['save', 'migrate']) {
    const result = await request({ action, key: 'vergnano_properties', value: [] });
    assert.equal(result.statusCode, 401);
  }
});

test('login rejects incorrect password and issues a secure session for correct password', async () => {
  assert.equal((await request({ action: 'login', password: 'wrong' })).statusCode, 401);
  const result = await request({ action: 'login', password: 'test-password' });
  assert.equal(result.body.value, true);
  const cookie = result.headers['Set-Cookie'];
  assert.match(cookie, /HttpOnly; Secure; SameSite=Strict/);
  const session = cookie.split(';')[0];
  const logout = await request({ action: 'logout' }, session);
  assert.equal(logout.statusCode, 200);
  assert.match(logout.headers['Set-Cookie'], /Max-Age=0/);
  const tampered = await request({ action: 'logout' }, `${session}altered`);
  assert.equal(tampered.statusCode, 401);
});

test('authenticated requests cannot save credentials or an invalid data shape', async () => {
  const login = await request({ action: 'login', password: 'test-password' });
  const cookie = login.headers['Set-Cookie'].split(';')[0];
  const credentials = await request({ action: 'save', key: 'vergnano_admin_auth', value: {} }, cookie);
  assert.equal(credentials.statusCode, 400);
  const invalid = await request({ action: 'save', key: 'vergnano_properties', value: {} }, cookie);
  assert.equal(invalid.statusCode, 400);
});

test('migration reports missing source configuration to the authenticated administrator', async () => {
  const names = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  const previous = names.map((name) => process.env[name]);
  try {
    for (const name of names) delete process.env[name];
    const login = await request({ action: 'login', password: 'test-password' });
    const cookie = login.headers['Set-Cookie'].split(';')[0];
    const result = await request({ action: 'migrate' }, cookie);
    assert.equal(result.statusCode, 422);
    assert.match(result.body.error, /Faltan las variables de Supabase/);
  } finally {
    names.forEach((name, index) => {
      if (previous[index] === undefined) delete process.env[name];
      else process.env[name] = previous[index];
    });
  }
});
