"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Save,
    Building2,
    CreditCard,
    User,
    Loader2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import { Switch } from "@workspace/ui/components/switch";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@workspace/ui/components/form";

// ---------------- Supplier Validation Schema ----------------
export const supplierSchema = z.object({
    code: z
        .string()
        .min(3, { message: "Supplier code must be at least 3 characters." })
        .max(20, { message: "Code must not exceed 20 characters." }),
    companyName: z
        .string()
        .min(2, { message: "Company name is required." })
        .max(100, { message: "Company name must not exceed 100 characters." }),
    category: z.enum(["HOTEL", "TRANSPORT", "GUIDE", "RESTAURANT", "ATTRACTION"], {
        required_error: "Please select a supplier category.",
    }),
    location: z.string().min(2, { message: "Location/City is required." }),
    address: z.string().optional(),
    rating: z.coerce
        .number()
        .min(1, { message: "Rating must be between 1 and 5." })
        .max(5, { message: "Rating must be between 1 and 5." }),

    contactPerson: z.string().min(2, { message: "Contact person name is required." }),
    phone: z
        .string()
        .min(6, { message: "Phone number is required." })
        .regex(/^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, {
            message: "Please enter a valid phone number.",
        }),
    email: z
        .string()
        .email({ message: "Please enter a valid email address." })
        .or(z.literal("")),
    website: z
        .string()
        .url({ message: "Please enter a valid URL (e.g. https://example.com)." })
        .or(z.literal("")),

    paymentTerms: z.enum(
        ["CREDIT_30", "CREDIT_15", "ADVANCE_PAYMENT", "CASH_ON_ARRIVAL"],
        {
            required_error: "Please select a payment term.",
        }
    ),
    bankAccountInfo: z.string().optional(),
    contractUntil: z.string().min(1, { message: "Contract date is required." }),
    isActive: z.boolean().default(true),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;

export default function CreateSupplierPage() {
    const router = useRouter();

    // --- React Hook Form Setup ---
    const form = useForm<SupplierFormValues>({
        resolver: zodResolver(supplierSchema),
        defaultValues: {
            code: "SUP-HTL-006",
            companyName: "",
            category: "HOTEL",
            location: "Luang Prabang",
            address: "",
            rating: 4.5,
            contactPerson: "",
            phone: "",
            email: "",
            website: "",
            paymentTerms: "CREDIT_30",
            bankAccountInfo: "",
            contractUntil: "2026-12-31",
            isActive: true,
        },
    });

    const onSubmit = async (data: SupplierFormValues) => {
        console.log("Submitting New Supplier Validated Data:", data);
        // Submit to your API or Backend server here...
        router.push("/admin/suppliers-management/suppliers");
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-20">
                {/* Top Action Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/suppliers-management/suppliers">
                            <Button variant="outline" size="icon" className="h-9 w-9" type="button">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Add New Supplier</h1>
                            <p className="text-sm text-muted-foreground">
                                Register a new partner vendor for accommodation, transport, or guide services.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => router.push("/admin/suppliers-management/suppliers")}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="gap-2" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            Save Supplier
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Left Column: Vendor Profile & Contacts (2 Cols) */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-primary" /> Vendor Profile
                                </CardTitle>
                                <CardDescription>Company legal name, service category, and location.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Supplier Code */}
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Supplier Code *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. SUP-HTL-001" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Category */}
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="HOTEL">Hotel / Accommodation</SelectItem>
                                                        <SelectItem value="TRANSPORT">Transport Company</SelectItem>
                                                        <SelectItem value="GUIDE">Tour Guide</SelectItem>
                                                        <SelectItem value="RESTAURANT">Restaurant / Dining</SelectItem>
                                                        <SelectItem value="ATTRACTION">Attraction / Entrance Fee</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Company Name */}
                                <FormField
                                    control={form.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Company / Partner Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Avani+ Luang Prabang Resort" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Location */}
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City / Location *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Luang Prabang" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Rating */}
                                    <FormField
                                        control={form.control}
                                        name="rating"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Partner Rating (1 - 5 Stars)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.1" min="1" max="5" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Full Address */}
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Address</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    rows={2}
                                                    placeholder="Street address, village, district..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Contact Representative Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <User className="h-4 w-4 text-primary" /> Contact Representative
                                </CardTitle>
                                <CardDescription>Direct contact person details for reservations.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Contact Person */}
                                    <FormField
                                        control={form.control}
                                        name="contactPerson"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Person Name *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Khamphouy S." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Phone Number */}
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. +856 20 5511 2233" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Email */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="e.g. reservation@hotel.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Website */}
                                    <FormField
                                        control={form.control}
                                        name="website"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Website (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. https://www.avanihotels.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Financial Terms & Status (1 Col) */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-primary" /> Payment & Contract Terms
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Payment Terms */}
                                <FormField
                                    control={form.control}
                                    name="paymentTerms"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Term Type *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Payment Term" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="CREDIT_30">30 Days Credit</SelectItem>
                                                    <SelectItem value="CREDIT_15">15 Days Credit</SelectItem>
                                                    <SelectItem value="ADVANCE_PAYMENT">Advance Deposit Required</SelectItem>
                                                    <SelectItem value="CASH_ON_ARRIVAL">Cash on Arrival</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Contract Until */}
                                <FormField
                                    control={form.control}
                                    name="contractUntil"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contract Valid Until *</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Bank Account Info */}
                                <FormField
                                    control={form.control}
                                    name="bankAccountInfo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bank Account Info</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    rows={3}
                                                    placeholder="BCEL Bank: 010123456789... Account Name: Hotel Co., Ltd"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Is Active Switch */}
                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between border-t pt-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-sm font-medium cursor-pointer">
                                                    Active Partner
                                                </FormLabel>
                                                <FormDescription className="text-xs">
                                                    Available for Tour Booking allocations.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    );
}