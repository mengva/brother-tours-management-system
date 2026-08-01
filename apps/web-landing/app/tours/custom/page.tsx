"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Compass,
    MapPin,
    Calendar,
    Users,
    DollarSign,
    Send,
    AlertCircle,
    CheckCircle2,
    Sparkles,
    Plane,
    Luggage,
} from "lucide-react";

const customTourSchema = z.object({
    fullName: z
        .string()
        .min(1, { message: "Full name is required" })
        .min(2, { message: "Name must be at least 2 characters" }),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
    phone: z.string().min(1, { message: "Phone / WhatsApp number is required" }),
    travelDate: z.string().min(1, { message: "Travel date is required" }),
    durationDays: z.coerce
        .number()
        .min(1, { message: "Duration must be at least 1 day" }),
    guestsCount: z.coerce
        .number()
        .min(1, { message: "At least 1 guest is required" }),
    budgetPerPerson: z.string().min(1, { message: "Please select a budget range" }),
    selectedDestinations: z
        .array(z.string())
        .min(1, { message: "Select at least one destination" }),
    interests: z.array(z.string()),
    notes: z.string().optional(),
});

type CustomTourFormValues = z.infer<typeof customTourSchema>;

export default function CustomTourPage() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const availableDestinations = [
        "Luang Prabang",
        "Vang Vieng",
        "Vientiane",
        "Champasak (Wat Phou)",
        "Si Phan Don (4,000 Islands)",
        "Xieng Khouang (Plain of Jars)",
        "Nong Khiaw",
        "Bokeo (Gibbon Experience)",
    ];

    const interestOptions = [
        "Culture & Temples",
        "Nature & Hiking",
        "Water Sports & Kayaking",
        "Food & Cooking Class",
        "Photography",
        "Relaxation & Wellness",
    ];

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CustomTourFormValues>({
        resolver: zodResolver(customTourSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            travelDate: "",
            durationDays: 3,
            guestsCount: 2,
            budgetPerPerson: "$300 - $600",
            selectedDestinations: [],
            interests: [],
            notes: "",
        },
    });

    const selectedDestinations = watch("selectedDestinations") || [];
    const selectedInterests = watch("interests") || [];

    const toggleDestination = (destination: string) => {
        if (selectedDestinations.includes(destination)) {
            setValue(
                "selectedDestinations",
                selectedDestinations.filter((item) => item !== destination),
                { shouldValidate: true }
            );
        } else {
            setValue("selectedDestinations", [...selectedDestinations, destination], {
                shouldValidate: true,
            });
        }
    };

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setValue(
                "interests",
                selectedInterests.filter((item) => item !== interest)
            );
        } else {
            setValue("interests", [...selectedInterests, interest]);
        }
    };

    const onSubmit = async (data: CustomTourFormValues) => {
        setServerError(null);
        setIsSuccess(false);

        try {
            // Simulate submission API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log("Custom Tour Request Submitted:", data);
            setIsSuccess(true);
            reset({
                fullName: "",
                email: "",
                phone: "",
                travelDate: "",
                durationDays: 3,
                guestsCount: 2,
                budgetPerPerson: "$300 - $600",
                selectedDestinations: [],
                interests: [],
                notes: "",
            });
        } catch (err) {
            setServerError("Failed to send custom request. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
            {/* ==================== HERO HEADER ==================== */}
            <section className="bg-slate-900 text-white py-16 sm:py-20 text-center px-4 relative overflow-hidden">
                <div className="max-w-3xl mx-auto space-y-3 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Tailor-Made Experience</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Design Your Dream <span className="text-emerald-400">Laos Tour</span>
                    </h1>
                    <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
                        Tell us your preferences and our local travel specialists will craft a personalized itinerary just for you within 24 hours.
                    </p>
                </div>
            </section>

            {/* ==================== FORM SECTION ==================== */}
            <section className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-8">
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-lg space-y-8">

                    {serverError && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-2.5 text-xs font-medium text-rose-600">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{serverError}</span>
                        </div>
                    )}

                    {isSuccess && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2.5 text-xs font-medium text-emerald-700">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>
                                Your custom tour request has been submitted! Our travel team will contact you shortly with a customized plan.
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>

                        {/* STEP 1: DESTINATIONS */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                <MapPin className="w-5 h-5 text-emerald-600" />
                                <h3 className="text-base font-bold text-slate-900">
                                    1. Where would you like to go? *
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                                {availableDestinations.map((dest) => {
                                    const isSelected = selectedDestinations.includes(dest);
                                    return (
                                        <button
                                            key={dest}
                                            type="button"
                                            onClick={() => toggleDestination(dest)}
                                            className={`p-3 rounded-2xl text-xs font-semibold text-left transition-all border ${isSelected
                                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                                                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                                }`}
                                        >
                                            {dest}
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.selectedDestinations && (
                                <p className="text-[11px] font-medium text-rose-500">
                                    {errors.selectedDestinations.message}
                                </p>
                            )}
                        </div>

                        {/* STEP 2: TRIP DETAILS */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                <Calendar className="w-5 h-5 text-emerald-600" />
                                <h3 className="text-base font-bold text-slate-900">
                                    2. Trip Details
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Travel Date */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Expected Date *</label>
                                    <input
                                        type="date"
                                        {...register("travelDate")}
                                        className={`w-full px-4 py-3 bg-slate-50 border text-xs font-medium rounded-2xl text-slate-900 focus:outline-none transition-colors ${errors.travelDate ? "border-rose-500" : "border-slate-200 focus:border-emerald-500"
                                            }`}
                                    />
                                    {errors.travelDate && (
                                        <p className="text-[11px] font-medium text-rose-500">{errors.travelDate.message}</p>
                                    )}
                                </div>

                                {/* Duration */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Duration (Days) *</label>
                                    <input
                                        type="number"
                                        min={1}
                                        {...register("durationDays")}
                                        className={`w-full px-4 py-3 bg-slate-50 border text-xs font-medium rounded-2xl text-slate-900 focus:outline-none transition-colors ${errors.durationDays ? "border-rose-500" : "border-slate-200 focus:border-emerald-500"
                                            }`}
                                    />
                                    {errors.durationDays && (
                                        <p className="text-[11px] font-medium text-rose-500">{errors.durationDays.message}</p>
                                    )}
                                </div>

                                {/* Number of Guests */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Guests Count *</label>
                                    <input
                                        type="number"
                                        min={1}
                                        {...register("guestsCount")}
                                        className={`w-full px-4 py-3 bg-slate-50 border text-xs font-medium rounded-2xl text-slate-900 focus:outline-none transition-colors ${errors.guestsCount ? "border-rose-500" : "border-slate-200 focus:border-emerald-500"
                                            }`}
                                    />
                                    {errors.guestsCount && (
                                        <p className="text-[11px] font-medium text-rose-500">{errors.guestsCount.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Budget Range */}
                            <div className="space-y-1 pt-2">
                                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Estimated Budget per Person
                                </label>
                                <select
                                    {...register("budgetPerPerson")}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 text-xs font-medium rounded-2xl text-slate-900 focus:outline-none transition-colors cursor-pointer"
                                >
                                    <option value="Under $300">Budget (Under $300)</option>
                                    <option value="$300 - $600">Standard ($300 - $600)</option>
                                    <option value="$600 - $1,200">Comfort ($600 - $1,200)</option>
                                    <option value="$1,200+">Luxury ($1,200+)</option>
                                </select>
                            </div>
                        </div>

                        {/* STEP 3: PREFERENCES & INTERESTS */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                <Luggage className="w-5 h-5 text-emerald-600" />
                                <h3 className="text-base font-bold text-slate-900">
                                    3. Travel Style & Interests
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                                {interestOptions.map((item) => {
                                    const isSelected = selectedInterests.includes(item);
                                    return (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => toggleInterest(item)}
                                            className={`p-3 rounded-2xl text-xs font-semibold text-left transition-all border ${isSelected
                                                    ? "bg-slate-900 text-white border-slate-900"
                                                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* STEP 4: CONTACT INFORMATION */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                <Users className="w-5 h-5 text-emerald-600" />
                                <h3 className="text-base font-bold text-slate-900">
                                    4. Your Contact Information
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        {...register("fullName")}
                                        className={`w-full px-4 py-3 bg-slate-50 border text-xs font-medium rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors ${errors.fullName ? "border-rose-500" : "border-slate-200 focus:border-emerald-500"
                                            }`}
                                    />
                                    {errors.fullName && (
                                        <p className="text-[11px] font-medium text-rose-500">{errors.fullName.message}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        {...register("email")}
                                        className={`w-full px-4 py-3 bg-slate-50 border text-xs font-medium rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors ${errors.email ? "border-rose-500" : "border-slate-200 focus:border-emerald-500"
                                            }`}
                                    />
                                    {errors.email && (
                                        <p className="text-[11px] font-medium text-rose-500">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Phone / WhatsApp *</label>
                                    <input
                                        type="tel"
                                        placeholder="+856 20 5555 1234"
                                        {...register("phone")}
                                        className={`w-full px-4 py-3 bg-slate-50 border text-xs font-medium rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors ${errors.phone ? "border-rose-500" : "border-slate-200 focus:border-emerald-500"
                                            }`}
                                    />
                                    {errors.phone && (
                                        <p className="text-[11px] font-medium text-rose-500">{errors.phone.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Special Requests */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700">Additional Notes / Special Requests</label>
                                <textarea
                                    rows={4}
                                    placeholder="Mention dietary requirements, preferred hotel standards, or specific activities..."
                                    {...register("notes")}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-emerald-500 text-xs font-medium rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full cursor-pointer py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/50 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Submit Custom Tour Request</span>
                                </>
                            )}
                        </button>

                    </form>
                </div>
            </section>
        </div>
    );
}