/** PORT : le domaine ne sait pas quel algorithme est utilisé (argon2 dans l'infrastructure). */
export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  verify(hash: string, plain: string): Promise<boolean>;
}
