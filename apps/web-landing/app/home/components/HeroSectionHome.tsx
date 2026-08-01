"use client"

import { Calendar, MapPin, Search, Sparkles, Users } from 'lucide-react'
import React, { useState } from 'react'

function HeroSectionHomePage() {
    const [destination, setDestination] = useState("");
    return (
        <div>
            {/* ==================== 1. HERO SECTION ==================== */}
            <section className="relative bg-slate-900 text-white min-h-[85vh] flex items-center justify-center overflow-hidden pt-12 pb-24">
                {/* Background Image / Gradient Glows */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1540611025311-01df3cef54b5?auto=format&fit=crop&w=1920&q=80"
                        alt="Laos Landscape Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-0" />

                <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 text-center space-y-8">
                    {/* Top Tagline Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md text-emerald-400 text-xs sm:text-sm font-bold tracking-wide">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Discover Unseen Wonders in Laos</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
                        Experience the Authentic Beauty of <span className="text-emerald-400">Laos</span>
                    </h1>

                    <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        From ancient UNESCO temples in Luang Prabang to thrilling river adventures in Vang Vieng. Plan and book your dream tour effortlessly.
                    </p>

                    {/* Search / Booking Floating Card */}
                    <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-2xl text-slate-800 border border-slate-100">
                        <form action="/tours" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

                            {/* Destination Input */}
                            <div className="flex flex-col text-left px-3 py-2 bg-slate-100/80 rounded-2xl border border-slate-200/60 focus-within:border-emerald-500 transition-colors">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Destination
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Luang Prabang"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none mt-1"
                                />
                            </div>

                            {/* Date Input */}
                            <div className="flex flex-col text-left px-3 py-2 bg-slate-100/80 rounded-2xl border border-slate-200/60 focus-within:border-emerald-500 transition-colors">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Date
                                </label>
                                <input
                                    type="date"
                                    className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none mt-1 cursor-pointer"
                                />
                            </div>

                            {/* Guests Selector */}
                            <div className="flex flex-col text-left px-3 py-2 bg-slate-100/80 rounded-2xl border border-slate-200/60 focus-within:border-emerald-500 transition-colors">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5 text-emerald-600" /> Guests
                                </label>
                                <select className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none mt-1 cursor-pointer">
                                    <option value="1">1 Person</option>
                                    <option value="2">2 Persons</option>
                                    <option value="3-5">3 - 5 Persons</option>
                                    <option value="6+">6+ Group Tour</option>
                                </select>
                            </div>

                            {/* Search Button */}
                            <button
                                type="submit"
                                className="h-full py-3 sm:py-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                            >
                                <Search className="w-4 h-4" />
                                <span>Find Tours</span>
                            </button>

                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HeroSectionHomePage
