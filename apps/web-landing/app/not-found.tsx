import Link from "next/link";
import { Compass, Home, ArrowLeft, Search, MapPinOff } from "lucide-react";
import BrotherTourLogoCom from "@/components/brother-tour-logo";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between font-sans antialiased selection:bg-emerald-500 selection:text-white relative overflow-hidden">
            {/* Background Decorative Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-125 w-125 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Mini Header */}
            <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between relative z-10">
                <Link href="/" className="flex items-center gap-2 group">
                    <BrotherTourLogoCom width={70} height={70} />

                    <span className="text-xl font-black tracking-tight text-white">
                        LAO<span className="text-emerald-400">TRAVEL</span>
                    </span>
                </Link>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-6 py-12 text-center relative z-10 flex flex-col items-center my-auto space-y-8">
                {/* Floating Icon Badge */}
                <div className="relative">
                    <div className="w-24 h-24 rounded-3xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center shadow-2xl backdrop-blur-md">
                        <MapPinOff className="w-12 h-12 text-emerald-400 animate-bounce" />
                    </div>
                    <span className="absolute -top-2 -right-2 px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-full shadow-lg">
                        404
                    </span>
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
                        Looks like you're <span className="text-emerald-400">lost!</span>
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                        The page or tour destination you are searching for doesn't exist, has been moved, or is temporarily unavailable.
                    </p>
                </div>

                {/* Quick Search Input */}
                <div className="w-full max-w-md">
                    <form action="/tours" className="relative flex items-center">
                        <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                        <input
                            type="text"
                            name="q"
                            placeholder="Search for tours or destinations..."
                            className="w-full pl-11 pr-24 py-3.5 bg-slate-800/90 border border-slate-700 text-sm font-medium rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <Link
                        href="/"
                        className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Home className="w-4 h-4" />
                        <span>Back to Homepage</span>
                    </Link>
                    <Link
                        href="/tours"
                        className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Explore Tour Packages</span>
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-xs text-slate-500 relative z-10 border-t border-slate-800/50">
                <p>© {new Date().getFullYear()} Lao Travel Co., Ltd. All rights reserved.</p>
            </footer>
        </div>
    );
}