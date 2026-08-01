"use client";

import { useState } from "react";
import HeroSectionHomePage from "./components/HeroSectionHome";
import PopularDestinationHomePage from "./components/PopularDestinationHome";
import FeaturedTourHomePage from "./components/FeaturedTourHome";
import WhyChooseUsHomePage from "./components/WhyChooseUsHome";
import NewsLetterCTAHomePage from "./components/NewsLetterCTAHome";

export default function HomePage() {
    const [category, setCategory] = useState("all");

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">

            {/* ==================== 1. HERO SECTION ==================== */}
            <HeroSectionHomePage />

            {/* ==================== 2. POPULAR DESTINATIONS ==================== */}

            <PopularDestinationHomePage />


            {/* ==================== 3. FEATURED TOURS ==================== */}

            <FeaturedTourHomePage />

            {/* ==================== 4. WHY CHOOSE US ==================== */}

            <WhyChooseUsHomePage />


            {/* ==================== 5. NEWSLETTER CTA ==================== */}
            <NewsLetterCTAHomePage />

        </div>
    );
}