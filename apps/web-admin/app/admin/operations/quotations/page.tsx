"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    FileText,
    Send,
    CheckCircle2,
    Download,
    Calendar,
    Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";

// 1. Types
type QuotationStatus = "DRAFT" | "SENT" | "APPROVED" | "REJECTED" | "EXPIRED";

interface Quotation {
    id: string;
    code: string;
    enquiryCode: string;
    customerName: string;
    destination: string;
    paxCount: number;
    totalAmount: number;
    currency: "LAK" | "USD" | "THB";
    validUntil: string;
    status: QuotationStatus;
    createdAt: string;
    createdBy: string;
}

// 2. Demo Mock Data
const demoQuotations: Quotation[] = [
    {
        id: "qt-1",
        code: "QT-2026-001",
        enquiryCode: "ENQ-2026-001",
        customerName: "Sengdavone Phommasone",
        destination: "Luang Prabang - Vang Vieng (4D3N)",
        paxCount: 4,
        totalAmount: 18500000,
        currency: "LAK",
        validUntil: "2026-08-10",
        status: "SENT",
        createdAt: "2026-07-30 11:20",
        createdBy: "Khamla (Sales)",
    },
    {
        id: "qt-2",
        code: "QT-2026-002",
        enquiryCode: "ENQ-2026-003",
        customerName: "Bounmi Sayasith",
        destination: "Vientiane City Tour + Golf (2D1N)",
        paxCount: 8,
        totalAmount: 3200,
        currency: "USD",
        validUntil: "2026-08-05",
        status: "APPROVED",
        createdAt: "2026-07-29 15:40",
        createdBy: "Khamla (Sales)",
    },
    {
        id: "qt-3",
        code: "QT-2026-003",
        enquiryCode: "ENQ-2026-004",
        customerName: "Michael Chang",
        destination: "Plain of Jars Exploration (3D2N)",
        paxCount: 3,
        totalAmount: 1450,
        currency: "USD",
        validUntil: "2026-08-15",
        status: "DRAFT",
        createdAt: "2026-07-30 08:15",
        createdBy: "Noy (Manager)",
    },
    {
        id: "qt-4",
        code: "QT-2026-004",
        enquiryCode: "ENQ-2026-002",
        customerName: "John Anderson",
        destination: "4,000 Islands & Champasak (5D4N)",
        paxCount: 2,
        totalAmount: 52000,
        currency: "THB",
        validUntil: "2026-07-28",
        status: "EXPIRED",
        createdAt: "2026-07-15 10:00",
        createdBy: "Souk (Sales)",
    },
    {
        id: "qt-5",
        code: "QT-2026-005",
        enquiryCode: "ENQ-2026-005",
        customerName: "Ketsana Vongsa",
        destination: "Nong Khiaw Trekking & Kayaking",
        paxCount: 5,
        totalAmount: 12800000,
        currency: "LAK",
        validUntil: "2026-07-25",
        status: "REJECTED",
        createdAt: "2026-07-18 14:10",
        createdBy: "Souk (Sales)",
    },
];

export default function QuotationsListPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    // Filter Logic
    const filteredData = demoQuotations.filter((item) => {
        const matchesSearch =
            item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.enquiryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.destination.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Helpers
    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US").format(amount) + " " + currency;
    };

    const getStatusBadge = (status: QuotationStatus) => {
        switch (status) {
            case "DRAFT":
                return <Badge variant="outline" className="text-zinc-500 border-zinc-300">Draft</Badge>;
            case "SENT":
                return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Sent</Badge>;
            case "APPROVED":
                return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Approved</Badge>;
            case "REJECTED":
                return <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20">Rejected</Badge>;
            case "EXPIRED":
                return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Expired</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Title & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quotations</h1>
                    <p className="text-sm text-muted-foreground">
                        Create, track, and manage price quotes sent to customers.
                    </p>
                </div>
                <Link href="/admin/operations/quotations/create">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Quotation
                    </Button>
                </Link>
            </div>

            {/* Quick Summary Stats */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Total Quotes</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold">86</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Pending Customer Approval</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold text-blue-600">18</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Approved This Month</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold text-emerald-600">29</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Expired Quotes</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold text-amber-600">5</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table Card */}
            <Card>
                <CardHeader className="pb-3 space-y-4">
                    <div>
                        <CardTitle>Quotation List</CardTitle>
                        <CardDescription>Overview of all generated pricing proposals.</CardDescription>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        {/* Filter controls */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search code, customer, tour..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 text-sm"
                                />
                            </div>

                        </div>
                        <div className="flex gap-2 items-center">
                            <Button variant={"outline"}>Refresh Data</Button>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-36 text-sm">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Status</SelectItem>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="SENT">Sent</SelectItem>
                                    <SelectItem value="APPROVED">Approved</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                    <SelectItem value="EXPIRED">Expired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-28">Quote Code</TableHead>
                                    <TableHead>Ref Enquiry</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Tour / Package</TableHead>
                                    <TableHead className="text-right">Total Amount</TableHead>
                                    <TableHead>Valid Until</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            No quotation records found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-mono text-xs font-semibold">
                                                <div className="flex items-center gap-1.5">
                                                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {item.code}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {item.enquiryCode}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-sm">{item.customerName}</div>
                                                <div className="text-xs text-muted-foreground">{item.createdBy}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">{item.destination}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Users className="h-3 w-3" /> {item.paxCount} Pax
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-mono font-semibold text-sm">
                                                {formatAmount(item.totalAmount, item.currency)}
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {item.validUntil}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="gap-2 cursor-pointer">
                                                            <Eye className="h-4 w-4 text-muted-foreground" /> View Quotation
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 cursor-pointer">
                                                            <Download className="h-4 w-4 text-muted-foreground" /> Export PDF
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 cursor-pointer">
                                                            <Send className="h-4 w-4 text-muted-foreground" /> Send to Customer
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="gap-2 cursor-pointer text-emerald-600">
                                                            <CheckCircle2 className="h-4 w-4" /> Convert to Booking
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 cursor-pointer">
                                                            <Edit className="h-4 w-4 text-muted-foreground" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
                                                            <Trash2 className="h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Footer Pagination Bar */}
                    <div className="flex items-center justify-between pt-4 text-xs text-muted-foreground">
                        <div>
                            Showing <strong>{filteredData.length}</strong> of <strong>{demoQuotations.length}</strong> entries
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" disabled>
                                Previous
                            </Button>
                            <Button variant="outline" size="sm" disabled>
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}