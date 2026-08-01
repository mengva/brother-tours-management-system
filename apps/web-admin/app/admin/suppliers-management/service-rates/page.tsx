"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Building2,
    Hotel,
    Bus,
    UserCheck,
    Ticket,
    Utensils,
    Calendar,
    DollarSign,
    Layers,
    CheckCircle2,
    AlertCircle,
    Copy,
    ArrowUpDown,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Label } from "@workspace/ui/components/label";
import { useRouter } from "next/navigation";

// 1. Types
type ServiceType = "ROOM_NIGHT" | "VEHICLE_DAILY" | "GUIDE_DAILY" | "MEAL_PER_PAX" | "ENTRANCE_FEE";
type Currency = "USD" | "LAK" | "THB";
type SeasonType = "HIGH_SEASON" | "LOW_SEASON" | "PEAK_SEASON";

interface ServiceRate {
    id: string;
    rateCode: string;
    supplierCode: string;
    supplierName: string;
    serviceCategory: ServiceType;
    serviceName: string; // e.g., "Deluxe Garden View", "VIP Minivan 15-Seater", "English Tour Guide"
    unit: string; // "Per Room/Night", "Per Day", "Per Person"
    netRate: number;
    sellingRate: number;
    currency: Currency;
    season: SeasonType;
    validFrom: string;
    validTo: string;
    isContracted: boolean;
}

// 2. Mock Data
const demoRates: ServiceRate[] = [
    {
        id: "rate-1",
        rateCode: "RAT-2026-001",
        supplierCode: "SUP-HTL-001",
        supplierName: "Avani+ Luang Prabang Resort",
        serviceCategory: "ROOM_NIGHT",
        serviceName: "Avani Deluxe Room (Includes Breakfast)",
        unit: "Per Room / Night",
        netRate: 180,
        sellingRate: 230,
        currency: "USD",
        season: "HIGH_SEASON",
        validFrom: "2026-10-01",
        validTo: "2027-04-30",
        isContracted: true,
    },
    {
        id: "rate-2",
        rateCode: "RAT-2026-002",
        supplierCode: "SUP-HTL-001",
        supplierName: "Avani+ Luang Prabang Resort",
        serviceCategory: "ROOM_NIGHT",
        serviceName: "Avani Deluxe Room (Includes Breakfast)",
        unit: "Per Room / Night",
        netRate: 120,
        sellingRate: 160,
        currency: "USD",
        season: "LOW_SEASON",
        validFrom: "2026-05-01",
        validTo: "2026-09-30",
        isContracted: true,
    },
    {
        id: "rate-3",
        rateCode: "RAT-2026-003",
        supplierCode: "SUP-TRN-002",
        supplierName: "Lao-China Transport Express",
        serviceCategory: "VEHICLE_DAILY",
        serviceName: "Toyota Commuter Van 15-Seater (Fuel included)",
        unit: "Per Day",
        netRate: 1800000,
        sellingRate: 2300000,
        currency: "LAK",
        season: "HIGH_SEASON",
        validFrom: "2026-01-01",
        validTo: "2026-12-31",
        isContracted: true,
    },
    {
        id: "rate-4",
        rateCode: "RAT-2026-004",
        supplierCode: "SUP-GDE-003",
        supplierName: "Sengchanh Tour Guide Services",
        serviceCategory: "GUIDE_DAILY",
        serviceName: "National English Speaking Guide",
        unit: "Per Day",
        netRate: 50,
        sellingRate: 70,
        currency: "USD",
        season: "HIGH_SEASON",
        validFrom: "2026-01-01",
        validTo: "2026-12-31",
        isContracted: true,
    },
    {
        id: "rate-5",
        rateCode: "RAT-2026-005",
        supplierCode: "SUP-RST-004",
        supplierName: "Tamarind Lao Restaurant",
        serviceCategory: "MEAL_PER_PAX",
        serviceName: "Lao Discovery Tasting Menu (Lunch/Dinner)",
        unit: "Per Person",
        netRate: 450,
        sellingRate: 600,
        currency: "THB",
        season: "HIGH_SEASON",
        validFrom: "2026-01-01",
        validTo: "2026-12-31",
        isContracted: false,
    },
];

