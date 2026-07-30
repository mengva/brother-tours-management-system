import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "../user";

export const userCredentials = pgTable("user_credentials", {
    userId: uuid("user_id").primaryKey().notNull().references(() => users.id, { onDelete: "cascade" }),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
});