"use client"

import { Clock, Heart, MapPin, Star } from 'lucide-react'
import React from 'react'

function FeaturedTourHomePage() {
    
    const featuredTours = [
        {
            id: 1,
            title: "Luang Prabang Cultural Heritage & Kuang Si Falls",
            location: "Luang Prabang",
            duration: "3 Days / 2 Nights",
            rating: 4.9,
            reviews: 128,
            price: "$220",
            image: "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?auto=format&fit=crop&w=800&q=80",
            badge: "Best Seller",
        },
        {
            id: 2,
            title: "Vang Vieng Nam Song River Kayaking & Hot Air Balloon",
            location: "Vang Vieng",
            duration: "2 Days / 1 Night",
            rating: 4.8,
            reviews: 94,
            price: "$165",
            image: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80",
            badge: "Popular",
        },
        {
            id: 3,
            title: "Southern Laos Wat Phou & 4,000 Islands Discovery",
            location: "Champasak",
            duration: "4 Days / 3 Nights",
            rating: 4.9,
            reviews: 76,
            price: "$340",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            badge: "Top Rated",
        },
    ];

    return (
        <section className="py-16 sm:py-24 bg-slate-100/70 border-y border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                    <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest">
                        Handpicked Packages
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                        Featured Tour Packages
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm">
                        Carefully curated travel experiences crafted by local tour guides
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredTours.map((tour) => (
                        <div
                            key={tour.id}
                            className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                        >
                            {/* Image & Badge */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={tour.image}
                                    alt={tour.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-amber-500 text-white font-black text-[10px] uppercase rounded-full shadow-md">
                                        {tour.badge}
                                    </span>
                                </div>
                                <button className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-600 hover:text-rose-500 transition-colors">
                                    <Heart className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Body Content */}
                            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span className="flex items-center gap-1 font-semibold text-slate-600">
                                            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {tour.location}
                                        </span>
                                        <span className="flex items-center gap-1 font-medium">
                                            <Clock className="w-3.5 h-3.5" /> {tour.duration}
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                        {tour.title}
                                    </h3>
                                </div>

                                {/* Rating & Price */}
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span className="text-xs font-bold text-slate-800">{tour.rating}</span>
                                        <span className="text-xs text-slate-400">({tour.reviews})</span>
                                    </div>

                                    <div>
                                        <span className="text-[10px] text-slate-400 block -mb-1">From</span>
                                        <span className="text-lg font-black text-emerald-600">{tour.price}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturedTourHomePage
