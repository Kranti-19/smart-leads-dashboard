import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().min(3),

  email: z.string().email(),

  status: z
    .enum(["new", "contacted", "qualified", "lost"])
    .optional(),

  source: z.enum(["website", "instagram", "referral"]),
});

export const updateLeadSchema = z.object({
  name: z.string().min(3).optional(),

  email: z.string().email().optional(),

  status: z
    .enum(["new", "contacted", "qualified", "lost"])
    .optional(),

  source: z
    .enum(["website", "instagram", "referral"])
    .optional(),
});