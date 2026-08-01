export interface NavItem {
    label: string;
    href: string;
    badge?: string;
    isExternal?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
    { label: "Home", href: "/home" },
    { label: "Tour Packages", href: "/tours", badge: "HOT" },
    { label: "Custom Tour", href: "/tours/custom" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
];