import { z } from 'zod';

export const nameSchema = z.string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be at most 50 characters')
  .regex(/^[A-Za-z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes");

export const emailSchema = z.string()
  .trim()
  .toLowerCase()
  .email('Invalid email address')
  .regex(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/, "Email must have a valid domain extension");

export const passwordSchema = z.string().min(1, 'Password is required');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema
});
