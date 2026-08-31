"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Compass,
    Search,
    MapPin,
    Clock,
    Star,
    Menu,
    X,
    PhoneCall,
    Mail,
    Heart,
    ChevronRight,
    Sparkles,
    ShieldCheck,
    Calendar,
} from "lucide-react";

// Mock Tours Data
const TOURS_DATA = [
    {
        id: "tour-1",
        title: "Luang Prabang 1-Day: Alms Giving, Pak Ou Caves & Kuang Si Falls",
        location: "Luang Prabang",
        duration: "1 Day Full Day",
        rating: 4.9,
        reviewsCount: 128,
        price: 450000,
        oldPrice: 550000,
        image: "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?q=80&w=800",
        badge: "Bestseller",
        category: "Nature & Culture",
    },
    {
        id: "tour-2",
        title: "Vang Vieng: Kayaking, Water Cave Tubing & Pha Ngern Viewpoint",
        location: "Vang Vieng",
        duration: "1 Day Full Day",
        rating: 4.8,
        reviewsCount: 94,
        price: 380000,
        oldPrice: 420000,
        image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=800",
        badge: "Popular",
        category: "Adventure",
    },
    {
        id: "tour-3",
        title: "4,000 Islands & Khone Phapheng Falls 3 Days 2 Nights",
        location: "Champasak",
        duration: "3 Days 2 Nights",
        rating: 4.95,
        reviewsCount: 65,
        price: 1850000,
        oldPrice: 2100000,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
        badge: "Recommended",
        category: "Relaxation",
    },
    {
        id: "tour-4",
        title: "Vientiane City Tour: That Luang, Patuxai & Wat Ho Phra Keo",
        location: "Vientiane",
        duration: "Half Day (08:30-12:00)",
        rating: 4.7,
        reviewsCount: 42,
        price: 250000,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
        badge: "Budget",
        category: "Culture",
    },
];

export default function ClientTourListPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Nature & Culture", "Adventure", "Relaxation", "Culture"];

    const filteredTours = TOURS_DATA.filter((tour) => {
        const matchesSearch =
            tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tour.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "All" || tour.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
            {/* ==================== 2. HERO SEARCH & LIST TOURS ==================== */}
            <main className="flex-1">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-b from-emerald-900 via-teal-900 to-slate-900 text-white py-16 px-4 sm:px-8 overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <Sparkles className="w-3.5 h-3.5" /> Discover the Best Travel Experiences in Laos
                        </span>
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                            Explore the Beauty of <span className="text-emerald-400">Laos</span>
                        </h1>
                        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
                            Book top-quality tour packages with professional tour guides and convenient transport services.
                        </p>

                        {/* Search Box */}
                        <div className="pt-4 max-w-2xl mx-auto">
                            <div className="p-2 bg-white rounded-2xl sm:rounded-full shadow-xl flex flex-col sm:flex-row items-center gap-2">
                                <div className="flex items-center gap-2 px-4 w-full text-slate-700">
                                    <Search className="w-5 h-5 text-emerald-600 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Search tours, cities, attractions (e.g., Luang Prabang, Kuang Si)..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full py-2 bg-transparent text-sm font-medium focus:outline-none text-slate-800 placeholder:text-slate-400"
                                    />
                                </div>
                                <button className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl sm:rounded-full font-bold text-sm transition-all shrink-0 flex items-center justify-center gap-2 shadow-md">
                                    <span>Search</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-8">
                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedCategory === cat
                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105"
                                        : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Tour Grid List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredTours.map((tour) => (
                            <div
                                key={tour.id}
                                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
                            >
                                {/* Image & Badge Header */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                    <img
                                        src={tour.image}
                                        alt={tour.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                                    {/* Top Badges */}
                                    <div className="absolute top-3 left-3 flex gap-1.5">
                                        <span className="px-2.5 py-1 text-[11px] font-extrabold bg-emerald-600 text-white rounded-lg shadow-sm">
                                            {tour.badge}
                                        </span>
                                    </div>

                                    <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-700 hover:text-rose-500 hover:bg-white transition-all shadow-sm">
                                        <Heart className="w-4 h-4" />
                                    </button>

                                    {/* Location overlay */}
                                    <div className="absolute bottom-3 left-3 text-white flex items-center gap-1 text-xs font-semibold">
                                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>{tour.location}</span>
                                    </div>
                                </div>

                                {/* Tour Info Body */}
                                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span className="flex items-center gap-1 font-medium">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                {tour.duration}
                                            </span>
                                            <span className="flex items-center gap-1 font-bold text-amber-500">
                                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                                {tour.rating} ({tour.reviewsCount})
                                            </span>
                                        </div>

                                        <h3 className="font-bold text-slate-800 text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors leading-snug">
                                            {tour.title}
                                        </h3>
                                    </div>

                                    {/* Price & Action */}
                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                        <div>
                                            {tour.oldPrice && (
                                                <span className="text-[11px] text-slate-400 line-through block -mb-1">
                                                    {tour.oldPrice.toLocaleString()} LAK
                                                </span>
                                            )}
                                            <div className="text-emerald-600 font-black text-lg font-mono">
                                                {tour.price.toLocaleString()}{" "}
                                                <span className="text-xs font-semibold text-slate-500 font-sans">LAK</span>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/tours/${tour.id}`}
                                            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1"
                                        >
                                            <span>Details</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}