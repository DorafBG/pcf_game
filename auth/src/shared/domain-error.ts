/** Erreur métier : le domaine décrit le problème, l'infrastructure HTTP le traduit en problem+json. */
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly type: string,
    public readonly title: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}
