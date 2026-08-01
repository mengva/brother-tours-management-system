"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Compass,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    LogIn,
} from "lucide-react";
import BrotherTourLogoCom from "@/components/brother-tour-logo";

// Define Validation Schema using Zod
const signInSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .min(6, { message: "Password must be at least 6 characters" }),
    rememberMe: z.boolean().optional(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    // Initialize React Hook Form with Zod validation
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    // Form Submit Handler
    const onSubmit = async (data: SignInFormValues) => {
        setServerError(null);
        setIsSuccess(false);

        try {
            // Simulate API Call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log("Form Submitted Successfully:", data);
            setIsSuccess(true);

            // Add your authentication logic here (e.g., NextAuth, custom JWT login)
        } catch (err) {
            setServerError("Invalid email or password. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans antialiased">
            {/* Background Decorative Glows */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-112.5 h-112.5 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Card Wrapper */}
            <div className="w-full max-w-md bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 shadow-2xl backdrop-blur-md relative z-10 space-y-6">

                {/* Header / Brand Logo */}
                <div className="text-center space-y-2">
                    <Link href="/" className="mb-2 flex justify-center items-center">
                        <BrotherTourLogoCom width={120} height={120}/>

                        {/* <span className="text-2xl font-black tracking-tight text-white">
                            LAO<span className="text-emerald-400">TRAVEL</span>
                        </span> */}
                    </Link>
                    <span className="text-2xl font-black tracking-tight text-white">
                            LAO<span className="text-emerald-400">TRAVEL</span>
                        </span>
                    <p className="text-xs text-slate-400">
                        Enter your credentials to access your account
                    </p>
                </div>

                {/* Global Error Banner */}
                {serverError && (
                    <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-2.5 text-xs text-rose-400">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{serverError}</span>
                    </div>
                )}

                {/* Success Banner */}
                {isSuccess && (
                    <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Sign in successful! Redirecting...</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

                    {/* Email Field */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">
                            Email Address
                        </label>
                        <div className="relative flex items-center">
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                {...register("email")}
                                className={`w-full pl-10 pr-4 py-3 bg-slate-900/80 border text-xs font-medium rounded-2xl text-white placeholder:text-slate-500 focus:outline-none transition-colors ${errors.email
                                    ? "border-rose-500 focus:border-rose-500"
                                    : "border-slate-700 focus:border-emerald-500"
                                    }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-[11px] font-medium text-rose-400 pl-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-300">
                                Password
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-[11px] font-semibold text-emerald-400 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative flex items-center">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...register("password")}
                                className={`w-full pl-10 pr-10 py-3 bg-slate-900/80 border text-xs font-medium rounded-2xl text-white placeholder:text-slate-500 focus:outline-none transition-colors ${errors.password
                                    ? "border-rose-500 focus:border-rose-500"
                                    : "border-slate-700 focus:border-emerald-500"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-[11px] font-medium text-rose-400 pl-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                {...register("rememberMe")}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500/20 focus:ring-offset-slate-800"
                            />
                            <span className="text-xs text-slate-400">Remember me</span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full cursor-pointer py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/50 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:pointer-events-none mt-2"
                    >
                        {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <div className="flex gap-1 items-center">
                                    <LogIn/>
                                <span>
                                    Sign In
                                </span>
                                {/* <ArrowRight className="w-4 h-4" /> */}
                            </div>
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="text-center pt-2 border-t border-slate-700/60">
                    <p className="text-xs text-slate-400">
                        Don't have an account?{" "}
                        <Link
                            href="/auth/register"
                            className="font-bold text-emerald-400 hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}