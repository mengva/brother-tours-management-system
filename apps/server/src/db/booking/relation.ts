import { relations } from "drizzle-orm";
import { bookings } from "./booking";
import { users } from "../user";
import { customers } from "../customer";
import { enquiries } from "../enquirie";
import { images } from "../image";
import { tours } from "../tour";

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
    customer: one(customers, {
        fields: [bookings.customerId],
        references: [customers.id],
    }),
    tour: one(tours, {
        fields: [bookings.tourId],
        references: [tours.id],
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