import { relations } from "drizzle-orm";
import { bookings } from "./booking";
import { users } from "../user";
import { customers } from "../customer";
import { enquiries } from "../enquirie";
import { images } from "../image";

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
    customer: one(customers, {
        fields: [bookings.customerId],
        references: [customers.id],
    }),

    assignedStaff: one(users, {
        fields: [bookings.assignedStaffId],
        references: [users.id],
    }),

    enquiry: one(enquiries, {
        fields: [bookings.enquiryId],
        references: [enquiries.id],
    }),

    images: many(images),
}));