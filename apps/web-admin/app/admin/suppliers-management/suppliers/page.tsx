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
    Building2,
    Phone,
    Mail,
    MapPin,
    FileText,
    BadgeCheck,
    Star,
    Hotel,
    Bus,
    Utensils,
    UserCheck,
    Ticket,
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
type SupplierCategory = "HOTEL" | "TRANSPORT" | "GUIDE" | "RESTAURANT" | "ATTRACTION";
type PaymentTerms = "CREDIT_30" | "CREDIT_15" | "ADVANCE_PAYMENT" | "CASH_ON_ARRIVAL";

interface Supplier {
    id: string;
    code: string;
    companyName: string;
    category: SupplierCategory;
    contactPerson: string;
    phone: string;
    email: string;
    location: string;
    paymentTerms: PaymentTerms;
    rating: number;
    isActive: boolean;
    contractUntil: string;
}

// 2. Demo Mock Data
const demoSuppliers: Supplier[] = [
    {
        id: "sup-1",
        code: "SUP-HTL-001",
        companyName: "Avani+ Luang Prabang Resort",
        category: "HOTEL",
        contactPerson: "Khamphouy S.",
        phone: "+856 71 254 999",
        email: "res.avani@minor.com",
        location: "Luang Prabang",
        paymentTerms: "CREDIT_30",
        rating: 4.9,
        isActive: true,
        contractUntil: "2026-12-31",
    },
    {
        id: "sup-2",
        code: "SUP-TRN-002",
        companyName: "Lao-China Transport Express",
        category: "TRANSPORT",
        contactPerson: "Bounlot V.",
        phone: "+856 20 5511 2233",
        email: "booking@lctransport.la",
        location: "Vientiane",
        paymentTerms: "CREDIT_15",
        rating: 4.6,
        isActive: true,
        contractUntil: "2027-03-31",
    },
    {
        id: "sup-3",
        code: "SUP-GDE-003",
        companyName: "Sengchanh Tour Guide Services",
        category: "GUIDE",
        contactPerson: "Sengchanh P.",
        phone: "+856 20 9988 1122",
        email: "sengchanh.guide@gmail.com",
        location: "Luang Prabang / Vang Vieng",
        paymentTerms: "CASH_ON_ARRIVAL",
        rating: 4.8,
        isActive: true,
        contractUntil: "2026-10-15",
    },
    {
        id: "sup-4",
        code: "SUP-RST-004",
        companyName: "Tamarind Lao Restaurant",
        category: "RESTAURANT",
        contactPerson: "Joy M.",
        phone: "+856 71 213 128",
        email: "info@tamarindlaos.com",
        location: "Luang Prabang",
        paymentTerms: "CREDIT_15",
        rating: 4.7,
        isActive: true,
        contractUntil: "2026-12-31",
    },
    {
        id: "sup-5",
        code: "SUP-ATT-005",
        companyName: "Kuang Si Park Authority",
        category: "ATTRACTION",
        contactPerson: "Admin Office",
        phone: "+856 71 212 001",
        email: "kuangsi.tickets@laogov.la",
        location: "Luang Prabang",
        paymentTerms: "ADVANCE_PAYMENT",
        rating: 4.5,
        isActive: false,
        contractUntil: "2026-06-30",
    },
];

