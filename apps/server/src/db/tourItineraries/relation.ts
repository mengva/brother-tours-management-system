import { relations } from "drizzle-orm";
import { tours } from "../tour";
import { tourItineraries } from "./tourItinerary";

export const tourItinerariesRelations = relations(tourItineraries, ({ one }) => ({
    tour: one(tours, {
        fields: [tourItineraries.tourId],
        references: [tours.id],
    }),
}));