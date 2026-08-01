"use client";

import Link from "next/link";
import {
    Compass,
    Award,
    Users,
    ShieldCheck,
    Globe2,
    Heart,
    ArrowRight,
    Sparkles,
} from "lucide-react";

export default function AboutPage() {
    const stats = [
        { label: "Years of Experience", value: "10+" },
        { label: "Happy Travelers", value: "15,000+" },
        { label: "Verified Local Guides", value: "80+" },
        { label: "Tour Packages", value: "120+" },
    ];

    const teamMembers = [
        {
            name: "Sonephet Keomany",
            role: "Founder & Managing Director",
            image:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
        },
        {
            name: "Khamla Phommavong",
            role: "Head of Operations & Field Lead",
            image:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
        },
        {
            name: "Noy Sengchanh",
            role: "Lead Eco-Tourism Specialist",
            image:
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
            {/* ==================== HERO SECTION ==================== */}
            <section className="relative bg-slate-900 text-white py-20 sm:py-28 overflow-hidden">
                <div className="absolute inset-0 opacity-30 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1540611025311-01df3cef54b5?auto=format&fit=crop&w=1920&q=80"
                        alt="Laos Landscape"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Our Journey & Passion</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-3xl mx-auto">
                        Connecting Travelers with Authentic <span className="text-emerald-400">Laos</span>
                    </h1>
                    <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
                        We are dedicated to showcasing the natural beauty, rich culture, and serene landscapes of Laos through sustainable and memorable travel experiences.
                    </p>
                </div>
            </section>

            {/* ==================== STATS COUNTER ==================== */}
            <section className="-mt-10 relative z-20 max-w-6xl mx-auto px-4 sm:px-8">
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="space-y-1">
                            <p className="text-2xl sm:text-4xl font-black text-emerald-600">
                                {stat.value}
                            </p>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ==================== OUR STORY ==================== */}
            <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest">
                            Who We Are
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                            Rooted in Local Culture, Driven by Adventure
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            Founded in Vientiane, Lao Travel was born out of a passion to share the true essence of our home country. From the ancient temples of Luang Prabang to the tranquil waters of Si Phan Don (4,000 Islands), we craft journeys that preserve local heritage while supporting rural communities.
                        </p>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            Every itinerary is crafted by local experts who ensure safety, comfort, and deep immersion into Laotian hospitality.
                        </p>

                        <div className="pt-2">
                            <Link
                                href="/tours"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                            >
                                <span>Explore Our Tours</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-3xl overflow-hidden shadow-md h-64 sm:h-80">
                            <img
                                src="https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=600&q=80"
                                alt="Laos Nature"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="rounded-3xl overflow-hidden shadow-md h-64 sm:h-80 mt-8">
                            <img
                                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
                                alt="Laos Temple"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== OUR CORE VALUES ==================== */}
            <section className="py-16 bg-slate-100/80 border-y border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest">
                            Our Principles
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                            What Sets Us Apart
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <Globe2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Eco-Tourism First</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                We prioritize eco-friendly routes, minimize plastic waste, and respect wildlife habitats in every destination.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Community Support</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Over 70% of tour proceeds go directly to local guides, drivers, homestays, and village artisans.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Guaranteed Quality</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Licensed guides, well-maintained vehicles, and round-the-clock emergency assistance during your trip.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== TEAM SECTION ==================== */}
            <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest">
                        Meet the Team
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
                        The Faces Behind Lao Travel
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {teamMembers.map((member, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm text-center p-6 space-y-4"
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-28 h-28 mx-auto rounded-full object-cover shadow-md"
                            />
                            <div>
                                <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                                <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                                    {member.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}