import { sql } from "drizzle-orm";
import { boolean, integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey().unique().notNull(),
  username: varchar("username", { length: 255 }).unique().notNull(),                                  // Unique ID (primary key)
  questionPrice: integer("questionPrice").notNull(),
  maxQuestions: integer("maxQuestions").notNull(),
  maxQuestionLines: integer("maxQuestionLines").notNull(),                         // Lesson Price (required)
  connected_account_id: varchar("connected_account_id", { length: 255 }).unique(), // Stripe Connected Account ID (required and unique)
  stripe_connected_linked: boolean("stripe_connected_linked").default(false), // Stripe Linked (required, default: false)
});

export const questionsTable = pgTable("questions", {
  id: uuid("id").primaryKey().unique().default(sql`gen_random_uuid()`),  // Unique ID for the question
  question: varchar("question").notNull(),  // Question text
  to: varchar("to").notNull(),
  fromEmail: varchar("fromEmail").notNull(),  // Link to user who created the question
});