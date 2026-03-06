import { z } from "zod";

export const friendRequestSchema = z.object({
  addresseeId: z.string().uuid(),
});

export const feedQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(20),
  cursor: z.string().optional(),
});
