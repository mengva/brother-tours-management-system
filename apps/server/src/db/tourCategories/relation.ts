import { relations } from "drizzle-orm";
import { images } from "../image";
import { tourCategories } from "./tourCategory";
import { tours } from "../tour";

export const tourCategoriesRelations = relations(tourCategories, ({ many, one }) => ({
    tours: many(tours),
    images: many(images),
}));