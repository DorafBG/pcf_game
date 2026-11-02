import { DomainError } from '../../../shared/domain-error.js';

export class EmailAlreadyUsed extends DomainError {
  constructor() { super('This email is already registered', 409, 'email-already-used', 'Email already used'); }
}

/** Message volontairement générique : ne pas révéler si l'email existe (énumération). */
export class InvalidCredentials extends DomainError {
  constructor() { super('Incorrect email or password', 401, 'invalid-credentials', 'Invalid credentials'); }
}
