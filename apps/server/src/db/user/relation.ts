import { relations } from "drizzle-orm";
import { users } from "./user";
import { userCredentials } from "../credential";
import { suppliers } from "../supplier";
import { images } from "../image";
import { enquiries } from "../enquirie";
import { bookings } from "../booking";
import { priceHistories } from "../priceHistories";

export const usersRelations = relations(users, ({ one, many }) => ({
    credentials: one(userCredentials, {
        fields: [users.id],
        references: [userCredentials.userId],
    }),

    // Staff user created many suppliers
    createdSuppliers: many(suppliers, { relationName: "staff_created_suppliers" }),

    // Supplier user profile
    supplierProfile: one(suppliers, {
        fields: [users.id],
        references: [suppliers.userId],
        relationName: "supplier_user_account",
    }),

    images: many(images),

    // staff assignments
    assignedEnquiries: many(enquiries),
    assignedBookings: many(bookings),

    priceChanges: many(priceHistories),
}));