import { sql } from "drizzle-orm";
import { index, sqliteTableCreator } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `chronostamp_${name}`);

// Events table for storing ChronoStamp events
export const events = createTable(
  "events",
  (d) => ({
    id: d.text().primaryKey(),
    name: d.text({ length: 256 }).notNull(),
    description: d.text().notNull(),
    imageUrl: d.text().notNull(),
    contractAddress: d.text({ length: 42 }),
    eventCode: d.text({ length: 50 }).notNull().unique(),
    organizer: d.text({ length: 42 }).notNull(),
    eventDate: d.integer({ mode: "timestamp" }).notNull(),
    claimStartTime: d.integer({ mode: "timestamp" }), // Optional: when claiming opens (null = no restriction)
    claimEndTime: d.integer({ mode: "timestamp" }),   // Optional: when claiming closes (null = no restriction)
    totalClaimed: d.integer().default(0).notNull(),
    maxSupply: d.integer().notNull(),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("event_code_idx").on(t.eventCode),
    index("organizer_idx").on(t.organizer),
    index("created_at_idx").on(t.createdAt),
  ],
);

// Claims table for storing user claim records
export const claims = createTable(
  "claims",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    userAddress: d.text({ length: 42 }).notNull(),
    eventId: d.text().notNull(),
    tokenId: d.text(),
    transactionHash: d.text({ length: 66 }),
    claimedAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  }),
  (t) => [
    index("user_address_idx").on(t.userAddress),
    index("event_id_idx").on(t.eventId),
    index("claimed_at_idx").on(t.claimedAt),
  ],
);

// Legacy posts table (keeping for reference)
export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    name: d.text({ length: 256 }),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);
