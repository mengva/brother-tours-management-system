import { pgEnum } from "drizzle-orm/pg-core";

// ---------------- Enums ----------------
export const invoiceStatusEnum = pgEnum('invoice_status', [
    'Draft',     
    'Sent',       
    'Paid',     
    'Partially_Paid',
    'Overdue',    
    'Cancelled',
]);