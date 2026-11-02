import type { UserRepository } from '../domain/user.repository.js';
import { toPublic } from '../domain/user.js';
import { DomainError } from '../../../shared/domain-error.js';

export class GetMe {
  constructor(private readonly users: UserRepository) {}

  async execute(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) throw new DomainError('User no longer exists', 401, 'unknown-user', 'Unknown user');
    return toPublic(user);
  }
}
