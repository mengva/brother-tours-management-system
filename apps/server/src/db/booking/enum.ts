import { pgEnum } from "drizzle-orm/pg-core";

export const paymentStatusEnum = pgEnum('payment_status', [
    'Unpaid',
    'DepositPaid',
    'FullyPaid',
    'Refunded',
]);