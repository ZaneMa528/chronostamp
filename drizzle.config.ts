import { type Config } from "drizzle-kit";
import dotenv from "dotenv";

// Load environment variables first  
dotenv.config({ path: ".env" });

const isDevelopment = (process.env.NODE_ENV || "development") === "development";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: isDevelopment ? process.env.DATABASE_URL_DEV! : process.env.DATABASE_URL_PROD!,
    authToken: isDevelopment ? process.env.DATABASE_AUTH_TOKEN_DEV! : process.env.DATABASE_AUTH_TOKEN_PROD!,
  },
  tablesFilter: ["chronostamp_*"],
} satisfies Config;
