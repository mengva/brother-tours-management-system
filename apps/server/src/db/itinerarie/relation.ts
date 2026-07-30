import { relations } from "drizzle-orm";
import { itineraries } from "./itinerarie";
import { enquiries } from "../enquirie";
import { images } from "../image";

export const itinerariesRelations = relations(itineraries, ({ one, many }) => ({
    enquiry: one(enquiries, {
        fields: [itineraries.enquiryId],
        references: [enquiries.id],
    }),

    images: many(images),
}));