import { Award, Headphones, ShieldCheck } from 'lucide-react'
import React from 'react'

function WhyChooseUsHomePage() {
    return (
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest">
                        Why Lao Travel
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        We Provide Authentic & Hassle-Free Travel Services
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        We specialize in providing high-quality custom tour itineraries, private transport, and local guide services across all major provinces in Laos.
                    </p>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-slate-900">Verified Local Experts</h4>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Our team consists of experienced local guides with deep knowledge of Laotian history and traditions.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-slate-900">Secure & Flexible Booking</h4>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Easy cancellation policies and transparent pricing without hidden booking fees.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <Headphones className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-slate-900">24/7 On-Trip Support</h4>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Our local team is always available via WhatsApp or phone throughout your journey.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="rounded-3xl overflow-hidden shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1000&q=80"
                            alt="Traveler enjoying Laos"
                            className="w-full h-[480px] object-cover"
                        />
                    </div>
                    {/* Overlay Stat Box */}
                    <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl">
                            ★
                        </div>
                        <div>
                            <p className="text-xl font-black text-slate-900">10,000+</p>
                            <p className="text-xs font-medium text-slate-500">Happy Travelers Served</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WhyChooseUsHomePage
