import { User } from '../user.entity';

describe('User Entity', () => {
  const validId = '123';
  const validName = 'Alice';
  const validEmail = 'alice@example.com';
  const validHash = '$2b$10$abcdefghijklmnopqrstuv'; 

  it('should create a valid user', () => {
    const user = User.create(validId, validName, validEmail, validHash);
    expect(user.id).toBe(validId);
    expect(user.name).toBe(validName);
    expect(user.email).toBe(validEmail);
    expect(user.getPasswordHash()).toBe(validHash);
  });

  it('should throw error for invalid name', () => {
    expect(() => User.create(validId, 'A', validEmail, validHash)).toThrow(
      'Name must be at least 2 characters',
    );
    expect(() => User.create(validId, '', validEmail, validHash)).toThrow();
  });

  it('should throw error for invalid email', () => {
    expect(() =>
      User.create(validId, validName, 'invalidemail', validHash),
    ).toThrow('Invalid email format');
    expect(() =>
      User.create(validId, validName, '', validHash),
    ).toThrow('Invalid email format');
  });

  it('should throw error for invalid password hash', () => {
    expect(() =>
      User.create(validId, validName, validEmail, ''),
    ).toThrow('Invalid password hash');
  });

  it('should validate password correctly', () => {
    const user = User.create(validId, validName, validEmail, validHash);
    const compareMock = jest.fn((plain, hash) => plain === 'password' && hash === validHash);

    expect(user.validatePassword('password', compareMock)).toBe(true);
    expect(user.validatePassword('wrong', compareMock)).toBe(false);
  });
});
