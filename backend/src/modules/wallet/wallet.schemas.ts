import { z } from "zod";

export const depositSchema = z.object({
  amount: z.number().positive(),
  token: z.enum(["USDC", "WAVAX"]).default("USDC"),
});

export type DepositBody = z.infer<typeof depositSchema>;
