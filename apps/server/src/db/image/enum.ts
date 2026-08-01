import { pgEnum } from "drizzle-orm/pg-core";

export const imageTypeEnum = pgEnum("image_type", [
    // --- User & Identity Documents ---
    "Profile",
    "Cover",
    "Passport",
    "IdentityCard",
    "Census",
    "Document",

    // --- Tour & Marketing (New Features) ---
    "TourBanner",       // ຮູບ Banner ທົວ
    "TourGallery",      // ຮູບແກເລີຣີຂອງທົວ
    "CategoryIcon",     // ຮູບ/ໄອຄອນ ປະເພດທົວ

    // --- Booking, Financial & Sales ---
    "PaymentSlip",      // ໃບໂອນ/Slip ໂອນເງິນມັດຈຳ
    "Contract",          // ສັນຍາການຈອງ/ສັນຍາ Supplier
    "Itinerary",         // ຮູບສະຖານທີ່ທ່ອງທ່ຽວໃນແຜນການທົວ

    // --- Supplier & Accommodation ---
    "Room",              // ຮູບໂຮງແຮມ/ຮ້ອງພັກ
    "Vehicle",           // ຮູບລົດ/ເຮືອ/ພາຫະນະ
    "Activity",          // ຮູບກິດຈະກຳ

    // --- Fallback ---
    "Other"
]);