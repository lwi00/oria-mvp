import { z } from "zod";

export const updateUserSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  avatarUrl: z.string().url().optional(),
  goalType: z.enum(["running", "cycling", "steps"]).optional(),
  targetKm: z.number().min(1).max(200).optional(),
});

export type UpdateUserBody = z.infer<typeof updateUserSchema>;
