import { relations } from "drizzle-orm";
import { users } from "./user";
import { userCredentials } from "../credential";
import { suppliers } from "../supplier";
import { images } from "../image";
import { enquiries } from "../enquirie";
import { bookings } from "../booking";
import { priceHistories } from "../priceHistories";
import { invoices } from "../invoices";
import { payments } from "../payment";

export const usersRelations = relations(users, ({ one, many }) => ({
    credentials: one(userCredentials, {
        fields: [users.id],
        references: [userCredentials.userId],
    }),
    createdSuppliers: many(suppliers, { relationName: "staff_created_suppliers" }),
    supplierProfile: one(suppliers, {
        fields: [users.id],
        references: [suppliers.userId],
        relationName: "supplier_user_account",
    }),
    images: many(images),
    assignedEnquiries: many(enquiries),
    assignedBookings: many(bookings),
    issuedInvoices: many(invoices, { relationName: 'staff_issued_invoices' }),
    payments: many(payments),
    priceChanges: many(priceHistories),
}));