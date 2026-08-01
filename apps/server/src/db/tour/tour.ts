import {
    pgTable,
    text,
    varchar,
    timestamp,
    integer,
    numeric,
    boolean,
    uuid,
    index,
} from 'drizzle-orm/pg-core';
import { tourCategories } from '../tourCategories';
import { currencyEnum } from '../serviceRate';

// --- Table (Tour Packages / Master Tours) ---
export const tours = pgTable('tours', {
    id: uuid('id').defaultRandom().primaryKey(),
    categoryId: uuid('category_id').references(() => tourCategories.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    summary: text('summary'),
    description: text('description'),
    destination: varchar('destination', { length: 150 }).notNull(),
    durationDays: integer('duration_days').notNull(),
    durationNights: integer('duration_nights').notNull(),

    // ==================== Pricing Fields ( 🚀) ====================
    basePrice: numeric('base_price', { precision: 12, scale: 2 }).notNull(), // (Adult Price)
    childPrice: numeric('child_price', { precision: 12, scale: 2 }), //  (Optional)
    infantPrice: numeric('infant_price', { precision: 12, scale: 2 }), //  (Optional)

    discountPrice: numeric('discount_price', { precision: 12, scale: 2 }), //  / Promotion Price
    singleSupplementPrice: numeric('single_supplement_price', { precision: 12, scale: 2 }), // 
    costPrice: numeric('cost_price', { precision: 12, scale: 2 }), // 

    currency: currencyEnum("currency").notNull(), // USD, LAK, THB

    // Status flags
    isFeatured: boolean('is_featured').default(false).notNull(),
    isActive: boolean('is_active').default(true).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, table => [
    index("tours_category_id_idx").on(table.categoryId),
    index("tours_slug_idx").on(table.slug),
    index("tours_is_featured_idx").on(table.isFeatured),
]);