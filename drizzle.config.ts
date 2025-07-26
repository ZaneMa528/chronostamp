import { type Config } from "drizzle-kit";
import dotenv from "dotenv";

// Load environment variables first  
dotenv.config({ path: ".env" });

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
  tablesFilter: ["chronostamp_*"],
} satisfies Config;
