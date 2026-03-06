import { z } from "zod";

export const verifyBodySchema = z.object({
  walletAddr: z.string().optional(),
  displayName: z.string().optional(),
});

export type VerifyBody = z.infer<typeof verifyBodySchema>;
