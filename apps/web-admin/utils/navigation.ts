import { IconType } from "react-icons";

// -------------------- Types --------------------
export type NavChild = {
    name: string;
    href: string;
    icon: IconType;
    isActive: boolean;
};

export type NavItem = {
    name: string;
    href: string;
    icon: IconType;
    isActive: boolean;
    children: NavChild[];
};


import {
    LucideLayoutDashboard,
    LucideCalendarCheck,
    LucideMessageSquare,
    LucideFileText,
    LucideCompass,
    LucideMapPin,
    LucideBuilding2,
    LucideDollarSign,
    LucideHistory,
    LucideUsers,
    LucideUserCheck,
    LucideSettings,
    LucideFolderTree,
} from "lucide-react";

export const adminNavigation = [
    // Dashboard
    {
        name: "Dashboard",
        href: "/admin/dashboard",
        icon: LucideLayoutDashboard,
        isActive: false,
        children: [],
    },

    // 1. Operations
    {
        name: "Operations",
        href: "/admin/operations",
        icon: LucideCalendarCheck,
        isActive: false,
        children: [
            {
                name: "Enquiries",
                href: "/admin/operations/enquiries",
                icon: LucideMessageSquare,
                isActive: false,
            },
            {
                name: "Quotations",
                href: "/admin/operations/quotations",
                icon: LucideFileText,
                isActive: false,
            },
            {
                name: "Bookings",
                href: "/admin/operations/bookings",
                icon: LucideCalendarCheck,
                isActive: false,
            },
        ],
    },

    // 2. Tours Management
    {
        name: "Tours Management",
        href: "/admin/tours-management",
        icon: LucideCompass,
        isActive: false,
        children: [
            {
                name: "Tour Packages",
                href: "/admin/tours-management/tours",
                icon: LucideCompass,
                isActive: false,
            },
            {
                name: "Categories", //  ເພີ່ມ Tour Categories
                href: "/admin/tours-management/categories",
                icon: LucideFolderTree,
                isActive: false,
            },
            {
                name: "Destinations",
                href: "/admin/tours-management/destinations",
                icon: LucideMapPin,
                isActive: false,
            },
        ],
    },

    // 3. Suppliers & Costs
    {
        name: "Suppliers & Costs",
        href: "/admin/suppliers-management",
        icon: LucideBuilding2,
        isActive: false,
        children: [
            {
                name: "Suppliers",
                href: "/admin/suppliers-management/suppliers",
                icon: LucideBuilding2,
                isActive: false,
            },
            {
                name: "Service Rates",
                href: "/admin/suppliers-management/service-rates",
                icon: LucideDollarSign,
                isActive: false,
            },
            {
                name: "Price Audit Logs",
                href: "/admin/suppliers-management/price-audits",
                icon: LucideHistory,
                isActive: false,
            },
        ],
    },

    // 4. User Management
    {
        name: "User Management",
        href: "/admin/users-management",
        icon: LucideUsers,
        isActive: false,
        children: [
            {
                name: "Customers",
                href: "/admin/users-management/customers",
                icon: LucideUserCheck,
                isActive: false,
            },
            {
                name: "System Users",
                href: "/admin/users-management/users",
                icon: LucideUsers,
                isActive: false,
            },
        ],
    },

    // 5. System Settings
    {
        name: "System Settings",
        href: "/admin/settings",
        icon: LucideSettings,
        isActive: false,
        children: [],
    },
];