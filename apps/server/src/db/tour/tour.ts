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

export const tours = pgTable('tours', {
    id: uuid('id').defaultRandom().primaryKey(),
    categoryId: uuid('category_id').references(() => tourCategories.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(), // URL-friendly (e.g. "luang-prabang-3d2n")
    summary: text('summary'), // ສັງເຂບຫຍໍ້ສຳລັບ Card ໃນ Landing Page
    description: text('description'), // ລາຍລະອຽດເຕັມ
    destination: varchar('destination', { length: 150 }).notNull(), // e.g. "Luang Prabang", "Vang Vieng"
    durationDays: integer('duration_days').notNull(),
    durationNights: integer('duration_nights').notNull(),

    // Pricing
    basePrice: numeric('base_price', { precision: 12, scale: 2 }).notNull(), // ລາຄາເລີ່ມຕົ້ນ
    currency: varchar('currency', { length: 3 }).default('USD').notNull(),

    // Status flags
    isFeatured: boolean('is_featured').default(false).notNull(), // ໂຊໃນ Hero/Recommended Section ຂອງ Landing Page
    isActive: boolean('is_active').default(true).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, table => [
    index("tours_category_id_idx").on(table.categoryId),
    index("tours_slug_idx").on(table.slug),
    index("tours_is_featured_idx").on(table.isFeatured),
]);