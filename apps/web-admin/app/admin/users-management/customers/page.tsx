"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Users,
    UserPlus,
    Search,
    SlidersHorizontal,
    Mail,
    Phone,
    MoreVertical,
    Eye,
    Edit,
    ShieldCheck,
    ShieldAlert,
    Download,
    Calendar,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
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

interface Customer {
    id: string;
    customerCode: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl?: string;
    totalBookings: number;
    totalSpent: number;
    status: "ACTIVE" | "INACTIVE" | "BLOCKED";
    joinedDate: string;
}

const mockCustomers: Customer[] = [
    {
        id: "cust-1",
        customerCode: "CUST-001",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+856 20 5551 2345",
        totalBookings: 8,
        totalSpent: 1450,
        status: "ACTIVE",
        joinedDate: "2026-01-15",
    },
    {
        id: "cust-2",
        customerCode: "CUST-002",
        name: "Souphaphone Seng",
        email: "souphaphone@example.com",
        phone: "+856 20 9988 7766",
        totalBookings: 14,
        totalSpent: 3200,
        status: "ACTIVE",
        joinedDate: "2026-02-10",
    },
    {
        id: "cust-3",
        customerCode: "CUST-003",
        name: "Michael Smith",
        email: "m.smith@example.com",
        phone: "+856 20 2233 4455",
        totalBookings: 1,
        totalSpent: 120,
        status: "INACTIVE",
        joinedDate: "2026-05-20",
    },
];

export default function CustomersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const filteredCustomers = mockCustomers.filter((customer) => {
        const matchesSearch =
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || customer.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8">
            {/* Top Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Customers Management</h1>
                        <Badge variant="secondary" className="font-mono text-xs">
                            {mockCustomers.length} Total
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage customer accounts, view booking history, and handle user permissions.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 text-xs">
                        <Download className="h-3.5 w-3.5" />
                        Export CSV
                    </Button>
                    <Button size="sm" className="gap-2 text-xs">
                        <Link href="/admin/users-management/customers/create" className="flex items-center gap-1">
                            <UserPlus className="h-4 w-4" />
                            Add Customer
                        </Link>
                    </Button>
                </div>
            </div>

            {/* KPI Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-primary shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Total Customers
                            </p>
                            <p className="text-2xl font-extrabold font-mono mt-1">1,248</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Users className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Active Accounts
                            </p>
                            <p className="text-2xl font-extrabold font-mono mt-1 text-emerald-600">1,180</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Inactive / Suspended
                            </p>
                            <p className="text-2xl font-extrabold font-mono mt-1 text-amber-600">68</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                            <ShieldAlert className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table Section */}
            <Card className="shadow-sm border">
                <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search name, email, code..."
                            className="pl-9 h-9 text-xs bg-background"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <Button variant={"outline"}>Refresh Data</Button>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[160px] h-9 text-xs bg-background">
                                <SelectValue placeholder="Status Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Statuses</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                                <SelectItem value="BLOCKED">Blocked</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="w-[120px] text-xs">Customer Code</TableHead>
                                    <TableHead className="text-xs">Customer Name</TableHead>
                                    <TableHead className="text-xs">Contact Info</TableHead>
                                    <TableHead className="text-xs text-center">Bookings</TableHead>
                                    <TableHead className="text-xs text-right">Total Spent</TableHead>
                                    <TableHead className="text-xs">Joined Date</TableHead>
                                    <TableHead className="text-xs">Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCustomers.map((customer) => {
                                    const initial = customer.name.substring(0, 2).toUpperCase();

                                    return (
                                        <TableRow key={customer.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-mono text-xs font-semibold text-primary">
                                                {customer.customerCode}
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 text-xs font-bold border">
                                                        <AvatarFallback className="bg-primary/5 text-primary">
                                                            {initial}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="font-semibold text-xs text-foreground">{customer.name}</div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="space-y-0.5 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                                        {customer.email}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Phone className="h-3 w-3 text-muted-foreground" />
                                                        {customer.phone}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-center font-mono text-xs font-medium">
                                                {customer.totalBookings}
                                            </TableCell>

                                            <TableCell className="text-right font-mono text-xs font-semibold text-emerald-600">
                                                ${customer.totalSpent.toLocaleString()}
                                            </TableCell>

                                            <TableCell className="text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3 w-3" />
                                                    {customer.joinedDate}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                {customer.status === "ACTIVE" && (
                                                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-300/50 text-[10px]">
                                                        Active
                                                    </Badge>
                                                )}
                                                {customer.status === "INACTIVE" && (
                                                    <Badge variant="secondary" className="text-[10px]">
                                                        Inactive
                                                    </Badge>
                                                )}
                                                {customer.status === "BLOCKED" && (
                                                    <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/25 border-destructive/30 text-[10px]">
                                                        Blocked
                                                    </Badge>
                                                )}
                                            </TableCell>

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
                                                            <Link href={`/admin/users-management/customers/${customer.id}`}>
                                                                <Eye className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                                                View Profile
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Edit className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                                            Edit Customer
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="cursor-pointer text-destructive">
                                                            Block Account
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}