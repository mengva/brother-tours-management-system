"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Plus, Trash2, Save, Loader2, User, Calendar, CreditCard } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@workspace/ui/components/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";

// 1. Zod Passenger Schema
const passengerSchema = z.object({
    fullName: z.string().min(2, { message: "Name is required" }),
    passportOrId: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).default("MALE"),
    nationality: z.string().optional(),
});

// 2. Main Booking Schema
const bookingFormSchema = z.object({
    bookingCode: z.string().min(1, { message: "Booking code is required" }),
    quotationRef: z.string().optional(),
    customerName: z.string().min(2, { message: "Primary customer name required" }),
    customerPhone: z.string().min(6, { message: "Phone required" }),
    tourPackageName: z.string().min(2, { message: "Tour name required" }),
    startDate: z.string().min(1, { message: "Start date is required" }),
    endDate: z.string().min(1, { message: "End date is required" }),
    currency: z.enum(["USD", "LAK", "THB"]),
    totalAmount: z.coerce.number().min(0, { message: "Total amount required" }),
    depositPaid: z.coerce.number().min(0).default(0),
    paymentStatus: z.enum(["UNPAID", "DEPOSIT_PAID", "FULLY_PAID"]).default("DEPOSIT_PAID"),
    bookingStatus: z.enum(["CONFIRMED", "PENDING", "CANCELLED"]).default("CONFIRMED"),
    passengers: z.array(passengerSchema).min(1, { message: "Add at least 1 passenger" }),
    specialNotes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function CreateBookingPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto Generate Booking Reference Code
    const autoBookingCode = `BK-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Form Setup
    const form = useForm<BookingFormValues>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            bookingCode: autoBookingCode,
            quotationRef: "QT-202607-8842",
            customerName: "Alex Smith",
            customerPhone: "+856 20 5555 8888",
            tourPackageName: "3 Days 2 Nights Luang Prabang Highlights",
            startDate: "",
            endDate: "",
            currency: "USD",
            totalAmount: 680,
            depositPaid: 300,
            paymentStatus: "DEPOSIT_PAID",
            bookingStatus: "CONFIRMED",
            passengers: [
                { fullName: "Alex Smith", passportOrId: "P1234567", gender: "MALE", nationality: "Laotian" },
            ],
            specialNotes: "Needs VIP airport pickup and vegetarian meal options.",
        },
    });

    // 4. Passenger List Array
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "passengers",
    });

    // 5. Watch Financial Calculations
    const watchedTotal = form.watch("totalAmount") || 0;
    const watchedDeposit = form.watch("depositPaid") || 0;
    const watchedCurrency = form.watch("currency") || "USD";

    const balanceDue = Math.max(0, Number(watchedTotal) - Number(watchedDeposit));

    // 6. Submit Handler
    async function onSubmit(data: BookingFormValues) {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                balanceDue,
            };
            console.log("Submitting Booking Payload:", payload);

            // TODO: Call API endpoint (Hono / tRPC)
            // await api.bookings.create.mutate(payload);

            router.push("/admin/operations/bookings");
        } catch (error) {
            console.error("Failed to create booking:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create Tour Booking</h1>
                        <p className="text-sm text-muted-foreground">
                            Confirm reservation, manifest passengers, and set payment status.
                        </p>
                    </div>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* SECTION 1: Booking & Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Booking Overview</CardTitle>
                            <CardDescription>Primary tour and customer details.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="bookingCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Booking Reference *</FormLabel>
                                        <FormControl>
                                            <Input {...field} readOnly className="bg-muted/50 font-mono font-bold" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="quotationRef"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Linked Quotation Ref (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. QT-202607-8842" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bookingStatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Booking Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="customerName"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Primary Contact Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Lead traveler name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="customerPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone / WhatsApp *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+856 20 5555 8888" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tourPackageName"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                        <FormLabel>Tour / Service Package Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Luang Prabang - Vang Vieng 4D3N" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Travel Start Date *</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Travel End Date *</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Currency *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="USD">USD ($)</SelectItem>
                                                <SelectItem value="LAK">LAK (₭)</SelectItem>
                                                <SelectItem value="THB">THB (฿)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* SECTION 2: Passenger Manifest */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Passenger Manifest</CardTitle>
                                <CardDescription>Record all travelers included in this booking.</CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => append({ fullName: "", passportOrId: "", gender: "MALE", nationality: "Laotian" })}
                            >
                                <Plus className="h-4 w-4" />
                                Add Passenger
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {fields.map((fieldItem, index) => (
                                <div
                                    key={fieldItem.id}
                                    className="grid gap-3 md:grid-cols-12 items-end border p-3 rounded-lg bg-muted/20"
                                >
                                    <div className="md:col-span-4">
                                        <FormField
                                            control={form.control}
                                            name={`passengers.${index}.fullName`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    {index === 0 && <FormLabel>Full Name *</FormLabel>}
                                                    <FormControl>
                                                        <Input placeholder="Passenger name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="md:col-span-3">
                                        <FormField
                                            control={form.control}
                                            name={`passengers.${index}.passportOrId`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    {index === 0 && <FormLabel>Passport / ID No.</FormLabel>}
                                                    <FormControl>
                                                        <Input placeholder="ID or Passport" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name={`passengers.${index}.gender`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    {index === 0 && <FormLabel>Gender</FormLabel>}
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="MALE">Male</SelectItem>
                                                            <SelectItem value="FEMALE">Female</SelectItem>
                                                            <SelectItem value="OTHER">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name={`passengers.${index}.nationality`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    {index === 0 && <FormLabel>Nationality</FormLabel>}
                                                    <FormControl>
                                                        <Input placeholder="e.g. Lao" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="md:col-span-1 flex justify-end pb-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10"
                                            onClick={() => remove(index)}
                                            disabled={fields.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* SECTION 3: Payment & Balance Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Information</CardTitle>
                            <CardDescription>Track total charges, deposits, and remaining balance due.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-3">
                                <FormField
                                    control={form.control}
                                    name="totalAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Package Price ({watchedCurrency}) *</FormLabel>
                                            <FormControl>
                                                <Input type="number" min={0} step="any" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="depositPaid"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Deposit Paid ({watchedCurrency})</FormLabel>
                                            <FormControl>
                                                <Input type="number" min={0} step="any" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="paymentStatus"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="UNPAID">Unpaid</SelectItem>
                                                    <SelectItem value="DEPOSIT_PAID">Deposit Paid</SelectItem>
                                                    <SelectItem value="FULLY_PAID">Fully Paid</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Payment Summary Banner */}
                            <div className="flex flex-col md:flex-row items-center justify-between p-4 rounded-lg bg-muted/50 border gap-4">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="h-6 w-6 text-primary" />
                                    <div>
                                        <p className="font-semibold text-sm">Payment Balance Summary</p>
                                        <p className="text-xs text-muted-foreground">
                                            Deposit is deducted from total price automatically.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">Deposit Paid</p>
                                        <p className="font-mono font-bold text-emerald-600">
                                            {Number(watchedDeposit).toLocaleString()} {watchedCurrency}
                                        </p>
                                    </div>
                                    <div className="h-8 w-px bg-border" />
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">Remaining Balance Due</p>
                                        <p className="font-mono text-lg font-extrabold text-rose-600">
                                            {balanceDue.toLocaleString()} {watchedCurrency}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="specialNotes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Special Requests / Internal Notes</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Meal requests, room arrangement, van assignment..." rows={3} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="gap-2">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving Booking...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Confirm & Save Booking
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}