import { pgEnum } from "drizzle-orm/pg-core";

export const unitTypeEnum = pgEnum('unit_type', [
    'PerPerson',
    'PerRoom',
    'PerVehicle',
    'PerDay',
    'PerGroup',
]);

export const currencyEnum = pgEnum('currency', [
    "USD",
    "LAK",
    "THB"
]);