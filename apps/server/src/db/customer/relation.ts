import { relations } from "drizzle-orm";
import { customers } from "./customer";
import { users } from "../user";
import { bookings } from "../booking";
import { enquiries } from "../enquirie";

export const customersRelations = relations(customers, ({ one, many }) => ({
    user: one(users, {
        fields: [customers.userId],
        references: [users.id],
    }),

    enquiries: many(enquiries),
    bookings: many(bookings),
}));
