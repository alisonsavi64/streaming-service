export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    private readonly passwordHash: string,
  ) {
    if (!name || name.trim().length < 2) {
      throw new Error('Invalid name');
    }

    if (!email || !email.includes('@')) {
      throw new Error('Invalid email');
    }
  }

  static create(
    id: string,
    name: string,
    email: string,
    passwordHash: string,
  ): User {
    if (!passwordHash) {
      throw new Error('Password hash is required');
    }

    return new User(id, name, email, passwordHash);
  }

  validatePassword(
    password: string,
    compare: (plain: string, hash: string) => boolean,
  ): boolean {
    return compare(password, this.passwordHash);
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }
}
