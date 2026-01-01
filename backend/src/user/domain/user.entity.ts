export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public passwordHash: string,
  ) {
    this.validateName(name);
    this.validateEmail(email);
    this.validatePasswordHash(passwordHash);
  }

  static create(
    id: string,
    name: string,
    email: string,
    passwordHash: string,
  ): User {
    return new User(id, name, email, passwordHash);
  }

  private validateName(name: string) {
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
  }

  private validateEmail(email: string) {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  private validatePasswordHash(hash: string) {
    if (!hash || hash.length == 0) {
      throw new Error('Invalid password hash');
    }
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
