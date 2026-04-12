import { z } from "zod";

export const petInfoSchema = z.object({
  petName: z.string().min(1, "Pet name is required"),
  petType: z.enum(["dog", "cat", "other"]),
  petBreed: z.string().optional(),
  petDob: z.string().min(1, "Date of birth is required"),
  ownerName: z.string().min(1, "Your name is required"),
  email: z.string().email("Valid email is required"),
  phone: z
    .string()
    .min(10, "Valid phone number is required")
    .regex(/^[\d\s\-().+]+$/, "Invalid phone format"),
});

export const serviceSelectionSchema = z.object({
  careType: z.enum(["dog_walking", "pet_sitting", "drop_in"]),
  daysPerWeek: z.number().min(1).max(7).optional(),
  selectedDays: z.array(z.string()).optional(),
  startDate: z.string().min(1, "Start date is required"),
  notes: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type PetInfoData = z.infer<typeof petInfoSchema>;
export type ServiceSelectionData = z.infer<typeof serviceSelectionSchema>;
export type ContactData = z.infer<typeof contactSchema>;
