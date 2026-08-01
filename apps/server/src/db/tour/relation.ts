import { relations } from "drizzle-orm";
import { tours } from "./tour";
import { images } from "../image";
import { enquiries } from "../enquirie";
import { bookings } from "../booking";
import { tourCategories } from "../tourCategories";
import { tourItineraries } from "../tourItineraries";

export const toursRelations = relations(tours, ({ one, many }) => ({
    category: one(tourCategories, {
        fields: [tours.categoryId],
        references: [tourCategories.id],
    }),
    tourItineraries: many(tourItineraries),
    images: many(images),
    enquiries: many(enquiries),
    bookings: many(bookings),
}));