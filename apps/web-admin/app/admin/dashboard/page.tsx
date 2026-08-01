"use client"

import React from "react";
import {
    Bell,
    Search,
    LayoutDashboard,
    Users,
    CreditCard,
    Settings,
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    Moon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen">
            {/* Main Content Area */}
            <div className="flex flex-1 flex-col">
                {/* Dashboard Content */}
                <main className="flex-1 space-y-6">
                    {/* Header Action Row */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
                            <p className="text-sm text-muted-foreground">
                                Here is what&apos;s happening with your store today.
                            </p>
                        </div>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Report
                        </Button>
                    </div>

                    {/* Metric Cards Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$45,231.89</div>
                                <p className="flex items-center text-xs text-emerald-600 mt-1">
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                    +20.1% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+2,350</div>
                                <p className="flex items-center text-xs text-emerald-600 mt-1">
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                    +180.1% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+12,234</div>
                                <p className="flex items-center text-xs text-emerald-600 mt-1">
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                    +19% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+573</div>
                                <p className="flex items-center text-xs text-rose-600 mt-1">
                                    <ArrowDownRight className="h-3 w-3 mr-1" />
                                    -4% since last hour
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Grid: Transactions & Activity */}
                    <div className="grid gap-6 md:grid-cols-7">
                        {/* Recent Transactions Table */}
                        <Card className="md:col-span-4">
                            <CardHeader>
                                <CardTitle>Recent Transactions</CardTitle>
                                <CardDescription>
                                    You made 265 transactions this month.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <div className="font-medium">Liam Johnson</div>
                                                <div className="text-xs text-muted-foreground">liam@example.com</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                                                    Approved
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">$250.00</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <div className="font-medium">Olivia Smith</div>
                                                <div className="text-xs text-muted-foreground">olivia@example.com</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                                                    Approved
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">$150.00</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <div className="font-medium">Noah Williams</div>
                                                <div className="text-xs text-muted-foreground">noah@example.com</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                                                    Pending
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">$350.00</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Overview Placeholder / Activity Feed */}
                        <Card className="md:col-span-3">
                            <CardHeader>
                                <CardTitle>Recent Sales</CardTitle>
                                <CardDescription>
                                    You made 265 sales this month.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {[
                                        { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00" },
                                        { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00" },
                                        { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00" },
                                        { name: "William Kim", email: "will@email.com", amount: "+$99.00" },
                                    ].map((user, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="text-sm font-medium">{user.amount}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}