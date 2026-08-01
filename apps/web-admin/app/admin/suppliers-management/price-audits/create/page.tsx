"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Save,
    Building2,
    FileSearch,
    CheckCircle2,
    AlertTriangle,
    Upload,
    Plus,
    Trash2,
    DollarSign,
    FileText,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Badge } from "@workspace/ui/components/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table";

interface AuditLineItem {
    id: string;
    serviceName: string;
    contractRate: number;
    invoicedRate: number;
    variance: number;
    notes: string;
}

export default function CreatePriceAuditPage() {
    const router = useRouter();

    const [supplierId, setSupplierId] = useState("");
    const [auditCode] = useState(`AUD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
    const [currency, setCurrency] = useState("USD");
    const [auditNotes, setAuditNotes] = useState("");

    const [lineItems, setLineItems] = useState<AuditLineItem[]>([
        {
            id: "1",
            serviceName: "Deluxe King Room - High Season Rate",
            contractRate: 120,
            invoicedRate: 135,
            variance: 15,
            notes: "Invoiced rate higher than contracted card",
        },
        {
            id: "2",
            serviceName: "Airport Transfer (15-Seat Minibus)",
            contractRate: 45,
            invoicedRate: 45,
            variance: 0,
            notes: "Matched contract",
        },
    ]);

    const handleUpdateItem = (id: string, field: keyof AuditLineItem, value: any) => {
        setLineItems(
            lineItems.map((item) => {
                if (item.id === id) {
                    const updated = { ...item, [field]: value };
                    if (field === "contractRate" || field === "invoicedRate") {
                        const cRate = field === "contractRate" ? Number(value) : item.contractRate;
                        const iRate = field === "invoicedRate" ? Number(value) : item.invoicedRate;
                        updated.variance = iRate - cRate;
                    }
                    return updated;
                }
                return item;
            })
        );
    };

    const handleAddItem = () => {
        setLineItems([
            ...lineItems,
            {
                id: Date.now().toString(),
                serviceName: "",
                contractRate: 0,
                invoicedRate: 0,
                variance: 0,
                notes: "",
            },
        ]);
    };

    const handleRemoveItem = (id: string) => {
        setLineItems(lineItems.filter((i) => i.id !== id));
    };

    const totalDiscrepancies = lineItems.filter((i) => i.variance !== 0).length;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ auditCode, supplierId, currency, lineItems, auditNotes });
        router.push("/admin/suppliers-management/price-audits");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/suppliers-management/price-audits">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Run Price Audit</h1>
                        <p className="text-sm text-muted-foreground">
                            Cross-check supplier invoices against contract rate cards.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/admin/suppliers-management/price-audits">Cancel</Link>
                    </Button>
                    <Button onClick={handleSubmit} className="gap-2">
                        <Save className="h-4 w-4" />
                        Finalize & Save Audit
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Audit Meta */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            Audit Context & Supplier Selection
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="auditCode">Audit Reference Code</Label>
                            <Input id="auditCode" value={auditCode} className="font-mono" readOnly />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="supplier">Supplier Partner *</Label>
                            <Select value={supplierId} onValueChange={setSupplierId}>
                                <SelectTrigger id="supplier">
                                    <SelectValue placeholder="Select Supplier" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sup-1">Avani+ Luang Prabang Resort</SelectItem>
                                    <SelectItem value="sup-2">Lao-China Express Transport</SelectItem>
                                    <SelectItem value="sup-3">Tamarind Lao Restaurant</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="currency">Contract Currency</Label>
                            <Select value={currency} onValueChange={setCurrency}>
                                <SelectTrigger id="currency">
                                    <SelectValue placeholder="Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">USD ($)</SelectItem>
                                    <SelectItem value="LAK">LAK (₭)</SelectItem>
                                    <SelectItem value="THB">THB (฿)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Audit Line Items */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <FileSearch className="h-4 w-4 text-primary" />
                                Rate Line Items Comparison
                            </CardTitle>
                            <CardDescription>
                                Compare contracted rate card amounts against actual supplier invoice rates.
                            </CardDescription>
                        </div>
                        {totalDiscrepancies > 0 ? (
                            <Badge variant="destructive" className="font-mono">
                                {totalDiscrepancies} Discrepancy Found
                            </Badge>
                        ) : (
                            <Badge className="bg-emerald-600 font-mono">Rates Match</Badge>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[30%]">Service Item Name</TableHead>
                                    <TableHead className="w-[15%]">Contract Rate</TableHead>
                                    <TableHead className="w-[15%]">Invoiced Rate</TableHead>
                                    <TableHead className="w-[15%]">Variance</TableHead>
                                    <TableHead className="w-[20%]">Notes / Remarks</TableHead>
                                    <TableHead className="w-[5%]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lineItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Input
                                                placeholder="e.g. Deluxe Room"
                                                value={item.serviceName}
                                                onChange={(e) => handleUpdateItem(item.id, "serviceName", e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={item.contractRate || ""}
                                                onChange={(e) => handleUpdateItem(item.id, "contractRate", e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                value={item.invoicedRate || ""}
                                                onChange={(e) => handleUpdateItem(item.id, "invoicedRate", e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            <span
                                                className={`font-semibold ${item.variance > 0
                                                        ? "text-destructive"
                                                        : item.variance < 0
                                                            ? "text-emerald-600"
                                                            : "text-muted-foreground"
                                                    }`}
                                            >
                                                {item.variance > 0 ? `+${item.variance}` : item.variance} {currency}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                placeholder="Remarks..."
                                                value={item.notes}
                                                onChange={(e) => handleUpdateItem(item.id, "notes", e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive"
                                                onClick={() => handleRemoveItem(item.id)}
                                                disabled={lineItems.length === 1}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="gap-1.5">
                            <Plus className="h-3.5 w-3.5" /> Add Item Line
                        </Button>
                    </CardContent>
                </Card>

                {/* Audit Notes & Attachments */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Audit Findings Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            rows={3}
                            placeholder="Provide a general summary of findings or reason for rate overrides..."
                            value={auditNotes}
                            onChange={(e) => setAuditNotes(e.target.value)}
                        />
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}