import { emailSchema, passwordSchema } from '@/lib/validations/schemas';

describe('Email Schema Validation', () => {
  it('should validate valid email addresses', async () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
      'first.last@subdomain.example.com',
    ];

    for (const email of validEmails) {
      await expect(emailSchema.validate(email)).resolves.toBe(email);
    }
  });

  it('should reject invalid email addresses', async () => {
    const invalidEmails = [
      'plainaddress',
      '@missingusername.com',
      'username@.com',
      '',
      null,
      undefined,
    ];

    for (const email of invalidEmails) {
      await expect(emailSchema.validate(email)).rejects.toBeTruthy();
    }
  });

  it('should require email to be provided', async () => {
    await expect(emailSchema.validate('')).rejects.toThrow('Email is required');
  });
});

describe('Password Schema Validation', () => {
  it('should validate valid passwords', async () => {
    const validPasswords = [
      'Password1!',
      'Complex@123',
      'Str0ng&P@ssword',
      'P@ssw0rd123',
    ];

    for (const password of validPasswords) {
      await expect(passwordSchema.validate(password)).resolves.toBe(password);
    }
  });

  it('should reject passwords with insufficient length', async () => {
    await expect(passwordSchema.validate('Short1!')).rejects.toThrow(
      'Password must be at least 8 characters'
    );
  });

  it('should reject passwords missing required characters', async () => {
    const invalidPasswords = [
      'password123!', // missing uppercase
      'PASSWORD123!', // missing lowercase
      'Password!!!!', // missing number
      'Password1234', // missing special character
    ];

    for (const password of invalidPasswords) {
      await expect(passwordSchema.validate(password)).rejects.toThrow(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      );
    }
  });

  it('should reject empty passwords', async () => {
    await expect(passwordSchema.validate('')).rejects.toThrow();
    // The error might be length validation rather than required validation
  });
}); 