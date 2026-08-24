import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const donationInputSchema = z.object({
  donorId: z.string().trim().length(24).optional(),
  donorName: z.string().trim().min(1).max(200).optional(),
  donorEmail: z.string().trim().email().optional().or(z.literal("")),
  donorPhone: z.string().trim().max(30).optional().or(z.literal("")),
  donorCity: z.string().trim().max(120).optional().or(z.literal("")),
  amount: z.coerce.number().positive(),
  currency: z.string().trim().max(10).optional(),
  mode: z.enum(["cash", "bank_transfer", "upi", "cheque", "other"]),
  program: z.string().trim().max(80).optional(),
  date: z.coerce.date(),
  referenceNote: z.string().trim().max(500).optional().or(z.literal("")),
});

export const donationUpdateSchema = donationInputSchema.partial().extend({
  amount: z.coerce.number().positive().optional(),
  mode: z
    .enum(["cash", "bank_transfer", "upi", "cheque", "other"])
    .optional(),
  date: z.coerce.date().optional(),
});

export const donorUpdateSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

// Deliberately accepts any string — validation must not reject a filled
// honeypot, since the route handler needs to see the value to silently
// discard the submission rather than returning an error that tips off bots.
const honeypotField = z.string().optional().or(z.literal(""));

export const volunteerSignupSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  interest: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  company: honeypotField,
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(2000),
  company: honeypotField,
});

export const statusUpdateSchema = z.object({
  status: z.string().trim().min(1).max(30),
});
