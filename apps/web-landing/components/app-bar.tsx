"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    Menu,
    X,
    PhoneCall,
    Mail,
    Sparkles,
} from "lucide-react";
import { NAV_ITEMS } from "@/utils/navigation";
import BrotherTourLogoCom from "./brother-tour-logo";

export default function AppBarPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
            {/* 1. Top Mini Info Bar */}
            <div className="bg-emerald-700 text-white text-xs py-1.5 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <a
                            href="tel:+8562055551234"
                            className="flex items-center gap-1.5 whitespace-nowrap hover:text-amber-200 transition-colors"
                        >
                            <PhoneCall className="w-3.5 h-3.5" /> +856 20 5555 1234
                        </a>
                        <a
                            href="mailto:info@laostravel.la"
                            className="hidden sm:flex items-center gap-1.5 hover:text-amber-200 transition-colors"
                        >
                            <Mail className="w-3.5 h-3.5" /> info@laostravel.la
                        </a>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span className="truncate">Book today and get 10% off Luang Prabang tours</span>
                    </div>
                </div>
            </div>

            {/* 2. Main Navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <BrotherTourLogoCom width={100} height={100} />
                    <div>
                        <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                            LAO<span className="text-emerald-600">TRAVEL</span>
                        </span>
                        <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase -mt-1">
                            Tour & Adventure
                        </p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 group ${isActive
                                        ? "bg-emerald-600 text-white shadow-sm"
                                        : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                                    }`}
                            >
                                {item.label}
                                {item.badge && (
                                    <span
                                        className={`px-2 py-0.5 whitespace-nowrap text-[10px] font-bold rounded-full animate-pulse ${isActive
                                                ? "bg-amber-300 text-slate-900"
                                                : "bg-amber-500 text-white"
                                            }`}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Action Buttons */}
                <div className="hidden lg:flex items-center gap-3">
                    <Link
                        href="/auth/login"
                        className="px-4 py-2 text-sm whitespace-nowrap font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/tours"
                        className="px-5 py-2.5 whitespace-nowrap rounded-full text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                    >
                        Book Now
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    type="button"
                    aria-label="Toggle Mobile Menu"
                    aria-expanded={isMobileMenuOpen}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* 3. Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive
                                        ? "bg-emerald-600 text-white font-bold"
                                        : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-600"
                                    }`}
                            >
                                <span>{item.label}</span>
                                {item.badge && (
                                    <span
                                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${isActive
                                                ? "bg-amber-300 text-slate-900"
                                                : "bg-amber-500 text-white"
                                            }`}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}

                    <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                        <Link
                            href="/auth/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/tours"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full text-center py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-md"
                        >
                            Book Now
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}