export default function SuppliersListPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

    // Filter Logic
    const filteredData = demoSuppliers.filter((item) => {
        const matchesSearch =
            item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.phone.includes(searchTerm);

        const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    // Helpers
    const getCategoryBadge = (category: SupplierCategory) => {
        switch (category) {
            case "HOTEL":
                return (
                    <Badge variant="outline" className="text-indigo-600 border-indigo-300 bg-indigo-50/50 gap-1">
                        <Hotel className="h-3 w-3" /> Accommodation
                    </Badge>
                );
            case "TRANSPORT":
                return (
                    <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50/50 gap-1">
                        <Bus className="h-3 w-3" /> Transport
                    </Badge>
                );
            case "GUIDE":
                return (
                    <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50/50 gap-1">
                        <UserCheck className="h-3 w-3" /> Tour Guide
                    </Badge>
                );
            case "RESTAURANT":
                return (
                    <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50/50 gap-1">
                        <Utensils className="h-3 w-3" /> Dining
                    </Badge>
                );
            case "ATTRACTION":
                return (
                    <Badge variant="outline" className="text-purple-600 border-purple-300 bg-purple-50/50 gap-1">
                        <Ticket className="h-3 w-3" /> Attraction
                    </Badge>
                );
        }
    };

    const getPaymentTermsBadge = (terms: PaymentTerms) => {
        switch (terms) {
            case "CREDIT_30":
                return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">30 Days Credit</Badge>;
            case "CREDIT_15":
                return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">15 Days Credit</Badge>;
            case "ADVANCE_PAYMENT":
                return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Advance Pay</Badge>;
            case "CASH_ON_ARRIVAL":
                return <Badge variant="secondary" className="text-zinc-600">Cash on Arrival</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Title & Main Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Suppliers Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage partner hotels, transport companies, tour guides, and service vendors.
                    </p>
                </div>
                <Link href="/admin/suppliers-management/suppliers/create">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Supplier
                    </Button>
                </Link>
            </div>

            {/* Summary KPI Cards */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Total Partners</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold">54</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Hotels & Resorts</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold text-indigo-600">22</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Transport Providers</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold text-blue-600">14</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Tour Guides</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold text-emerald-600">18</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table Card */}
            <Card>
                <CardHeader className="pb-3 space-y-4">
                    <div>
                        <CardTitle>Supplier Directory</CardTitle>
                        <CardDescription>Verified vendor contacts, contract periods, and credit terms.</CardDescription>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                        {/* Search & Filters */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search supplier, contact, city..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 items-center">
                            <Button variant={"outline"}>Refresh Data</Button>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-40 text-sm">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Categories</SelectItem>
                                    <SelectItem value="HOTEL">Hotels</SelectItem>
                                    <SelectItem value="TRANSPORT">Transport</SelectItem>
                                    <SelectItem value="GUIDE">Tour Guides</SelectItem>
                                    <SelectItem value="RESTAURANT">Restaurants</SelectItem>
                                    <SelectItem value="ATTRACTION">Attractions</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-28">Code</TableHead>
                                    <TableHead className="min-w-[220px]">Company Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Contact Person</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Payment Terms</TableHead>
                                    <TableHead className="text-center">Rating</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                            No supplier records found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-mono text-xs font-semibold">
                                                {item.code}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-semibold text-sm flex items-center gap-1.5">
                                                    <Building2 className="h-4 w-4 text-primary shrink-0" />
                                                    <span>{item.companyName}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground pl-5.5 flex items-center gap-1 mt-0.5">
                                                    <Mail className="h-3 w-3" /> {item.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getCategoryBadge(item.category)}</TableCell>
                                            <TableCell>
                                                <div className="text-xs font-medium">{item.contactPerson}</div>
                                                <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <Phone className="h-3 w-3" /> {item.phone}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-xs font-medium flex items-center gap-1">
                                                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                    <span>{item.location}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getPaymentTermsBadge(item.paymentTerms)}</TableCell>
                                            <TableCell className="text-center font-mono text-xs font-bold">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                                    <span>{item.rating}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {item.isActive ? (
                                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="text-zinc-500">Expired</Badge>
                                                )}
                                            </TableCell>
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
                                                            <Eye className="h-4 w-4 text-muted-foreground" /> View Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 cursor-pointer">
                                                            <FileText className="h-4 w-4 text-muted-foreground" /> View Contract Rates
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 cursor-pointer">
                                                            <Edit className="h-4 w-4 text-muted-foreground" /> Edit Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
                                                            <Trash2 className="h-4 w-4" /> Delete Supplier
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

                    {/* Footer Pagination */}
                    <div className="flex items-center justify-between pt-4 text-xs text-muted-foreground">
                        <div>
                            Showing <strong>{filteredData.length}</strong> of <strong>{demoSuppliers.length}</strong> entries
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