import {
    pgTable,
    text,
    timestamp,
    integer,
    uuid,
    index,
} from 'drizzle-orm/pg-core';
import { enquiries } from '../enquirie';

export const itineraries = pgTable('itineraries', {
    id: uuid('id').defaultRandom().primaryKey(),
    enquiryId: uuid('enquiry_id')
        .references(() => enquiries.id, { onDelete: 'cascade' })
        .notNull(),
    dayNumber: integer('day_number').notNull(), // Reorderable Sequence
    destination: text('destination').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    accommodation: text('accommodation'),
    meals: text('meals'), // e.g. "Breakfast, Lunch"
    activities: text('activities'),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, table => [
    index("itineraries_enquiry_id_idx").on(table.enquiryId),
]);