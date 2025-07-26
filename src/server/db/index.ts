import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: Client | undefined;
};

const createDbClient = (): Client => {
  return createClient({ 
    url: env.DATABASE_URL,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    authToken: env.DATABASE_AUTH_TOKEN,
  });
};

export const client: Client = globalForDb.client ?? createDbClient();

if (env.NODE_ENV !== "production") {
  globalForDb.client = client;
}

export const db = drizzle(client, { schema });
