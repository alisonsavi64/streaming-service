export default class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    private readonly passwordHash: string,
  ) {
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email');
    }
  }

  validatePassword(password: string, compare: (a: string, b: string) => boolean): boolean {
    return compare(password, this.passwordHash);
  }
}
