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
    "TourBanner",       // image Banner tour
    "TourGallery",      // image Gallery tour
    "CategoryIcon",     // image/Icon tour category

    // --- Booking, Financial & Sales ---
    "PaymentSlip",      // image Slip deposit payment
    "FullPaymentSlip",  // image Slip full payment
    "FinalBalanceSlip",  // image Slip final balance payment
    "Contract",          // image Contract booking/supplier
    "Itinerary",         // image Itinerary travel plan

    // --- Supplier & Accommodation ---
    "Room",              // image Room accommodation
    "Vehicle",           // image Vehicle transportation
    "Activity",          // image Activity tour

    // --- Fallback ---
    "Other"
]);
