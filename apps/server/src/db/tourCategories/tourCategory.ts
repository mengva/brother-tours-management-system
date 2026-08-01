import { index, boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// --- Table (Tour Categories) ---
export const tourCategories = pgTable('tour_categories', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull(), // e.g. "Cultural", "Adventure", "Relaxation"
    slug: varchar('slug', { length: 120 }).notNull().unique(), // e.g. "cultural-tours" ສຳລັບ URL
    description: text('description'),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, table => [
    index("tour_categories_slug_idx").on(table.slug),
]);