export default function ServiceRatesPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
    const [seasonFilter, setSeasonFilter] = useState<string>("ALL");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Form State for Quick Modal Add
    const [newSupplier, setNewSupplier] = useState("");
    const [newServiceName, setNewServiceName] = useState("");
    const [newCategory, setNewCategory] = useState<ServiceType>("ROOM_NIGHT");
    const [newNetRate, setNewNetRate] = useState("");
    const [newSellingRate, setNewSellingRate] = useState("");
    const [newCurrency, setNewCurrency] = useState<Currency>("USD");

    // Filtering Logic
    const filteredRates = demoRates.filter((rate) => {
        const matchesSearch =
            rate.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rate.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rate.rateCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rate.supplierCode.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = categoryFilter === "ALL" || rate.serviceCategory === categoryFilter;
        const matchesSeason = seasonFilter === "ALL" || rate.season === seasonFilter;

        return matchesSearch && matchesCategory && matchesSeason;
    });

    // Helpers
    const getCategoryBadge = (category: ServiceType) => {
        switch (category) {
            case "ROOM_NIGHT":
                return (
                    <Badge variant="outline" className="text-indigo-600 border-indigo-300 bg-indigo-50/50 gap-1">
                        <Hotel className="h-3 w-3" /> Accommodation
                    </Badge>
                );
            case "VEHICLE_DAILY":
                return (
                    <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50/50 gap-1">
                        <Bus className="h-3 w-3" /> Transport
                    </Badge>
                );
            case "GUIDE_DAILY":
                return (
                    <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50/50 gap-1">
                        <UserCheck className="h-3 w-3" /> Tour Guide
                    </Badge>
                );
            case "MEAL_PER_PAX":
                return (
                    <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50/50 gap-1">
                        <Utensils className="h-3 w-3" /> Dining
                    </Badge>
                );
            case "ENTRANCE_FEE":
                return (
                    <Badge variant="outline" className="text-purple-600 border-purple-300 bg-purple-50/50 gap-1">
                        <Ticket className="h-3 w-3" /> Attraction
                    </Badge>
                );
        }
    };

    const getSeasonBadge = (season: SeasonType) => {
        switch (season) {
            case "HIGH_SEASON":
                return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">High Season</Badge>;
            case "LOW_SEASON":
                return <Badge className="bg-sky-500/10 text-sky-600 border-sky-500/20">Low Season</Badge>;
            case "PEAK_SEASON":
                return <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20">Peak / Holiday</Badge>;
        }
    };

    const formatPrice = (amount: number, currency: Currency) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
            maximumFractionDigits: currency === "LAK" ? 0 : 2,
        }).format(amount);
    };

    const calculateMargin = (net: number, selling: number) => {
        if (!net || net === 0) return "0%";
        const margin = ((selling - net) / net) * 100;
        return `+${margin.toFixed(1)}%`;
    };

    return (
        <div className="space-y-6">
            {/* Top Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Contract & Service Rates</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage confidential supplier net rates, selling rates, and seasonal price rules.
                    </p>
                </div>

                <Button className="gap-2" onClick={() => router.push("/admin/suppliers-management/service-rates/create")}>
                    <Plus className="h-4 w-4" />
                    Add New Rate
                </Button>

            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Total Rate Cards</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold">148</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Active Contracts</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold text-emerald-600">132</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">High Season Rates</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold text-orange-600">84</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Average Profit Margin</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold text-indigo-600">24.5%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table Card */}
            <Card>
                <CardHeader className="pb-3 space-y-4">
                    <div>
                        <CardTitle>Rate Matrix Directory</CardTitle>
                        <CardDescription>Filter rates by supplier category, season, or name.</CardDescription>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search rate, service, supplier..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Button variant={"outline"}>Refresh Data</Button>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-36 text-sm">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Services</SelectItem>
                                    <SelectItem value="ROOM_NIGHT">Hotels</SelectItem>
                                    <SelectItem value="VEHICLE_DAILY">Transport</SelectItem>
                                    <SelectItem value="GUIDE_DAILY">Tour Guides</SelectItem>
                                    <SelectItem value="MEAL_PER_PAX">Dining</SelectItem>
                                    <SelectItem value="ENTRANCE_FEE">Attractions</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                                <SelectTrigger className="w-36 text-sm">
                                    <SelectValue placeholder="Season" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Seasons</SelectItem>
                                    <SelectItem value="HIGH_SEASON">High Season</SelectItem>
                                    <SelectItem value="LOW_SEASON">Low Season</SelectItem>
                                    <SelectItem value="PEAK_SEASON">Peak Season</SelectItem>
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
                                    <TableHead className="w-28">Rate Code</TableHead>
                                    <TableHead className="min-w-[200px]">Supplier / Vendor</TableHead>
                                    <TableHead className="min-w-[220px]">Service & Option</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Net Cost Rate</TableHead>
                                    <TableHead className="text-right">Selling Rate</TableHead>
                                    <TableHead className="text-center">Margin</TableHead>
                                    <TableHead>Season & Period</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRates.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                            No service rate records matched your query.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRates.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-mono text-xs font-semibold">
                                                {item.rateCode}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-semibold text-sm flex items-center gap-1.5">
                                                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                                                    <span className="truncate max-w-[180px]">{item.supplierName}</span>
                                                </div>
                                                <div className="text-[11px] font-mono text-muted-foreground pl-5.5">
                                                    {item.supplierCode}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-sm">{item.serviceName}</div>
                                                <div className="text-xs text-muted-foreground">{item.unit}</div>
                                            </TableCell>
                                            <TableCell>{getCategoryBadge(item.serviceCategory)}</TableCell>
                                            <TableCell className="text-right font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                                {formatPrice(item.netRate, item.currency)}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-xs font-bold text-emerald-600">
                                                {formatPrice(item.sellingRate, item.currency)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary" className="font-mono text-[11px] text-indigo-600 bg-indigo-50">
                                                    {calculateMargin(item.netRate, item.sellingRate)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {getSeasonBadge(item.season)}
                                                    <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>{item.validFrom} - {item.validTo}</span>
                                                    </div>
                                                </div>
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
                                                            <Edit className="h-4 w-4 text-muted-foreground" /> Edit Rate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 cursor-pointer">
                                                            <Copy className="h-4 w-4 text-muted-foreground" /> Duplicate Rate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
                                                            <Trash2 className="h-4 w-4" /> Remove Rate
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

                    <div className="flex items-center justify-between pt-4 text-xs text-muted-foreground">
                        <div>
                            Showing <strong>{filteredRates.length}</strong> of <strong>{demoRates.length}</strong> rates
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