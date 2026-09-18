import type { NewUser, User } from './user.js';

/** PORT */
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(input: NewUser): Promise<User>;
}
