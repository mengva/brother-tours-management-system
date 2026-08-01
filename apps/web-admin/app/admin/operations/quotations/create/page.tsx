"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Plus, Trash2, Save, Loader2, Calculator } from "lucide-react";

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

// 1. Zod Item Schema (Service / Tour Item)
const quotationItemSchema = z.object({
    description: z.string().min(1, { message: "Item description is required" }),
    quantity: z.coerce.number().min(1, { message: "Min 1" }),
    unitPrice: z.coerce.number().min(0, { message: "Cannot be negative" }),
});

// 2. Main Quotation Schema
const quotationFormSchema = z.object({
    quotationNumber: z.string().min(1, { message: "Quotation number is required" }),
    customerName: z.string().min(2, { message: "Customer name is required" }),
    customerPhone: z.string().min(6, { message: "Phone is required" }),
    currency: z.enum(["USD", "LAK", "THB"]),
    validUntil: z.string().min(1, { message: "Valid date is required" }),
    items: z.array(quotationItemSchema).min(1, { message: "Add at least 1 item" }),
    discount: z.coerce.number().default(0),
    notes: z.string().optional(),
    termsAndConditions: z.string().optional(),
});

type QuotationFormValues = z.infer<typeof quotationFormSchema>;

export default function CreateQuotationPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Default Auto-generated Quotation Number
    const autoQuotationNo = `QT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Initialize Form
    const form = useForm<QuotationFormValues>({
        resolver: zodResolver(quotationFormSchema),
        defaultValues: {
            quotationNumber: autoQuotationNo,
            customerName: "",
            customerPhone: "",
            currency: "USD",
            validUntil: "",
            items: [
                { description: "3 Days 2 Nights Luang Prabang Tour Package (Per Pax)", quantity: 2, unitPrice: 250 },
                { description: "VIP Van Transportation (3 Days)", quantity: 1, unitPrice: 180 },
            ],
            discount: 0,
            notes: "Includes hotel 4-star, private van, and English speaking guide.",
            termsAndConditions: "Deposit 50% required upon confirmation. Non-refundable 7 days prior to arrival.",
        },
    });

    // 4. Field Array for Dynamic Items (Add / Remove Service Rows)
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    // 5. Calculate Live Totals
    const watchedItems = form.watch("items") || [];
    const watchedDiscount = form.watch("discount") || 0;
    const watchedCurrency = form.watch("currency") || "USD";

    const subtotal = watchedItems.reduce((sum, item) => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.unitPrice) || 0;
        return sum + qty * price;
    }, 0);

    const grandTotal = Math.max(0, subtotal - (Number(watchedDiscount) || 0));

    // 6. Submit Handler
    async function onSubmit(data: QuotationFormValues) {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                subtotal,
                grandTotal,
            };
            console.log("Submitting Quotation Payload:", payload);

            // TODO: Call backend API (e.g. tRPC / Hono endpoint)
            // await api.quotations.create.mutate(payload);

            router.push("/admin/operations/quotations");
        } catch (error) {
            console.error("Failed to create quotation:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* Top Header */}
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
                        <h1 className="text-2xl font-bold tracking-tight">Create New Quotation</h1>
                        <p className="text-sm text-muted-foreground">
                            Generate a price quotation offer for customer booking.
                        </p>
                    </div>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* SECTION 1: Quotation Header Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quotation Info & Customer</CardTitle>
                            <CardDescription>
                                Basic details for identifying the quotation and customer contact.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="quotationNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quotation No. *</FormLabel>
                                        <FormControl>
                                            <Input {...field} readOnly className="bg-muted/50 font-mono" />
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
                                                    <SelectValue placeholder="Select currency" />
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

                            <FormField
                                control={form.control}
                                name="validUntil"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valid Until *</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="customerName"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Customer / Company Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Mr. Alex Smith / Horizon Group" {...field} />
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
                        </CardContent>
                    </Card>

                    {/* SECTION 2: Dynamic Items & Services */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Services & Pricing Breakdown</CardTitle>
                                <CardDescription>
                                    Add tour packages, vehicles, hotel stays, or guide fees.
                                </CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}
                            >
                                <Plus className="h-4 w-4" />
                                Add Line Item
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {fields.map((fieldItem, index) => {
                                    const qty = form.watch(`items.${index}.quantity`) || 0;
                                    const price = form.watch(`items.${index}.unitPrice`) || 0;
                                    const itemTotal = qty * price;

                                    return (
                                        <div
                                            key={fieldItem.id}
                                            className="grid gap-3 md:grid-cols-12 items-end border p-3 rounded-lg bg-muted/20"
                                        >
                                            {/* Description */}
                                            <div className="md:col-span-6">
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.description`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            {index === 0 && <FormLabel>Description</FormLabel>}
                                                            <FormControl>
                                                                <Input placeholder="Item / Tour details" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Quantity */}
                                            <div className="md:col-span-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.quantity`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            {index === 0 && <FormLabel>Qty / Pax</FormLabel>}
                                                            <FormControl>
                                                                <Input type="number" min={1} {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Unit Price */}
                                            <div className="md:col-span-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.unitPrice`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            {index === 0 && <FormLabel>Unit Price</FormLabel>}
                                                            <FormControl>
                                                                <Input type="number" min={0} step="any" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Row Total & Delete */}
                                            <div className="md:col-span-2 flex items-center justify-between gap-2">
                                                <div className="text-right w-full pr-2">
                                                    {index === 0 && <p className="text-xs font-semibold text-muted-foreground mb-2">Total</p>}
                                                    <p className="font-mono text-sm font-bold">
                                                        {itemTotal.toLocaleString()} {watchedCurrency}
                                                    </p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:bg-destructive/10 shrink-0"
                                                    onClick={() => remove(index)}
                                                    disabled={fields.length === 1}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Subtotal & Grand Total Summary Box */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pt-4 border-t">
                                <div className="w-full md:w-1/2 space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="discount"
                                        render={({ field }) => (
                                            <FormItem className="max-w-xs">
                                                <FormLabel>Discount Amount ({watchedCurrency})</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min={0} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="w-full md:w-80 bg-muted/50 p-4 rounded-lg space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal:</span>
                                        <span className="font-mono font-medium">
                                            {subtotal.toLocaleString()} {watchedCurrency}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Discount:</span>
                                        <span className="font-mono text-rose-600">
                                            -{(Number(watchedDiscount) || 0).toLocaleString()} {watchedCurrency}
                                        </span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between items-center">
                                        <span className="font-bold">Grand Total:</span>
                                        <span className="font-mono text-xl font-extrabold text-primary">
                                            {grandTotal.toLocaleString()} {watchedCurrency}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION 3: Notes & Terms */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes & Payment Terms</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Inclusions / Remarks</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Inclusions, special features..." rows={3} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="termsAndConditions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Terms & Conditions</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Payment terms, cancellation policy..." rows={3} {...field} />
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
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Create Quotation
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}