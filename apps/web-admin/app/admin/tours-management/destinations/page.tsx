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
    Compass,
    Building,
    Image as ImageIcon,
    CheckCircle2,
    XCircle,
    Globe,
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
type Region = "NORTHERN" | "CENTRAL" | "SOUTHERN";

interface Destination {
    id: string;
    code: string;
    nameEn: string;
    nameLa: string;
    province: string;
    region: Region;
    totalToursCount: number;
    featuredSpotsCount: number;
    isActive: boolean;
    updatedAt: string;
}

// 2. Demo Mock Data
const demoDestinations: Destination[] = [
    {
        id: "dest-1",
        code: "DEST-LPB",
        nameEn: "Luang Prabang",
        nameLa: "ຫຼວງພະບາງ",
        province: "Luang Prabang",
        region: "NORTHERN",
        totalToursCount: 12,
        featuredSpotsCount: 8,
        isActive: true,
        updatedAt: "2026-07-28",
    },
    {
        id: "dest-2",
        code: "DEST-VTE",
        nameEn: "Vientiane Capital",
        nameLa: "ນະຄອນຫຼວງວຽງຈັນ",
        province: "Vientiane Capital",
        region: "CENTRAL",
        totalToursCount: 6,
        featuredSpotsCount: 5,
        isActive: true,
        updatedAt: "2026-07-25",
    },
    {
        id: "dest-3",
        code: "DEST-VVG",
        nameEn: "Vang Vieng",
        nameLa: "ວັງວຽງ",
        province: "Vientiane Province",
        region: "CENTRAL",
        totalToursCount: 9,
        featuredSpotsCount: 6,
        isActive: true,
        updatedAt: "2026-07-20",
    },
    {
        id: "dest-4",
        code: "DEST-CPS",
        nameEn: "Champasak & 4,000 Islands",
        nameLa: "ຈຳປາສັກ ແລະ ສີ່ພັນດອນ",
        province: "Champasak",
        region: "SOUTHERN",
        totalToursCount: 7,
        featuredSpotsCount: 4,
        isActive: true,
        updatedAt: "2026-07-15",
    },
    {
        id: "dest-5",
        code: "DEST-XKH",
        nameEn: "Xieng Khouang (Plain of Jars)",
        nameLa: "ຊຽງຂວາງ (ທົ່ງໄຫຫີນ)",
        province: "Xieng Khouang",
        region: "NORTHERN",
        totalToursCount: 3,
        featuredSpotsCount: 3,
        isActive: false,
        updatedAt: "2026-06-30",
    },
];

export default function DestinationsListPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [regionFilter, setRegionFilter] = useState<string>("ALL");

    // Filter Logic
    const filteredData = demoDestinations.filter((item) => {
        const matchesSearch =
            item.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nameLa.includes(searchTerm) ||
            item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.province.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRegion = regionFilter === "ALL" || item.region === regionFilter;

        return matchesSearch && matchesRegion;
    });

    const getRegionBadge = (region: Region) => {
        switch (region) {
            case "NORTHERN":
                return <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50/50">Northern Laos</Badge>;
            case "CENTRAL":
                return <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50/50">Central Laos</Badge>;
            case "SOUTHERN":
                return <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50/50">Southern Laos</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Destinations Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage provinces, regions, and key travel destinations across Laos.
                    </p>
                </div>
                <Link href="/admin/tours-management/destinations/create">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Destination
                    </Button>
                </Link>
            </div>

            {/* Quick Summary Stats */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Total Destinations</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold">18</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Northern Region</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold text-blue-600">8</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Central Region</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold text-amber-600">5</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Southern Region</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold text-emerald-600">5</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table Card */}
            <Card>
                <CardHeader className="pb-3 space-y-4">
                    <div>
                        <CardTitle>Destinations Catalog</CardTitle>
                        <CardDescription>Master list of geographic locations used for tour grouping.</CardDescription>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                        {/* Filter controls */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search destination, province..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Button variant={"outline"}>Refresh Data</Button>
                            <Select value={regionFilter} onValueChange={setRegionFilter}>
                                <SelectTrigger className="w-40 text-sm">
                                    <SelectValue placeholder="Region" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Regions</SelectItem>
                                    <SelectItem value="NORTHERN">Northern Laos</SelectItem>
                                    <SelectItem value="CENTRAL">Central Laos</SelectItem>
                                    <SelectItem value="SOUTHERN">Southern Laos</SelectItem>
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
                                    <TableHead>Destination Name</TableHead>
                                    <TableHead>Province</TableHead>
                                    <TableHead>Region Tag</TableHead>
                                    <TableHead className="text-center">Active Tours</TableHead>
                                    <TableHead className="text-center">Attractions</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            No destination records found.
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
                                                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                                                    <span>{item.nameEn}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground pl-5.5">{item.nameLa}</div>
                                            </TableCell>
                                            <TableCell className="text-xs font-medium">
                                                {item.province}
                                            </TableCell>
                                            <TableCell>{getRegionBadge(item.region)}</TableCell>
                                            <TableCell className="text-center font-mono text-xs font-semibold">
                                                {item.totalToursCount} Tours
                                            </TableCell>
                                            <TableCell className="text-center font-mono text-xs text-muted-foreground">
                                                {item.featuredSpotsCount} Spots
                                            </TableCell>
                                            <TableCell>
                                                {item.isActive ? (
                                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="text-zinc-500">Disabled</Badge>
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
                                                            <Eye className="h-4 w-4 text-muted-foreground" /> View Destination
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 cursor-pointer">
                                                            <Edit className="h-4 w-4 text-muted-foreground" /> Edit Details
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
                            Showing <strong>{filteredData.length}</strong> of <strong>{demoDestinations.length}</strong> entries
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