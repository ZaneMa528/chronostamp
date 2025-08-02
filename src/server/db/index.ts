import { createClient, type Client } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import { env } from '~/env';
import * as schema from './schema';

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: Client | undefined;
};

const createDbClient = (): Client => {
  const isDevelopment = env.NODE_ENV === 'development';

  return createClient({
    url: isDevelopment ? env.DATABASE_URL_DEV : env.DATABASE_URL_PROD,
    authToken: isDevelopment ? env.DATABASE_AUTH_TOKEN_DEV : env.DATABASE_AUTH_TOKEN_PROD,
  });
};

export const client: Client = globalForDb.client ?? createDbClient();

if (env.NODE_ENV !== 'production') {
  globalForDb.client = client;
}

export const db = drizzle(client, { schema });
