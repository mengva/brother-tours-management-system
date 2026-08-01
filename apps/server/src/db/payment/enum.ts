import { pgEnum } from "drizzle-orm/pg-core";

export const paymentStatusEnum = pgEnum('payment_status', [
    'Unpaid',
    'Partially_Paid',
    'Paid',
    'Refunded',
]);

export const paymentTypeEnum = pgEnum('payment_type', [
    'Deposit',
    'Final_Balance',
    'Full_Payment',
    'Refund',
]);

export const paymentTxStatusEnum = pgEnum('payment_tx_status', [
    'Pending',
    'Success',
    'Failed',
    'Rejected',
]);