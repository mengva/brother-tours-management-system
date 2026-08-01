import Link from "next/link";
import {
    Compass,
    ShieldCheck,
} from "lucide-react";
import { NAV_ITEMS } from "@/utils/navigation";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareInstagram } from "react-icons/fa6";
import BrotherTourLogoCom from "./brother-tour-logo";

export default function FooterPage() {
    return (
        <div >
            {/* ==================== 3. FOOTER PAGE ==================== */}
            <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 pb-8 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

                        {/* Col 1: Brand Info */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center gap-2">
                               <BrotherTourLogoCom width={100} height={100} />
                                <span className="text-xl font-black text-white tracking-tight">
                                    LAO<span className="text-emerald-500">TRAVEL</span>
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                                Comprehensive travel services in Laos. We offer curated high-quality, safe tour packages to create the best memory for all travelers.
                            </p>
                            <div className="flex items-center gap-3">
                                <a href="#" className="p-2.5 rounded-full bg-slate-800 hover:bg-emerald-600 hover:text-white transition-all">
                                    <FaSquareFacebook className="w-4 h-4" />
                                </a>
                                <a href="#" className="p-2.5 rounded-full bg-slate-800 hover:bg-emerald-600 hover:text-white transition-all">
                                    <FaSquareInstagram className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Col 2: Quick Links */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Navigation</h4>
                            <ul className="space-y-2 text-xs font-medium">
                                {NAV_ITEMS.map((item) => (
                                    <li key={item.href}>
                                        <Link href={item.href} className="hover:text-emerald-400 transition-colors">
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Col 3: Popular Destinations */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Popular Cities</h4>
                            <ul className="space-y-2 text-xs font-medium">
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Luang Prabang Tours</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Vang Vieng Tours</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Champasak / 4,000 Islands</a></li>
                                <li><a href="#" className="hover:text-emerald-400 transition-colors">Vientiane Capital Tours</a></li>
                            </ul>
                        </div>

                        {/* Col 4: Trust & Contact */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Trust & Safety</h4>
                            <div className="space-y-2 text-xs text-slate-400">
                                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Licensed Tourism Operator</span>
                                </div>
                                <p>License No: 1082/TL.2025</p>
                                <p>BCEL OnePay / Bank Transfer Supported</p>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Copyright Bar */}
                    <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
                        <p>© {new Date().getFullYear()} Lao Travel Co., Ltd. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <a href="#" className="hover:text-slate-300">Terms of Service</a>
                            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}