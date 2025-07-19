import { z } from "zod";

export const CardSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  company: z.string().optional(),
  job: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  website: z.string().url("Invalid URL").optional(),
  location: z.string().optional(),
  skills: z.array(z.object({ value: z.string().min(1) })),
  card_type: z.enum(["corporate", "personal"]),
});

export type CardSchemaType = z.infer<typeof CardSchema>;