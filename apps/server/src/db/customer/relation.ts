import { relations } from "drizzle-orm";
import { customers } from "./customer";
import { users } from "../user";
import { bookings } from "../booking";
import { enquiries } from "../enquirie";
import { payments } from "../payment";
import { invoices } from "../invoices";


export const customersRelations = relations(customers, ({ one, many }) => ({
    user: one(users, {
        fields: [customers.userId],
        references: [users.id],
    }),
    enquiries: many(enquiries, { relationName: 'customer_enquiries' }),
    bookings: many(bookings, { relationName: 'customer_bookings' }),
    payments: many(payments, { relationName: 'customer_payments' }),
    invoices: many(invoices, { relationName: 'customer_invoices' }),
}));

