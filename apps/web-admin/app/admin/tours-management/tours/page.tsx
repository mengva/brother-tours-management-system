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
    MapPin,
    Clock,
    Compass,
    Star,
    Users,
    Image as ImageIcon,
    DollarSign,
    Copy,
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
type TourStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";
type Difficulty = "EASY" | "MODERATE" | "CHALLENGING";

interface Tour {
    id: string;
    code: string;
    title: string;
    category: string;
    durationDays: number;
    durationNights: number;
    startingPrice: number;
    currency: "USD" | "LAK" | "THB";
    location: string;
    difficulty: Difficulty;
    status: TourStatus;
    featured: boolean;
    coverImage?: string;
    updatedAt: string;
}

// 2. Demo Mock Data
const demoTours: Tour[] = [
    {
        id: "tour-1",
        code: "BT-LP-001",
        title: "Luang Prabang Cultural Heritage & Kuang Si Waterfall",
        category: "Cultural & Heritage",
        durationDays: 3,
        durationNights: 2,
        startingPrice: 280,
        currency: "USD",
        location: "Luang Prabang",
        difficulty: "EASY",
        status: "PUBLISHED",
        featured: true,
        updatedAt: "2026-07-28",
    },
    {
        id: "tour-2",
        code: "BT-VV-002",
        title: "Vang Vieng Adventure & Nam Xay Viewpoint Trekking",
        category: "Adventure & Eco",
        durationDays: 2,
        durationNights: 1,
        startingPrice: 150,
        currency: "USD",
        location: "Vang Vieng",
        difficulty: "MODERATE",
        status: "PUBLISHED",
        featured: true,
        updatedAt: "2026-07-25",
    },
    {
        id: "tour-3",
        code: "BT-SOUTH-003",
        title: "4,000 Islands & Khone Phapheng Falls Exploration",
        category: "Nature & Islands",
        durationDays: 4,
        durationNights: 3,
        startingPrice: 420,
        currency: "USD",
        location: "Champasak / Si Phan Don",
        difficulty: "EASY",
        status: "PUBLISHED",
        featured: false,
        updatedAt: "2026-07-18",
    },
    {
        id: "tour-4",
        code: "BT-XK-004",
        title: "Plain of Jars Mystery & Xieng Khouang Historical Tour",
        category: "History & Sightseeing",
        durationDays: 3,
        durationNights: 2,
        startingPrice: 310,
        currency: "USD",
        location: "Xieng Khouang",
        difficulty: "EASY",
        status: "DRAFT",
        featured: false,
        updatedAt: "2026-07-30",
    },
    {
        id: "tour-5",
        code: "BT-NK-005",
        title: "Nong Khiaw River Cruise & Pha Daeng Viewpoint Hike",
        category: "Trekking & Nature",
        durationDays: 3,
        durationNights: 2,
        startingPrice: 240,
        currency: "USD",
        location: "Nong Khiaw / Luang Prabang",
        difficulty: "CHALLENGING",
        status: "PUBLISHED",
        featured: false,
        updatedAt: "2026-07-12",
    },
    {
        id: "tour-6",
        code: "BT-VT-006",
        title: "Vientiane Capital Highlights & Buddha Park Express",
        category: "City Tour",
        durationDays: 1,
        durationNights: 0,
        startingPrice: 65,
        currency: "USD",
        location: "Vientiane",
        difficulty: "EASY",
        status: "ARCHIVED",
        featured: false,
        updatedAt: "2026-06-10",
    },
];

export default function ToursListPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

    // Filter Logic
    const filteredData = demoTours.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
        const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Helpers
    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat("en-US").format(price) + " " + currency;
    };

    const getStatusBadge = (status: TourStatus) => {
        switch (status) {
            case "PUBLISHED":
                return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Published</Badge>;
            case "DRAFT":
                return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-500/10">Draft</Badge>;
            case "ARCHIVED":
                return <Badge variant="secondary" className="text-zinc-500">Archived</Badge>;
        }
    };

    const getDifficultyBadge = (difficulty: Difficulty) => {
        switch (difficulty) {
            case "EASY":
                return <Badge variant="outline" className="text-emerald-600 border-emerald-300 text-[10px]">Easy</Badge>;
            case "MODERATE":
                return <Badge variant="outline" className="text-blue-600 border-blue-300 text-[10px]">Moderate</Badge>;
            case "CHALLENGING":
                return <Badge variant="outline" className="text-rose-600 border-rose-300 text-[10px]">Challenging</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Title & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Tours Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Create, publish, and manage master tour packages and itineraries.
                    </p>
                </div>
                <Link href="/admin/tours-management/tours/create">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Tour
                    </Button>
                </Link>
            </div>

            {/* Quick Summary Stats */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Total Tours Catalog</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold">24</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Active / Published</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold text-emerald-600">18</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Draft Packages</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold text-amber-600">4</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Featured Packages</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold text-indigo-600">6</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table Card */}
            <Card>
                <CardHeader className="pb-3 space-y-4">
                    <div>
                        <CardTitle>Tour Packages List</CardTitle>
                        <CardDescription>Master repository of tour offerings and pricing tiers.</CardDescription>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                        {/* Filter controls */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search code, tour name, location..."
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
                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-40 text-sm">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Categories</SelectItem>
                                    <SelectItem value="Cultural & Heritage">Cultural & Heritage</SelectItem>
                                    <SelectItem value="Adventure & Eco">Adventure & Eco</SelectItem>
                                    <SelectItem value="Nature & Islands">Nature & Islands</SelectItem>
                                    <SelectItem value="History & Sightseeing">History & Sightseeing</SelectItem>
                                    <SelectItem value="Trekking & Nature">Trekking & Nature</SelectItem>
                                    <SelectItem value="City Tour">City Tour</SelectItem>
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
                                    <TableHead className="w-28">Tour Code</TableHead>
                                    <TableHead className="min-w-[280px]">Tour Title & Category</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead className="text-center">Duration</TableHead>
                                    <TableHead className="text-right">Starting Price</TableHead>
                                    <TableHead className="text-center">Difficulty</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            No tour package records found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-mono text-xs font-semibold">
                                                <div className="flex items-center gap-1">
                                                    {item.featured && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                                                    <span>{item.code}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-semibold text-sm line-clamp-1">{item.title}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                                    <span className="bg-muted px-1.5 py-0.5 rounded text-[11px] font-medium">{item.category}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-xs font-medium flex items-center gap-1">
                                                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                                                    <span>{item.location}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center whitespace-nowrap">
                                                <div className="text-xs font-medium flex items-center justify-center gap-1">
                                                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {item.durationDays}D / {item.durationNights}N
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-sm font-bold whitespace-nowrap">
                                                {formatPrice(item.startingPrice, item.currency)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {getDifficultyBadge(item.difficulty)}
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
                                                            <Eye className="h-4 w-4 text-muted-foreground" /> View Itinerary
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 cursor-pointer">
                                                            <Edit className="h-4 w-4 text-muted-foreground" /> Edit Tour
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 cursor-pointer">
                                                            <Copy className="h-4 w-4 text-muted-foreground" /> Duplicate Tour
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
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
                            Showing <strong>{filteredData.length}</strong> of <strong>{demoTours.length}</strong> entries
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