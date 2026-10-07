export type Role = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
}

export type NewUser = Pick<User, 'email' | 'passwordHash'> & { role?: Role };

/** Ce que le service expose : jamais le hash. */
export type PublicUser = Omit<User, 'passwordHash'>;
export const toPublic = ({ passwordHash: _hash, ...user }: User): PublicUser => user;
