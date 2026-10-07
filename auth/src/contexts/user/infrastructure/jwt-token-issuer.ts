import jwt from 'jsonwebtoken';
import type { TokenClaims, TokenIssuer } from '../domain/token-issuer.js';

/** HS256 : secret partagé entre auth et les services qui vérifient. En prod : RS256/ES256 (clé privée chez auth). */
export class JwtTokenIssuer implements TokenIssuer {
  constructor(private readonly opts: { secret: string; issuer: string; ttlSeconds: number }) {}

  async issue(claims: TokenClaims) {
    const accessToken = jwt.sign({ role: claims.role }, this.opts.secret, {
      subject: claims.sub,
      issuer: this.opts.issuer,
      expiresIn: this.opts.ttlSeconds,
      algorithm: 'HS256',
    });
    return { accessToken, expiresIn: this.opts.ttlSeconds };
  }
}
