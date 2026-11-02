import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { NewUser, Role, User } from '../domain/user.js';
import type { UserRepository } from '../domain/user.repository.js';

const toDomain = (row: { id: string; email: string; passwordHash: string; role: string; createdAt: Date }): User =>
  ({ ...row, role: row.role as Role });

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly db: PrismaClient) {}

  async findByEmail(email: string) {
    const row = await this.db.user.findUnique({ where: { email } });
    return row ? toDomain(row) : null;
  }
  async findById(id: string) {
    const row = await this.db.user.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }
  async create(input: NewUser) {
    return toDomain(await this.db.user.create({ data: { ...input, role: input.role ?? 'user' } }));
  }
}
