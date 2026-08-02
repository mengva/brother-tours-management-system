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

export type UserRole = "Admin" | "Sales" | "Viewer";

export const adminNavigation = [
    // Dashboard
    {
        name: "Dashboard",
        href: "/admin/dashboard",
        icon: LucideLayoutDashboard,
        isActive: false,
        role: ["Admin", "Sales", "Viewer"],
        children: [],
    },

    // 1. Operations
    {
        name: "Operations",
        href: "/admin/operations",
        icon: LucideCalendarCheck,
        isActive: false,
        role: ["Admin", "Sales", "Viewer"],
        children: [
            {
                name: "Enquiries",
                href: "/admin/operations/enquiries",
                icon: LucideMessageSquare,
                isActive: false,
                role: ["Admin", "Sales", "Viewer"],
            },
            {
                name: "Quotations",
                href: "/admin/operations/quotations",
                icon: LucideFileText,
                isActive: false,
                role: ["Admin", "Sales", "Viewer"],
            },
            {
                name: "Bookings",
                href: "/admin/operations/bookings",
                icon: LucideCalendarCheck,
                isActive: false,
                role: ["Admin", "Sales", "Viewer"],
            },
        ],
    },

    // 2. Tours Management
    {
        name: "Tours Management",
        href: "/admin/tours-management",
        icon: LucideCompass,
        isActive: false,
        role: ["Admin", "Sales", "Viewer"],
        children: [
            {
                name: "Tour Packages",
                href: "/admin/tours-management/tours",
                icon: LucideCompass,
                isActive: false,
                role: ["Admin", "Sales", "Viewer"],
            },
            {
                name: "Categories", //  ເພີ່ມ Tour Categories
                href: "/admin/tours-management/categories",
                icon: LucideFolderTree,
                isActive: false,
                role: ["Admin", "Sales", "Viewer"],
            },
            {
                name: "Destinations",
                href: "/admin/tours-management/destinations",
                icon: LucideMapPin,
                isActive: false,
                role: ["Admin", "Sales", "Viewer"],
            },
        ],
    },

    // 3. Suppliers & Costs
    {
        name: "Suppliers & Costs",
        href: "/admin/suppliers-management",
        icon: LucideBuilding2,
        isActive: false,
        role: ["Admin", "Sales"],
        children: [
            {
                name: "Suppliers",
                href: "/admin/suppliers-management/suppliers",
                icon: LucideBuilding2,
                isActive: false,
                role: ["Admin", "Sales"],
            },
            {
                name: "Service Rates",
                href: "/admin/suppliers-management/service-rates",
                icon: LucideDollarSign,
                isActive: false,
                role: ["Admin", "Sales"],
            },
            {
                name: "Price Audit Logs",
                href: "/admin/suppliers-management/price-audits",
                icon: LucideHistory,
                isActive: false,
                role: ["Admin", "Sales"],
            },
        ],
    },

    // 4. User Management
    {
        name: "User Management",
        href: "/admin/users-management",
        icon: LucideUsers,
        isActive: false,
        role: ["Admin", "Sales"],
        children: [
            {
                name: "Customers",
                href: "/admin/users-management/customers",
                icon: LucideUserCheck,
                isActive: false,
                role: ["Admin", "Sales"],
            },
            {
                name: "System Users",
                href: "/admin/users-management/users",
                icon: LucideUsers,
                isActive: false,
                role: ["Admin", "Sales"],
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
        role: ["Admin"],
    },
];