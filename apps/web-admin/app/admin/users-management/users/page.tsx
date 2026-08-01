"use client";

import { useState } from "react";
import Link from "next/link";
import {
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
    KeyRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
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

interface SystemUser {
    id: string;
    userCode: string;
    name: string;
    email: string;
    phone: string;
    role: "ADMIN" | "MANAGER" | "STAFF" | "OPERATOR";
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    createdDate: string;
}

const mockUsers: SystemUser[] = [
    {
        id: "usr-1",
        userCode: "USR-001",
        name: "Khamla Phommavong",
        email: "khamla.p@admin.la",
        phone: "+856 20 5511 2233",
        role: "ADMIN",
        status: "ACTIVE",
        createdDate: "2026-01-10",
    },
    {
        id: "usr-2",
        userCode: "USR-002",
        name: "Soukdavon Inthavong",
        email: "soukdavon.i@admin.la",
        phone: "+856 20 9988 1122",
        role: "MANAGER",
        status: "ACTIVE",
        createdDate: "2026-02-01",
    },
    {
        id: "usr-3",
        userCode: "USR-003",
        name: "Vongdeuane Chanthala",
        email: "vongdeuane.c@admin.la",
        phone: "+856 20 7744 5566",
        role: "STAFF",
        status: "INACTIVE",
        createdDate: "2026-04-12",
    },
];

export default function SystemUsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const filteredUsers = mockUsers.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.userCode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
        const matchesStatus = statusFilter === "ALL" || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleBadge = (role: SystemUser["role"]) => {
        switch (role) {
            case "ADMIN":
                return <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-300/50 text-[10px]">Super Admin</Badge>;
            case "MANAGER":
                return <Badge className="bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-300/50 text-[10px]">Manager</Badge>;
            case "STAFF":
                return <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-300/50 text-[10px]">Staff</Badge>;
            default:
                return <Badge variant="secondary" className="text-[10px]">{role}</Badge>;
        }
    };

    return (
        <div className="space-y-8">
            {/* Top Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">System Users Management</h1>
                        <Badge variant="secondary" className="font-mono text-xs">
                            {mockUsers.length} Users
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage administrative accounts, role permissions, and access privileges.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 text-xs">
                        <Download className="h-3.5 w-3.5" />
                        Export List
                    </Button>
                    <Button asChild size="sm" className="gap-2 text-xs">
                        <Link href="/admin/users-management/users/create" className="flex items-center gap-1">
                            <UserPlus className="h-4 w-4" />
                            Create New User
                        </Link>
                    </Button>
                </div>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-primary shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Admins & Staff</p>
                            <p className="text-2xl font-extrabold font-mono mt-1">24</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <KeyRound className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Users</p>
                            <p className="text-2xl font-extrabold font-mono mt-1 text-emerald-600">21</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Suspended / Inactive</p>
                            <p className="text-2xl font-extrabold font-mono mt-1 text-amber-600">3</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                            <ShieldAlert className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table Card */}
            <Card className="shadow-sm border">
                <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search user, email, ID..."
                                className="pl-9 h-9 text-xs bg-background"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                         <Button variant={"outline"}>Refresh Data</Button>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-[130px] h-9 text-xs bg-background">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Roles</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="MANAGER">Manager</SelectItem>
                                <SelectItem value="STAFF">Staff</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[130px] h-9 text-xs bg-background">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Statuses</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="w-[110px] text-xs">User ID</TableHead>
                                    <TableHead className="text-xs">User Name</TableHead>
                                    <TableHead className="text-xs">Contact Information</TableHead>
                                    <TableHead className="text-xs">System Role</TableHead>
                                    <TableHead className="text-xs">Created Date</TableHead>
                                    <TableHead className="text-xs">Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => {
                                    const initials = user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .substring(0, 2)
                                        .toUpperCase();

                                    return (
                                        <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-mono text-xs font-semibold text-primary">
                                                {user.userCode}
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 text-xs font-bold border">
                                                        <AvatarFallback className="bg-primary/5 text-primary">
                                                            {initials}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="font-semibold text-xs text-foreground">{user.name}</div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="space-y-0.5 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                                        {user.email}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Phone className="h-3 w-3 text-muted-foreground" />
                                                        {user.phone}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>{getRoleBadge(user.role)}</TableCell>

                                            <TableCell className="text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3 w-3" />
                                                    {user.createdDate}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                {user.status === "ACTIVE" && (
                                                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300/50 text-[10px]">
                                                        Active
                                                    </Badge>
                                                )}
                                                {user.status === "INACTIVE" && (
                                                    <Badge variant="secondary" className="text-[10px]">
                                                        Inactive
                                                    </Badge>
                                                )}
                                                {user.status === "SUSPENDED" && (
                                                    <Badge className="bg-destructive/15 text-destructive border-destructive/30 text-[10px]">
                                                        Suspended
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
                                                            <Link href={`/admin/users-management/users/${user.id}`}>
                                                                <Eye className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                                                View Profile
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Edit className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                                            Edit Permissions
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="cursor-pointer text-destructive">
                                                            Disable Account
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