import {
    pgTable,
    text,
    varchar,
    timestamp,
    integer,
    numeric,
    boolean,
    pgEnum,
    uuid,
    index,
    date,
} from 'drizzle-orm/pg-core';
import { imageTypeEnum } from './enum';
import { users } from '../user';
import { bookings } from '../booking';
import { suppliers } from '../supplier';
import { itineraries } from '../itinerarie';

export const images = pgTable("images", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    supplierId: uuid("supplier_id").references(() => suppliers.id, { onDelete: "cascade" }),
    itineraryId: uuid("itinerary_id").references(() => itineraries.id, { onDelete: "cascade" }),
    bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    imageKey: text("image_key").notNull(),
    width: integer("width"),
    height: integer("height"),
    size: integer("size").notNull(),
    type: imageTypeEnum("type").default("Profile").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
}, (table) => [
    index("images_user_id_idx").on(table.userId),
    index("images_booking_id_idx").on(table.bookingId),
    index("images_itinerary_id_idx").on(table.itineraryId),
    index("images_supplier_id_idx").on(table.supplierId),
    index("images_type_idx").on(table.type),
]);
