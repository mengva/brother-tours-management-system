import { pgEnum } from "drizzle-orm/pg-core";

export const imageTypeEnum = pgEnum("image_type", [
    // --- User & Identity Documents ---
    "Profile",
    "Cover",
    "Passport",
    "IdentityCard",
    "Census",
    "Document",

    // --- Booking, Financial & Sales (Project 1) ---
    "PaymentSlip",      // ໃບໂອນ/Slip ໂອນເງິນມັດຈຳ
    "Contract",          // ສັນຍາການຈອງ/ສັນຍາ Supplier
    "Itinerary",         // ຮູບສະຖານທີ່ທ່ອງທ່ຽວໃນແຜນການທົວ

    // --- Supplier & Accommodation (Project 2) ---
    "Room",              // ຮູບໂຮງແຮມ/ຮ້ອງພັກ
    "Vehicle",           // ຮູບລົດ/ເຮືອ/ພາຫະນະ
    "Activity",          // ຮູບກິດຈະກຳ

    // --- Fallback ---
    "Other"
]);