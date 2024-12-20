import {
  integer,
  pgTable,
  serial,
  varchar,
  unique,
  boolean,
} from "drizzle-orm/pg-core";

// Users Table
export const Users = pgTable("users", {
  id: serial("id").primaryKey(), // Primary key for Users (auto-incremented)
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(), // Ensuring email is unique
  credits: integer("credits").default(3),
  upgrade: boolean("upgrade").default(false),
});

// Files Table
export const Files = pgTable("files", {
  fileId: serial("file_id").primaryKey(), // Primary key for Files (auto-incremented)
  fileUrl: varchar("file_url").notNull(), // URL of the uploaded file
  fileName: varchar("file_name").default("Untitled"), // Name of the file
  userId: integer("user_id")
    .references(() => Users.id) // Correctly referencing the Users.id
    .notNull(),
});
