import { z } from "zod";

export const logActivitySchema = z.object({
  distanceKm: z.number().min(0).max(500),
  weekStart: z.string().optional(),
  source: z.enum(["manual", "strava", "apple_health"]).default("manual"),
});

export type LogActivityBody = z.infer<typeof logActivitySchema>;

export const activityQuerySchema = z.object({
  weeks: z.coerce.number().min(1).max(52).default(12),
});
