"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Building2,
    Calendar,
    Eye,
    TrendingDown,
    TrendingUp,
    SlidersHorizontal,
    MoreVertical,
    Download,
    RotateCcw,
    Sparkles,
    ArrowUpRight,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

interface PriceAudit {
    id: string;
    auditCode: string;
    supplierName: string;
    category: string;
    auditDate: string;
    auditor: string;
    discrepanciesCount: number;
    variancePercentage: number;
    status: "PASSED" | "FLAGGED" | "PENDING_REVIEW";
}

const mockAudits: PriceAudit[] = [
    {
        id: "aud-1",
        auditCode: "AUD-2026-001",
        supplierName: "Avani+ Luang Prabang Resort",
        category: "Accommodation",
        auditDate: "2026-07-28",
        auditor: "Somchai K.",
        discrepanciesCount: 0,
        variancePercentage: 0,
        status: "PASSED",
    },
    {
        id: "aud-2",
        auditCode: "AUD-2026-002",
        supplierName: "Lao-China Express Transport",
        category: "Transport",
        auditDate: "2026-07-29",
        auditor: "Khamla P.",
        discrepanciesCount: 3,
        variancePercentage: 12.5,
        status: "FLAGGED",
    },
    {
        id: "aud-3",
        auditCode: "AUD-2026-003",
        supplierName: "Tamarind Lao Restaurant",
        category: "Dining",
        auditDate: "2026-07-30",
        auditor: "Anousone S.",
        discrepanciesCount: 1,
        variancePercentage: -4.2,
        status: "PENDING_REVIEW",
    },
    {
        id: "aud-4",
        auditCode: "AUD-2026-004",
        supplierName: "Green Discovery Laos",
        category: "Activities",
        auditDate: "2026-07-31",
        auditor: "Somchai K.",
        discrepanciesCount: 0,
        variancePercentage: 0,
        status: "PASSED",
    },
];

