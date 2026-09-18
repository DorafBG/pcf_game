import type { UserRepository } from '../domain/user.repository.js';
import type { PasswordHasher } from '../domain/password-hasher.js';
import { EmailAlreadyUsed } from '../domain/user.errors.js';
import { toPublic } from '../domain/user.js';

export class RegisterUser {
  constructor(private readonly users: UserRepository, private readonly hasher: PasswordHasher) {}

  async execute(input: { email: string; password: string }) {
    if (await this.users.findByEmail(input.email)) throw new EmailAlreadyUsed();
    const passwordHash = await this.hasher.hash(input.password);
    const user = await this.users.create({ email: input.email, passwordHash });
    return toPublic(user);
  }
}
