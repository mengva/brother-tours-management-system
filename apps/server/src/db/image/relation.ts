import { relations } from "drizzle-orm";
import { images } from "./image";
import { users } from "../user";
import { bookings } from "../booking";
import { suppliers } from "../supplier";
import { itineraries } from "../itinerarie";

export const imagesRelations = relations(images, ({ one }) => ({
    user: one(users, {
        fields: [images.userId],
        references: [users.id],
    }),

    supplier: one(suppliers, {
        fields: [images.supplierId],
        references: [suppliers.id],
    }),

    itinerary: one(itineraries, {
        fields: [images.itineraryId],
        references: [itineraries.id],
    }),

    booking: one(bookings, {
        fields: [images.bookingId],
        references: [bookings.id],
    }),
}));