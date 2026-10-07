import type { Role } from './user.js';

export interface TokenClaims { sub: string; role: Role }

/** PORT : émission de jetons (JWT dans l'infrastructure). */
export interface TokenIssuer {
  issue(claims: TokenClaims): Promise<{ accessToken: string; expiresIn: number }>;
}
