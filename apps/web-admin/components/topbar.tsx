"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Bell, LogOut, User, Moon, Sun, Monitor, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";


export default function TopbarPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isOpenDialogSignOut, setIsOpenDialogSignOut] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <header className="flex sticky top-0 z-30 h-16 items-center justify-between border-b bg-background px-6">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <h1 className="text-xl font-semibold">Administrator</h1>
                </div>

                <div className="flex items-center gap-3">
                    {/* === Theme Toggle === */}
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className="rounded-full cursor-pointer">
                                {theme === "dark" ? (
                                    <Moon className="h-5 w-5" />
                                ) : theme === "light" ? (
                                    <Sun className="h-5 w-5" />
                                ) : (
                                    <Monitor className="h-5 w-5" />
                                )}
                                {/* <span className="sr-only">Toggle theme</span> */}
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                                <Sun className="mr-2 h-4 w-4" />
                                <span>light</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                                <Moon className="mr-2 h-4 w-4" />
                                <span>dark</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                                <Monitor className="mr-2 h-4 w-4" />
                                <span>system</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* === User Menu with Language Switcher === */}
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar className="h-9 w-9 cursor-pointer">
                                <AvatarImage src="" />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={() => setIsOpenDialogSignOut(true)}
                                className="cursor-pointer text-destructive focus:text-destructive"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>signOut</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {/* === Sign Out Dialog === */}
            <Dialog open={isOpenDialogSignOut} onOpenChange={(open) => setIsOpenDialogSignOut(open)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Sign Out</DialogTitle>
                        <DialogDescription>Are you sure you want to sign out of the admin dashboard?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-2">
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                        >
                            Canceled
                        </Button>
                        <Button
                            variant="destructive"
                            className="cursor-pointer"
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}