export default function PriceAuditsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const filteredAudits = mockAudits.filter((audit) => {
        const matchesSearch =
            audit.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            audit.auditCode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || audit.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8">
            {/* Top Banner Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Price Audits</h1>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Monitor, audit, and compare supplier rate cards against live bookings to capture cost leakages.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 text-xs">
                        <Download className="h-3.5 w-3.5" />
                        Export Report
                    </Button>
                    <Button size="sm" className="gap-2 text-xs">
                        <Link href="/admin/suppliers-management/price-audits/create" className="text-nowrap flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            Perform New Audit
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Modern High-Density KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* KPI 1: Total Audits Passed */}
                <Card className="relative overflow-hidden border-l-4 border-l-emerald-500 shadow-sm transition-all hover:shadow-md">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Audits Passed
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-extrabold font-mono tracking-tight">82.5%</span>
                                <span className="text-xs text-emerald-600 font-semibold flex items-center">
                                    <ArrowUpRight className="h-3 w-3" /> +4%
                                </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">18 out of 22 verified</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                {/* KPI 2: Rate Discrepancies */}
                <Card className="relative overflow-hidden border-l-4 border-l-amber-500 shadow-sm transition-all hover:shadow-md">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Rate Leakages / Flagged
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-extrabold font-mono tracking-tight text-amber-600">
                                    4 Items
                                </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">Requires invoice reconciliation</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                {/* KPI 3: Average Margin Variance */}
                <Card className="relative overflow-hidden border-l-4 border-l-indigo-500 shadow-sm transition-all hover:shadow-md">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Avg Variance Rate
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-extrabold font-mono tracking-tight text-indigo-600">
                                    +2.8%
                                </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">Within acceptable margin band</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600">
                            <Sparkles className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table Container */}
            <Card className="shadow-sm border">
                {/* Table Filter Controls */}
                <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search code, supplier..."
                            className="pl-9 h-9 text-xs bg-background"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <Button variant={"outline"}>Refresh Data</Button>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[160px] h-9 text-xs bg-background">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Statuses</SelectItem>
                                <SelectItem value="PASSED">Passed</SelectItem>
                                <SelectItem value="FLAGGED">Flagged</SelectItem>
                                <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Audit Logs Table */}
                <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="w-[140px] text-xs">Audit Ref</TableHead>
                                    <TableHead className="text-xs">Supplier Partner</TableHead>
                                    <TableHead className="text-xs">Category</TableHead>
                                    <TableHead className="text-xs">Audit Date</TableHead>
                                    <TableHead className="text-xs text-center">Discrepancies</TableHead>
                                    <TableHead className="text-xs text-right">Rate Variance</TableHead>
                                    <TableHead className="text-xs">Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAudits.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-sm">
                                            No price audits matched your search filter.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAudits.map((audit) => {
                                        const supplierInitial = audit.supplierName.substring(0, 2).toUpperCase();

                                        return (
                                            <TableRow key={audit.id} className="hover:bg-muted/30 transition-colors">
                                                {/* Audit Ref */}
                                                <TableCell className="font-mono text-xs font-semibold text-primary">
                                                    {audit.auditCode}
                                                </TableCell>

                                                {/* Supplier Partner */}
                                                <TableCell>
                                                    <div className="flex items-center gap-2.5">
                                                        <Avatar className="h-7 w-7 text-[10px] font-bold border">
                                                            <AvatarFallback className="bg-primary/5 text-primary">
                                                                {supplierInitial}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="text-xs font-semibold text-foreground line-clamp-1">
                                                                {audit.supplierName}
                                                            </div>
                                                            <div className="text-[10px] text-muted-foreground">
                                                                Auditor: {audit.auditor}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* Category */}
                                                <TableCell>
                                                    <Badge variant="outline" className="text-[10px] font-normal px-2 py-0.5">
                                                        {audit.category}
                                                    </Badge>
                                                </TableCell>

                                                {/* Audit Date */}
                                                <TableCell className="text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                                        {audit.auditDate}
                                                    </div>
                                                </TableCell>

                                                {/* Discrepancies Count */}
                                                <TableCell className="text-center font-mono text-xs">
                                                    {audit.discrepanciesCount > 0 ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-600">
                                                            {audit.discrepanciesCount} items
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground text-[11px]">Clean</span>
                                                    )}
                                                </TableCell>

                                                {/* Variance Percentage */}
                                                <TableCell className="text-right font-mono text-xs">
                                                    {audit.variancePercentage > 0 ? (
                                                        <span className="text-destructive font-bold inline-flex items-center justify-end gap-0.5">
                                                            <TrendingUp className="h-3 w-3" /> +{audit.variancePercentage}%
                                                        </span>
                                                    ) : audit.variancePercentage < 0 ? (
                                                        <span className="text-emerald-600 font-bold inline-flex items-center justify-end gap-0.5">
                                                            <TrendingDown className="h-3 w-3" /> {audit.variancePercentage}%
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">0.0%</span>
                                                    )}
                                                </TableCell>

                                                {/* Status Badge */}
                                                <TableCell>
                                                    {audit.status === "PASSED" && (
                                                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-300/50 text-[10px]">
                                                            Passed
                                                        </Badge>
                                                    )}
                                                    {audit.status === "FLAGGED" && (
                                                        <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/25 border-destructive/30 text-[10px]">
                                                            Flagged
                                                        </Badge>
                                                    )}
                                                    {audit.status === "PENDING_REVIEW" && (
                                                        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/25 border-amber-300/50 text-[10px]">
                                                            In Review
                                                        </Badge>
                                                    )}
                                                </TableCell>

                                                {/* Action Dropdown Menu */}
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                                                <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40 text-xs">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem asChild className="cursor-pointer">
                                                                <Link href={`/admin/suppliers-management/price-audits/${audit.id}`}>
                                                                    <Eye className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="cursor-pointer">
                                                                <RotateCcw className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                                                Re-run Audit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="cursor-pointer text-destructive">
                                                                Flag Incident
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}