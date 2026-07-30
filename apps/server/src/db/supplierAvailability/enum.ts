import { pgEnum } from "drizzle-orm/pg-core";

export const availabilityStatusEnum = pgEnum('availability_status', [
    'Available',
    'Limited',
    'Unavailable',
]);