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
    MapPin,
    ShieldCheck,
    Building,
    FileText,
    UserCheck,
    AlertCircle,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import { Switch } from "@workspace/ui/components/switch";

// 1. Define Zod Validation Schema
const customerSchema = z
    .object({
        customerType: z.enum(["INDIVIDUAL", "CORPORATE"]),
        firstName: z.string().min(2, "First name must be at least 2 characters"),
        lastName: z.string().min(2, "Last name must be at least 2 characters"),
        companyName: z.string().optional(),
        taxId: z.string().optional(),
        email: z.string().email("Invalid email address"),
        phone: z
            .string()
            .min(8, "Phone number must be at least 8 digits")
            .regex(/^[+0-9\s-]+$/, "Invalid phone number format"),
        gender: z.enum(["MALE", "FEMALE", "OTHER"]),
        nationality: z.string().min(1, "Please select nationality"),
        address: z.string().optional(),
        city: z.string().min(1, "City is required"),
        country: z.string().min(1, "Country is required"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        status: z.enum(["ACTIVE", "INACTIVE"]),
        sendWelcomeEmail: z.boolean(),
    })
    .refine(
        (data) => {
            if (data.customerType === "CORPORATE" && (!data.companyName || data.companyName.trim() === "")) {
                return false;
            }
            return true;
        },
        {
            message: "Company Name is required for Corporate accounts",
            path: ["companyName"],
        }
    );

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function CreateCustomerPage() {
    const router = useRouter();

    // 2. Setup React Hook Form
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CustomerFormValues>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            customerType: "INDIVIDUAL",
            firstName: "",
            lastName: "",
            companyName: "",
            taxId: "",
            email: "",
            phone: "",
            gender: "MALE",
            nationality: "Lao",
            address: "",
            city: "Vientiane",
            country: "Laos",
            password: "",
            status: "ACTIVE",
            sendWelcomeEmail: true,
        },
    });

    const customerType = watch("customerType");

    // 3. Submit Handler
    const onSubmit = async (data: CustomerFormValues) => {
        try {
            console.log("Validated Customer Data:", data);
            await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay
            router.push("/admin/users-management/customers");
        } catch (error) {
            console.error("Submission failed:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Top Action Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild className="h-9 w-9">
                        <Link href="/admin/users-management/customers">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create New Customer</h1>
                        <p className="text-sm text-muted-foreground">
                            Register a new client profile into the booking and management platform.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/users-management/customers">Cancel</Link>
                    </Button>
                    <Button
                        type="submit"
                        form="create-customer-form"
                        size="sm"
                        disabled={isSubmitting}
                        className="gap-2"
                    >
                        <Save className="h-4 w-4" />
                        {isSubmitting ? "Saving..." : "Save Customer"}
                    </Button>
                </div>
            </div>

            <form id="create-customer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Account Type Card */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-primary" />
                            Account Type
                        </CardTitle>
                        <CardDescription>Select whether this account is for an individual or a corporate entity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div
                                onClick={() => setValue("customerType", "INDIVIDUAL")}
                                className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${customerType === "INDIVIDUAL"
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-muted-foreground/30"
                                    }`}
                            >
                                <User className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold">Individual Account</p>
                                    <p className="text-xs text-muted-foreground">Personal account for individual travel bookings.</p>
                                </div>
                            </div>

                            <div
                                onClick={() => setValue("customerType", "CORPORATE")}
                                className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${customerType === "CORPORATE"
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-muted-foreground/30"
                                    }`}
                            >
                                <Building className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold">Corporate Account</p>
                                    <p className="text-xs text-muted-foreground">Company account with billing details and tax IDs.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Primary Contact Details */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            Primary Information
                        </CardTitle>
                        <CardDescription>Enter personal and business details.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {customerType === "CORPORATE" && (
                            <>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="companyName">Company Name *</Label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="companyName"
                                            placeholder="e.g. Lao Travel Group Co., Ltd."
                                            className="pl-9"
                                            {...register("companyName")}
                                        />
                                    </div>
                                    {errors.companyName && (
                                        <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                            <AlertCircle className="h-3.5 w-3.5" />
                                            {errors.companyName.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="taxId">Tax Identification Number (TIN)</Label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="taxId"
                                            placeholder="e.g. 01020304050"
                                            className="pl-9"
                                            {...register("taxId")}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* First Name */}
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input id="firstName" placeholder="e.g. Somchai" {...register("firstName")} />
                            {errors.firstName && (
                                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input id="lastName" placeholder="e.g. Keomany" {...register("lastName")} />
                            {errors.lastName && (
                                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="somchai@example.com"
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

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    placeholder="+856 20 5555 1234"
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

                        {/* Gender */}
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                defaultValue="MALE"
                                onValueChange={(val) => setValue("gender", val as "MALE" | "FEMALE" | "OTHER")}
                            >
                                <SelectTrigger id="gender">
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MALE">Male</SelectItem>
                                    <SelectItem value="FEMALE">Female</SelectItem>
                                    <SelectItem value="OTHER">Other / Prefer not to say</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Nationality */}
                        <div className="space-y-2">
                            <Label htmlFor="nationality">Nationality</Label>
                            <Select
                                defaultValue="Lao"
                                onValueChange={(val) => setValue("nationality", val)}
                            >
                                <SelectTrigger id="nationality">
                                    <SelectValue placeholder="Select Nationality" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Lao">Lao</SelectItem>
                                    <SelectItem value="Thai">Thai</SelectItem>
                                    <SelectItem value="Vietnamese">Vietnamese</SelectItem>
                                    <SelectItem value="Chinese">Chinese</SelectItem>
                                    <SelectItem value="International">International</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Address Card */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            Location & Billing Address
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City / Province *</Label>
                            <Input id="city" placeholder="e.g. Vientiane" {...register("city")} />
                            {errors.city && (
                                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {errors.city.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="country">Country *</Label>
                            <Select
                                defaultValue="Laos"
                                onValueChange={(val) => setValue("country", val)}
                            >
                                <SelectTrigger id="country">
                                    <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Laos">Laos</SelectItem>
                                    <SelectItem value="Thailand">Thailand</SelectItem>
                                    <SelectItem value="Vietnam">Vietnam</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="address">Street Address</Label>
                            <Textarea
                                id="address"
                                rows={3}
                                placeholder="Enter full billing address details..."
                                {...register("address")}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Credentials & System Controls */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            Security & Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="password">Initial Password *</Label>
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
                                    Send Welcome Email
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Send an automated onboarding email containing account details and a password reset link.
                                </p>
                            </div>
                            <Switch
                                id="sendEmail"
                                defaultChecked={true}
                                onCheckedChange={(val) => setValue("sendWelcomeEmail", val)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}