"use client"

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

function PopularDestinationHomePage() {

    const destinations = [
        {
            name: "Luang Prabang",
            toursCount: "24 Tours",
            image: "https://images.unsplash.com/photo-1540611025311-01df3cef54b5?auto=format&fit=crop&w=800&q=80",
            tag: "UNESCO World Heritage",
        },
        {
            name: "Vang Vieng",
            toursCount: "18 Tours",
            image: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80",
            tag: "Adventure & Nature",
        },
        {
            name: "Vientiane",
            toursCount: "15 Tours",
            image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
            tag: "Capital Culture",
        },
        {
            name: "Champasak & Si Phan Don",
            toursCount: "12 Tours",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            tag: "4,000 Islands",
        },
    ];

    return (
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest">
                        Top Locations
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mt-1">
                        Popular Destinations in Laos
                    </h2>
                </div>
                <Link
                    href="/tours"
                    className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                    <span>Explore all destinations</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {destinations.map((item, idx) => (
                    <Link
                        key={idx}
                        href={`/tours?destination=${encodeURIComponent(item.name)}`}
                        className="group relative h-80 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white font-bold text-[10px] rounded-full uppercase tracking-wider">
                                {item.tag}
                            </span>
                        </div>

                        <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                            <h3 className="text-xl font-bold tracking-tight">{item.name}</h3>
                            <p className="text-xs text-slate-300 font-medium">{item.toursCount}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default PopularDestinationHomePage;
