
// ==========================================
// SUPPLIER AVAILABILITY
// ==========================================

import { relations } from "drizzle-orm";
import { supplierAvailability } from "./supplierAvailability";
import { suppliers } from "../supplier";

export const supplierAvailabilityRelations = relations(supplierAvailability, ({ one }) => ({
    supplier: one(suppliers, {
        fields: [supplierAvailability.supplierId],
        references: [suppliers.id],
    }),
}));