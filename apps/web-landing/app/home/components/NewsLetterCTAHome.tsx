import React from 'react'

export default function NewsLetterCTAHomePage() {
    return (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-700 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
                <div className="space-y-2 max-w-xl text-center md:text-left z-10">
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                        Get Special Discounts & Travel Tips
                    </h3>
                    <p className="text-emerald-100 text-xs sm:text-sm">
                        Subscribe to our newsletter to receive secret deals and curated Laos travel itineraries directly in your inbox.
                    </p>
                </div>

                <form className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 z-10">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full sm:w-72 px-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl text-xs sm:text-sm text-white placeholder:text-emerald-200/70 focus:outline-none focus:bg-white/20 transition-all"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all whitespace-nowrap active:scale-95"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    )
}
