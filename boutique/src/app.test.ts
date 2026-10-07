import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from './app.js';
import type { AddressInfo } from 'node:net';

test('Microservice Boutique - Tests des routes', async (t) => {
  const app = buildApp();
  const server = app.listen(0);
  const port = (server.address() as AddressInfo).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  t.after(() => {
    server.close();
  });

  await t.test('GET /health renvoie status ok', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'ok');
    assert.equal(body.service, 'boutique');
  });

  await t.test('GET /api/v1/boutique sans filtre renvoie tout le catalogue (14 items)', async () => {
    const res = await fetch(`${baseUrl}/api/v1/boutique`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(Array.isArray(body), true);
    assert.equal(body.length, 14);
  });

  await t.test('GET /api/v1/boutique?category=ROCK filtre uniquement les pierres', async () => {
    const res = await fetch(`${baseUrl}/api/v1/boutique?category=ROCK`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.length, 3);
    for (const item of body) {
      assert.equal(item.category, 'ROCK');
    }
  });

  await t.test('GET /api/v1/boutique?category=rock fonctionne de manière insensible à la casse', async () => {
    const res = await fetch(`${baseUrl}/api/v1/boutique?category=rock`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.length, 3);
  });

  await t.test('GET /api/v1/boutique?category=PAPER filtre les feuilles', async () => {
    const res = await fetch(`${baseUrl}/api/v1/boutique?category=PAPER`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.length, 3);
    for (const item of body) {
      assert.equal(item.category, 'PAPER');
    }
  });

  await t.test('GET /api/v1/boutique?category=SCISSORS filtre les ciseaux', async () => {
    const res = await fetch(`${baseUrl}/api/v1/boutique?category=SCISSORS`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.length, 3);
    for (const item of body) {
      assert.equal(item.category, 'SCISSORS');
    }
  });

  await t.test('GET /api/v1/boutique?category=AVATAR filtre les avatars', async () => {
    const res = await fetch(`${baseUrl}/api/v1/boutique?category=AVATAR`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.length, 4);
    for (const item of body) {
      assert.equal(item.category, 'AVATAR');
    }
  });

  await t.test('GET /api/v1/boutique?category=WELL filtre le puits pay-to-win', async () => {
    const res = await fetch(`${baseUrl}/api/v1/boutique?category=WELL`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.length, 1);
    assert.equal(body[0].name, 'Le Puits Nationalisé');
  });

  await t.test('GET /api/v1/boutique?category=INEXISTANT renvoie une liste vide', async () => {
    const res = await fetch(`${baseUrl}/api/v1/boutique?category=INEXISTANT`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, []);
  });

  await t.test('GET /api/v1/boutique/:id renvoie l\'item correspondant', async () => {
    const res = await fetch(`${baseUrl}/api/v1/boutique/1`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.id, '1');
    assert.equal(body.name, 'Le Pavé de Mai');
  });

  await t.test('GET /api/v1/boutique/:id avec id inconnu renvoie 404', async () => {
    const res = await fetch(`${baseUrl}/api/v1/boutique/9999`);
    assert.equal(res.status, 404);
    const body = await res.json();
    assert.equal(body.error, 'Item non trouvé');
  });
});
