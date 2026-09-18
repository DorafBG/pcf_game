import type { UserRepository } from '../domain/user.repository.js';
import type { PasswordHasher } from '../domain/password-hasher.js';
import type { TokenIssuer } from '../domain/token-issuer.js';
import { RegisterUser } from './register-user.js';
import { LoginUser } from './login-user.js';
import { GetMe } from './get-me.js';

export interface UserPorts { users: UserRepository; hasher: PasswordHasher; tokens: TokenIssuer }

export function buildUserUseCases({ users, hasher, tokens }: UserPorts) {
  return {
    registerUser: new RegisterUser(users, hasher),
    loginUser: new LoginUser(users, hasher, tokens),
    getMe: new GetMe(users),
  };
}
export type UserUseCases = ReturnType<typeof buildUserUseCases>;
