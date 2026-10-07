import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { buildApp } from '../src/app.js';
import { InMemoryUserRepository } from '../src/contexts/user/infrastructure/in-memory-user.repository.js';
import { JwtTokenIssuer } from '../src/contexts/user/infrastructure/jwt-token-issuer.js';
import type { PasswordHasher } from '../src/contexts/user/domain/password-hasher.js';

const secret = 'test-secret-test-secret-test-secret-1234';
/** Hasher de test (rapide, sans argon2) : le port permet de le remplacer. */
const fakeHasher: PasswordHasher = { hash: async (p) => `h:${p}`, verify: async (h, p) => h === `h:${p}` };

let app: ReturnType<typeof buildApp>;
beforeEach(() => {
  app = buildApp({
    users: new InMemoryUserRepository(),
    hasher: fakeHasher,
    tokens: new JwtTokenIssuer({ secret, issuer: 'polyshop-auth', ttlSeconds: 900 }),
    jwtSecret: secret, jwtIssuer: 'polyshop-auth', corsOrigins: ['http://localhost:5173'],
  });
});

const creds = { email: 'Leia@polyshop.fr', password: 'correct-horse-battery' };

describe('POST /api/v1/auth/register', () => {
  it('crée un compte (201) sans exposer le hash, email normalisé', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(creds);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ email: 'leia@polyshop.fr', role: 'user' });
    expect(res.body.passwordHash).toBeUndefined();
  });
  it('refuse un doublon (409)', async () => {
    await request(app).post('/api/v1/auth/register').send(creds);
    expect((await request(app).post('/api/v1/auth/register').send(creds)).status).toBe(409);
  });
  it('refuse un mot de passe trop court (400)', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({ email: 'a@b.fr', password: 'short' });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].path).toBe('password');
  });
});

describe('POST /api/v1/auth/login + GET /me', () => {
  it('renvoie un Bearer JWT puis /me', async () => {
    await request(app).post('/api/v1/auth/register').send(creds);
    const login = await request(app).post('/api/v1/auth/login').send(creds);
    expect(login.status).toBe(200);
    expect(login.body).toMatchObject({ tokenType: 'Bearer', expiresIn: 900 });
    const me = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${login.body.accessToken}`);
    expect(me.status).toBe(200);
    expect(me.body.email).toBe('leia@polyshop.fr');
  });
  it('401 générique si mauvais mot de passe ou email inconnu', async () => {
    await request(app).post('/api/v1/auth/register').send(creds);
    const bad = await request(app).post('/api/v1/auth/login').send({ ...creds, password: 'wrong-password' });
    const unknown = await request(app).post('/api/v1/auth/login').send({ email: 'nobody@polyshop.fr', password: 'whatever-123' });
    expect(bad.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect(bad.body.detail).toBe(unknown.body.detail);
  });
  it('401 sans jeton, 401 avec un jeton forgé', async () => {
    expect((await request(app).get('/api/v1/auth/me')).status).toBe(401);
    const forged = await request(app).get('/api/v1/auth/me').set('Authorization', 'Bearer abc.def.ghi');
    expect(forged.status).toBe(401);
    expect(forged.headers['www-authenticate']).toContain('invalid_token');
  });
});

describe('durcissement', () => {
  it('helmet pose les headers de sécurité et x-powered-by est absent', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
});
