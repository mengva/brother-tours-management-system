import { relations } from "drizzle-orm";
import { users } from "../user";
import { images } from "../image";
import { serviceRates } from "../serviceRate";
import { supplierAvailability } from "../supplierAvailability";
import { suppliers } from "./supplier";

export const suppliersRelations = relations(suppliers, ({ one, many }) => ({
    // Staff member who created this record
    createdBy: one(users, {
        fields: [suppliers.createdById],
        references: [users.id],
        relationName: "staff_created_suppliers",
    }),

    // User account assigned to this supplier
    userAccount: one(users, {
        fields: [suppliers.userId],
        references: [users.id],
        relationName: "supplier_user_account",
    }),

    images: many(images),
    serviceRates: many(serviceRates),
    availability: many(supplierAvailability),
}));