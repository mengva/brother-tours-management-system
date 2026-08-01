"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@workspace/ui/lib/utils";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";

import Image from "next/image";
import brotherToursLogo from "../public/images/brother_tours.png";
import { adminNavigation } from "@/utils/navigation";
import { ScrollArea } from "@workspace/ui/components/scroll-area";

export default function SidebarPage() {
    const pathname = usePathname();

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
        const initialState: Record<string, boolean> = {};

        adminNavigation.forEach((item) => {
            const isChildActive = item.children.some((child) =>
                pathname.startsWith(child.href)
            );

            item.isActive = isChildActive;
            initialState[item.name] = isChildActive;
        });

        return initialState;
    });

    function toggleMenu(name: string) {
        setOpenMenus((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    }

    return (
        <aside className="border-r bg-background h-screen sticky top-0 overflow-y-auto z-50">
            <div className="h-16 border-b flex items-center sticky top-0 z-20 bg-background">
                <div className="w-full flex justify-center items-center gap-2">
                    <Image src={brotherToursLogo} alt="Logo" width={65} height={65} priority/>
                    <h1 className="text-xl font-bold">
                        Brother Tours
                    </h1>
                </div>
            </div>

            <ScrollArea>
                <div className="p-4 space-y-2">

                    {adminNavigation.map((item) => {
                        const Icon = item.icon;

                        const isParentActive = pathname.startsWith(item.href);

                        // ------------------------------
                        // MENU WITHOUT CHILDREN
                        // ------------------------------
                        if (!item.children.length) {
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                                        isParentActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    <Icon className="size-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        }

                        // ------------------------------
                        // MENU WITH CHILDREN
                        // ------------------------------
                        return (
                            <Collapsible
                                key={item.name}
                                open={openMenus[item.name]}
                                onOpenChange={() => {
                                    toggleMenu(item.name);
                                }}
                            >
                                <CollapsibleTrigger className="w-full">
                                    <div
                                        className={cn(
                                            "w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all",
                                            isParentActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:bg-muted"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="size-5" />
                                            <span>{item.name}</span>
                                        </div>

                                        <ChevronDown
                                            className={cn(
                                                "size-4 transition-transform",
                                                openMenus[item.name] && "rotate-180"
                                            )}
                                        />
                                    </div>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="mt-1 space-y-1 pl-4">
                                    {item.children.map((child) => {
                                        const ChildIcon = child.icon;

                                        const isChildActive = pathname.includes(child.href);

                                        return (
                                            <Link
                                                key={child.name}
                                                href={child.href}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                                                    isChildActive
                                                        ? "bg-primary text-primary-foreground"
                                                        : "text-muted-foreground hover:bg-muted"
                                                )}
                                            >
                                                <ChildIcon className="size-4" />
                                                <span>{child.name}</span>
                                            </Link>
                                        );
                                    })}
                                </CollapsibleContent>
                            </Collapsible>
                        );
                    })}
                </div>
            </ScrollArea>
        </aside>
    );
}
