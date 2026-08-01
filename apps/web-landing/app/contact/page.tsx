"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    PhoneCall,
    Mail,
    MapPin,
    Clock,
    Send,
    AlertCircle,
    CheckCircle2,
    MessageSquare,
} from "lucide-react";

const contactSchema = z.object({
    fullName: z
        .string()
        .min(1, { message: "Full name is required" })
        .min(2, { message: "Name must be at least 2 characters" }),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
    phone: z.string().optional(),
    subject: z.string().min(1, { message: "Subject is required" }),
    message: z
        .string()
        .min(1, { message: "Message is required" })
        .min(10, { message: "Message must be at least 10 characters long" }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        },
    });

    const onSubmit = async (data: ContactFormValues) => {
        setServerError(null);
        setIsSuccess(false);

        try {
            // Simulate API submission
            await new Promise((resolve) => setTimeout(resolve, 1500));
            console.log("Contact Form Submitted:", data);
            setIsSuccess(true);
            reset();
        } catch (err) {
            setServerError("Failed to send message. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
            {/* ==================== HEADER ==================== */}
            <section className="bg-slate-900 text-white py-16 sm:py-20 text-center px-4">
                <div className="max-w-3xl mx-auto space-y-3">
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
                        Get In Touch
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        We’d Love to Hear From You
                    </h1>
                    <p className="text-slate-300 text-xs sm:text-sm">
                        Have a question about our tour packages or need a custom travel itinerary? Drop us a message below.
                    </p>
                </div>
            </section>

            {/* ==================== MAIN SECTION ==================== */}
            <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left Column: Contact Info Cards */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Our Office</h3>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Lane Xang Avenue, Chanthabouly District, Vientiane, Laos
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <PhoneCall className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Phone / WhatsApp</h3>
                                <p className="text-xs text-slate-500 mt-1">+856 20 5555 1234</p>
                                <p className="text-xs text-slate-500">+856 21 234 567</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Email Address</h3>
                                <p className="text-xs text-slate-500 mt-1">info@laostravel.la</p>
                                <p className="text-xs text-slate-500">support@laostravel.la</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Working Hours</h3>
                                <p className="text-xs text-slate-500 mt-1">Mon - Sat: 8:00 AM - 6:00 PM</p>
                                <p className="text-xs text-slate-500">Sunday: Closed (Online support 24/7)</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-6">
                        <div className="flex items-center gap-2 text-emerald-600">
                            <MessageSquare className="w-5 h-5" />
                            <h2 className="text-xl font-bold text-slate-900">Send us a Message</h2>
                        </div>

                        {/* Error Banner */}
                        {serverError && (
                            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-2.5 text-xs text-rose-600">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{serverError}</span>
                            </div>
                        )}

                        {/* Success Banner */}
                        {isSuccess && (
                            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-700">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span>Thank you! Your message has been sent successfully. We will reply within 24 hours.</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Full Name */}
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

                                {/* Email */}
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
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Phone */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Phone / WhatsApp (Optional)</label>
                                    <input
                                        type="tel"
                                        placeholder="+856 20 5555 1234"
                                        {...register("phone")}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 text-xs font-medium rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors"
                                    />
                                </div>

                                {/* Subject */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Subject *</label>
                                    <input
                                        type="text"
                                        placeholder="Custom Tour Inquiry"
                                        {...register("subject")}
                                        className={`w-full px-4 py-3 bg-slate-50 border text-xs font-medium rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors ${errors.subject ? "border-rose-500" : "border-slate-200 focus:border-emerald-500"
                                            }`}
                                    />
                                    {errors.subject && (
                                        <p className="text-[11px] font-medium text-rose-500">{errors.subject.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700">Message *</label>
                                <textarea
                                    rows={5}
                                    placeholder="Tell us about your travel plans, group size, or questions..."
                                    {...register("message")}
                                    className={`w-full p-4 bg-slate-50 border text-xs font-medium rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors ${errors.message ? "border-rose-500" : "border-slate-200 focus:border-emerald-500"
                                        }`}
                                />
                                {errors.message && (
                                    <p className="text-[11px] font-medium text-rose-500">{errors.message.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/50 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                            >
                                {isSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>

                        </form>
                    </div>

                </div>
            </section>
        </div>
    );
}