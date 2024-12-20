import "dotenv/config";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./config/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:ZV2iGxCcNml6@ep-cool-lake-a552rjrq.us-east-2.aws.neon.tech/neondb?sslmode=require",
  },
});
