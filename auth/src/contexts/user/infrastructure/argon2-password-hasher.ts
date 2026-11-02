import argon2 from 'argon2';
import type { PasswordHasher } from '../domain/password-hasher.js';

/** argon2id : recommandation OWASP pour le hachage de mots de passe. */
export class Argon2PasswordHasher implements PasswordHasher {
  hash(plain: string) { return argon2.hash(plain, { type: argon2.argon2id }); }
  verify(hash: string, plain: string) { return argon2.verify(hash, plain); }
}
