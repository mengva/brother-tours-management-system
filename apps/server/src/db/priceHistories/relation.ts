// ==========================================
// PRICE HISTORIES
// ==========================================

import { relations } from "drizzle-orm";
import { priceHistories } from "./priceHistory";
import { serviceRates } from "../serviceRate";
import { users } from "../user";

export const priceHistoriesRelations = relations(priceHistories, ({ one }) => ({
    serviceRate: one(serviceRates, {
        fields: [priceHistories.serviceRateId],
        references: [serviceRates.id],
    }),

    changedBy: one(users, {
        fields: [priceHistories.changedByUserId],
        references: [users.id],
    }),
}));
