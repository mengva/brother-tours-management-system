// ==========================================
// USER CREDENTIALS
// ==========================================

import { relations } from "drizzle-orm";
import { userCredentials } from "./credential";
import { users } from "../user";

export const userCredentialsRelations = relations(userCredentials, ({ one }) => ({
    user: one(users, {
        fields: [userCredentials.userId],
        references: [users.id],
    }),
}));
