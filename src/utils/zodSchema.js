import { z } from "zod";

export const astrologerSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  profile_photo: z.string().url("Invalid photo URL").optional(),
  gender: z.enum(["male", "female", "other"], "Gender is required"),
  dob: z.coerce.date(), // 🔹 Changed from string to Date
  city: z.string().min(2, "City name must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  experience: z.string(), // 🔹 Changed from number to string
  expertise: z.array(z.string()), // 🔹 Changed from string to array of strings
  bank_details: z.record(z.unknown()).optional(), // 🔹 Changed from string to JSON object
  featured: z.boolean(), // 🔹 Changed from enum to boolean
  language: z.string().min(2, "Languages must be at least 2 characters"),
  aadhar: z.string().optional(),
  pan: z.string().optional(),
  passbook_photo: z.string().optional(),
  voice_call_price: z.coerce.number().min(0, "Price must be a positive number"),
  chat_price: z.coerce.number().min(0, "Price must be a positive number"),
  voice_call_offer_price: z.coerce.number().min(0).optional(),
  chat_offer_price: z.coerce.number().min(0).optional(),
});
