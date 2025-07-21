import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().min(1, {
    message: "Company name is required.",
  }),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  door_count: z.string().min(1, {
    message: "Door count is required.",
  }),
  property_management_software: z.string().min(1, {
    message: "Property management software is required.",
  }),
  notes: z.string().optional(),
});