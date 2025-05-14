import * as Yup from 'yup';
import { emailSchema, passwordSchema } from './schemas';

export const signupSchema = Yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .required('Name is required'),
  companyName: Yup.string().required('Company name is required'),
  acceptTerms: Yup.boolean()
    .oneOf([true], 'You must accept the Terms and Privacy Policy')
    .required('You must accept the Terms and Privacy Policy'),
});

export const loginSchema = Yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = Yup.object().shape({
  email: emailSchema,
});

export const resetPasswordSchema = Yup.object().shape({
  newPassword: passwordSchema,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});
