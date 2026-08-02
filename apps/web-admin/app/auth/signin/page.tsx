"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import trpc from "@/app/trpc/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { ZodValidationClientSignIn, zodValidationClientSignIn } from "@/admin/packages/validations";
import { Badge } from "@workspace/ui/components/badge";
import BrotherTourLogoCom from "@/components/brother-tour-logo";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Spinner } from "@workspace/ui/components/spinner";
import { useState } from "react";
import { ServerResponseDto } from "@/admin/packages/types";

export default function SignInPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<ZodValidationClientSignIn>({
        resolver: zodResolver(zodValidationClientSignIn),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const utils = trpc.useUtils();
    const signInMutation = trpc.app.user.auth.signIn.useMutation({
        onSuccess: async (data: ServerResponseDto) => {
            if (data?.success) {
                toast.success(data.message);
                return (
                    await Promise.all([
                        utils.app.user.auth.getUserAuth.invalidate(),
                        router.push("/admin/dashboard")
                    ])
                )
            }
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    function onSubmit(values: ZodValidationClientSignIn) {
        signInMutation.mutate(values);
    }

    const isPending = Boolean(signInMutation.isPending);

    return (
        <div className="flex min-h-screen items-center justify-center w-full">
            <div className="w-full max-w-md mx-auto">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="flex justify-center items-center">
                            <BrotherTourLogoCom width={100} height={100} />
                        </CardTitle>
                        <CardTitle className="text-center text-2xl font-semibold">
                            Admin Portal
                        </CardTitle>
                        <CardDescription className="text-center">
                            Sign in to access your administrative dashboard
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="you@example.com"
                                                    disabled={isPending}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••"
                                                    disabled={isPending}
                                                    {...field}
                                                />
                                            </FormControl>
                                            {
                                                form.watch("password") && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute inset-y-0 top-[40%] right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="w-4 h-4" />
                                                        ) : (
                                                            <Eye className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                )
                                            }
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full cursor-pointer"
                                    disabled={isPending}
                                >
                                    {
                                        isPending
                                            ? <Spinner />
                                            : <div className="flex items-center gap-1">
                                                <LogIn />
                                                SignIn
                                            </div>
                                    }
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-4 flex items-center justify-between text-sm">
                            <Link
                                href="/auth/forgot-password"
                            >
                                <Badge variant="destructive">Forgot password?</Badge>
                            </Link>

                            <Link
                                href="/auth/signin-otp"
                            >
                                <Badge variant="secondary">SignIn OTP?</Badge>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}