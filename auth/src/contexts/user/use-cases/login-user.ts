import type { UserRepository } from '../domain/user.repository.js';
import type { PasswordHasher } from '../domain/password-hasher.js';
import type { TokenIssuer } from '../domain/token-issuer.js';
import { InvalidCredentials } from '../domain/user.errors.js';

export class LoginUser {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenIssuer,
  ) {}

  async execute(input: { email: string; password: string }) {
    const user = await this.users.findByEmail(input.email);
    // Même erreur si l'email est inconnu ou le mot de passe faux (pas d'énumération de comptes)
    if (!user || !(await this.hasher.verify(user.passwordHash, input.password))) throw new InvalidCredentials();
    const token = await this.tokens.issue({ sub: user.id, role: user.role });
    return { ...token, tokenType: 'Bearer' as const };
  }
}
