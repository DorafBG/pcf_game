import { randomUUID } from 'node:crypto';
import type { NewUser, User } from '../domain/user.js';
import type { UserRepository } from '../domain/user.repository.js';

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();
  async findByEmail(email: string) { return [...this.users.values()].find((u) => u.email === email) ?? null; }
  async findById(id: string) { return this.users.get(id) ?? null; }
  async create(input: NewUser) {
    const user: User = { id: randomUUID(), createdAt: new Date(), role: input.role ?? 'user', email: input.email, passwordHash: input.passwordHash };
    this.users.set(user.id, user);
    return user;
  }
}
