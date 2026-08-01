"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    ArrowLeft,
    Save,
    User,
    Mail,
    Phone,
    Lock,
    ShieldCheck,
    Building2,
    AlertCircle,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import { Switch } from "@workspace/ui/components/switch";

// Zod Validation Schema
const userSchema = z
    .object({
        firstName: z.string().min(2, "First name must be at least 2 characters"),
        lastName: z.string().min(2, "Last name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        phone: z
            .string()
            .min(8, "Phone number must be at least 8 digits")
            .regex(/^[+0-9\s-]+$/, "Invalid phone format"),
        department: z.string().min(1, "Please select a department"),
        role: z.enum(["ADMIN", "MANAGER", "STAFF", "OPERATOR"]),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Please confirm password"),
        status: z.enum(["ACTIVE", "INACTIVE"]),
        sendCredentialsEmail: z.boolean(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type UserFormValues = z.infer<typeof userSchema>;

export default function CreateUserPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            department: "IT",
            role: "STAFF",
            password: "",
            confirmPassword: "",
            status: "ACTIVE",
            sendCredentialsEmail: true,
        },
    });

    const onSubmit = async (data: UserFormValues) => {
        try {
            console.log("New System User Data:", data);
            await new Promise((resolve) => setTimeout(resolve, 800));
            router.push("/admin/users-management/users");
        } catch (error) {
            console.error("Failed to create user:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Action Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild className="h-9 w-9">
                        <Link href="/admin/users-management/users">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create System User</h1>
                        <p className="text-sm text-muted-foreground">
                            Add a new staff, manager, or admin account to the platform.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/users-management/users">Cancel</Link>
                    </Button>
                    <Button
                        type="submit"
                        form="create-user-form"
                        size="sm"
                        disabled={isSubmitting}
                        className="gap-2"
                    >
                        <Save className="h-4 w-4" />
                        {isSubmitting ? "Creating..." : "Save User Account"}
                    </Button>
                </div>
            </div>

            <form id="create-user-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Details */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            Personal & Contact Details
                        </CardTitle>
                        <CardDescription>Enter the basic info for the internal user account.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input id="firstName" placeholder="e.g. Khamla" {...register("firstName")} />
                            {errors.firstName && (
                                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input id="lastName" placeholder="e.g. Phommavong" {...register("lastName")} />
                            {errors.lastName && (
                                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Work Email *</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="khamla.p@company.la"
                                    className="pl-9"
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    placeholder="+856 20 5511 2233"
                                    className="pl-9"
                                    {...register("phone")}
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Roles & Department */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            Role & Department Assignment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="department">Department *</Label>
                            <Select defaultValue="IT" onValueChange={(val) => setValue("department", val)}>
                                <SelectTrigger id="department">
                                    <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="IT">IT & System Admin</SelectItem>
                                    <SelectItem value="OPERATIONS">Operations</SelectItem>
                                    <SelectItem value="FINANCE">Finance & Accounting</SelectItem>
                                    <SelectItem value="SUPPORT">Customer Support</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">System Role *</Label>
                            <Select
                                defaultValue="STAFF"
                                onValueChange={(val) => setValue("role", val as UserFormValues["role"])}
                            >
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADMIN">Super Admin</SelectItem>
                                    <SelectItem value="MANAGER">Manager</SelectItem>
                                    <SelectItem value="STAFF">Staff Member</SelectItem>
                                    <SelectItem value="OPERATOR">Operator</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Security & Password */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            Security & Credentials
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password *</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-9"
                                    {...register("password")}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password *</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-9"
                                    {...register("confirmPassword")}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Account Status</Label>
                            <Select
                                defaultValue="ACTIVE"
                                onValueChange={(val) => setValue("status", val as "ACTIVE" | "INACTIVE")}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="md:col-span-2 flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                            <div className="space-y-0.5">
                                <Label htmlFor="sendEmail" className="text-sm font-semibold cursor-pointer">
                                    Send Initial Access Email
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Send login credentials and instruction links directly to the user's email.
                                </p>
                            </div>
                            <Switch
                                id="sendEmail"
                                defaultChecked={true}
                                onCheckedChange={(val) => setValue("sendCredentialsEmail", val)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}