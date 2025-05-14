import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/lib/validations/authSchema';

describe('Signup Schema Validation', () => {
  it('should validate valid signup data', async () => {
    const validSignupData = {
      email: 'test@example.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      name: 'Test User',
      companyName: 'Test Company',
      acceptTerms: true,
    };

    await expect(signupSchema.validate(validSignupData)).resolves.toEqual(validSignupData);
  });

  it('should reject when passwords do not match', async () => {
    const invalidSignupData = {
      email: 'test@example.com',
      password: 'Password1!',
      confirmPassword: 'DifferentPassword1!',
      name: 'Test User',
      companyName: 'Test Company',
      acceptTerms: true,
    };

    await expect(signupSchema.validate(invalidSignupData)).rejects.toThrow('Passwords must match');
  });

  it('should reject when name is too short', async () => {
    const invalidSignupData = {
      email: 'test@example.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      name: 'T',
      companyName: 'Test Company',
      acceptTerms: true,
    };

    await expect(signupSchema.validate(invalidSignupData)).rejects.toThrow(
      'Name must be at least 2 characters'
    );
  });

  it('should reject when terms are not accepted', async () => {
    const invalidSignupData = {
      email: 'test@example.com',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      name: 'Test User',
      companyName: 'Test Company',
      acceptTerms: false,
    };

    await expect(signupSchema.validate(invalidSignupData)).rejects.toThrow(
      'You must accept the Terms and Privacy Policy'
    );
  });
});

describe('Login Schema Validation', () => {
  it('should validate valid login data', async () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'Password1!',
    };

    await expect(loginSchema.validate(validLoginData)).resolves.toEqual(validLoginData);
  });

  it('should reject with invalid email', async () => {
    const invalidLoginData = {
      email: 'invalid-email',
      password: 'Password1!',
    };

    await expect(loginSchema.validate(invalidLoginData)).rejects.toThrow('Invalid email address');
  });

  it('should reject with invalid password', async () => {
    const invalidLoginData = {
      email: 'test@example.com',
      password: 'weak',
    };

    await expect(loginSchema.validate(invalidLoginData)).rejects.toBeTruthy();
  });
});

describe('Forgot Password Schema Validation', () => {
  it('should validate valid email', async () => {
    const validData = {
      email: 'test@example.com',
    };

    await expect(forgotPasswordSchema.validate(validData)).resolves.toEqual(validData);
  });

  it('should reject with invalid email', async () => {
    const invalidData = {
      email: 'invalid-email',
    };

    await expect(forgotPasswordSchema.validate(invalidData)).rejects.toThrow('Invalid email address');
  });
});

describe('Reset Password Schema Validation', () => {
  it('should validate valid reset password data', async () => {
    const validData = {
      newPassword: 'Password1!',
      confirmPassword: 'Password1!',
    };

    await expect(resetPasswordSchema.validate(validData)).resolves.toEqual(validData);
  });

  it('should reject when passwords do not match', async () => {
    const invalidData = {
      newPassword: 'Password1!',
      confirmPassword: 'DifferentPassword1!',
    };

    await expect(resetPasswordSchema.validate(invalidData)).rejects.toThrow('Passwords must match');
  });

  it('should reject when password does not meet requirements', async () => {
    const invalidData = {
      newPassword: 'weak',
      confirmPassword: 'weak',
    };

    await expect(resetPasswordSchema.validate(invalidData)).rejects.toBeTruthy();
  });
}); 