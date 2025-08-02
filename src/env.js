import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL_DEV: z.string().url(),
    DATABASE_AUTH_TOKEN_DEV: z.string().min(1),
    DATABASE_URL_PROD: z.string().min(1), // Allow placeholder values in development
    DATABASE_AUTH_TOKEN_PROD: z.string().min(1), // Allow placeholder values in development
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PINATA_JWT: z.string().min(1),
    SIGNER_PRIVATE_KEY_DEV: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid dev private key format'),
    SIGNER_PRIVATE_KEY_PROD: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid prod private key format'),
    // Smart contract deployment (optional for gradual rollout)
    RPC_URL: z.string().url().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_SIGNER_ADDRESS_DEV: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid dev address format'),
    NEXT_PUBLIC_SIGNER_ADDRESS_PROD: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid prod address format'),
    NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid factory contract address format'),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL_DEV: process.env.DATABASE_URL_DEV,
    DATABASE_AUTH_TOKEN_DEV: process.env.DATABASE_AUTH_TOKEN_DEV,
    DATABASE_URL_PROD: process.env.DATABASE_URL_PROD,
    DATABASE_AUTH_TOKEN_PROD: process.env.DATABASE_AUTH_TOKEN_PROD,
    NODE_ENV: process.env.NODE_ENV,
    PINATA_JWT: process.env.PINATA_JWT,
    SIGNER_PRIVATE_KEY_DEV: process.env.SIGNER_PRIVATE_KEY_DEV,
    SIGNER_PRIVATE_KEY_PROD: process.env.SIGNER_PRIVATE_KEY_PROD,
    NEXT_PUBLIC_SIGNER_ADDRESS_DEV: process.env.NEXT_PUBLIC_SIGNER_ADDRESS_DEV,
    NEXT_PUBLIC_SIGNER_ADDRESS_PROD: process.env.NEXT_PUBLIC_SIGNER_ADDRESS_PROD,
    NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS,
    // Smart contract deployment
    RPC_URL: process.env.RPC_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
