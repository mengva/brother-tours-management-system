import { relations } from "drizzle-orm";
import { enquiries } from "./enquirie";
import { customers } from "../customer";
import { users } from "../user";
import { bookings } from "../booking";
import { itineraries } from "../itinerarie";

export const enquiriesRelations = relations(enquiries, ({ one, many }) => ({
    customer: one(customers, {
        fields: [enquiries.customerId],
        references: [customers.id],
    }),

    assignedStaff: one(users, {
        fields: [enquiries.assignedStaffId],
        references: [users.id],
    }),

    itineraries: many(itineraries),
    bookings: many(bookings),
}));