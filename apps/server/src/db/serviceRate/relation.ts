// ==========================================
// SERVICE RATES
// ==========================================

import { relations } from "drizzle-orm";
import { serviceRates } from "./serviceRate";
import { suppliers } from "../supplier";
import { priceHistories } from "../priceHistories";

export const serviceRatesRelations = relations(serviceRates, ({ one, many }) => ({
    supplier: one(suppliers, {
        fields: [serviceRates.supplierId],
        references: [suppliers.id],
    }),

    priceHistories: many(priceHistories),
}));