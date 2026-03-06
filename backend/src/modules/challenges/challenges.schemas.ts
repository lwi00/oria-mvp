import { z } from "zod";

export const createChallengeSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  goalKmWeek: z.number().min(1).max(200),
  startDate: z.string(),
  endDate: z.string(),
  maxMembers: z.number().min(2).max(100).optional(),
});

export type CreateChallengeBody = z.infer<typeof createChallengeSchema>;
