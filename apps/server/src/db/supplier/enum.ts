import { pgEnum } from "drizzle-orm/pg-core";

export const supplierTypeEnum = pgEnum('supplier_type', [
    'Hotel',
    'Guide',
    'Driver',
    'Boat',
    'Restaurant',
    'Activity',
]);