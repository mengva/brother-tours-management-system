import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { tours } from "../tour";

// --- Table (Tour Itineraries) ---
export const tourItineraries = pgTable('tour_itineraries', {
    id: uuid('id').defaultRandom().primaryKey(),
    tourId: uuid('tour_id').references(() => tours.id, { onDelete: 'cascade' }).notNull(),
    dayNumber: integer('day_number').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    meals: text('meals'), // e.g. "B, L, D"
    accommodation: text('accommodation'),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, table => [
    index("tour_itineraries_tour_id_idx").on(table.tourId),
]);