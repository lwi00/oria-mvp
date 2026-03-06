import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string(),
  PRIVY_APP_ID: z.string(),
  PRIVY_APP_SECRET: z.string(),
  AVAX_RPC_URL: z.string().default("https://api.avax-test.network/ext/bc/C/rpc"),
  AVAX_CHAIN_ID: z.coerce.number().default(43113),
  MOCK_AUTH: z
    .string()
    .transform((v) => v === "true")
    .default("false"),
  MOCK_STRAVA: z
    .string()
    .transform((v) => v === "true")
    .default("true"),
  MOCK_YIELD: z
    .string()
    .transform((v) => v === "true")
    .default("true"),
});

export const env = envSchema.parse(process.env);
