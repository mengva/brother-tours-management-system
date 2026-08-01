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
    Filter,
    MessageSquare,
    PhoneCall,
    Globe,
    UserCheck,
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
type EnquiryStatus = "NEW" | "IN_PROGRESS" | "QUOTED" | "CONVERTED" | "CLOSED";
type InquiryChannel = "WHATSAPP" | "FACEBOOK" | "WALK_IN" | "PHONE" | "WEBSITE";

interface Enquiry {
    id: string;
    code: string;
    customerName: string;
    phone: string;
    destination: string;
    paxCount: number;
    travelDate: string;
    channel: InquiryChannel;
    status: EnquiryStatus;
    createdAt: string;
    assignedTo: string;
}

// 2. Demo Mock Data
const demoEnquiries: Enquiry[] = [
    {
        id: "enq-1",
        code: "ENQ-2026-001",
        customerName: "Sengdavone Phommasone",
        phone: "+856 20 5551 2345",
        destination: "Luang Prabang - Vang Vieng",
        paxCount: 4,
        travelDate: "2026-08-15",
        channel: "WHATSAPP",
        status: "NEW",
        createdAt: "2026-07-30 09:30",
        assignedTo: "Khamla (Sales)",
    },
    {
        id: "enq-2",
        code: "ENQ-2026-002",
        customerName: "John Anderson",
        phone: "+856 20 9988 7766",
        destination: "4,000 Islands & Champasak",
        paxCount: 2,
        travelDate: "2026-09-01",
        channel: "WEBSITE",
        status: "IN_PROGRESS",
        createdAt: "2026-07-29 14:15",
        assignedTo: "Souk (Sales)",
    },
    {
        id: "enq-3",
        code: "ENQ-2026-003",
        customerName: "Bounmi Sayasith",
        phone: "+856 20 2233 4455",
        destination: "Vientiane City Tour + Golf",
        paxCount: 8,
        travelDate: "2026-08-10",
        channel: "FACEBOOK",
        status: "QUOTED",
        createdAt: "2026-07-28 11:00",
        assignedTo: "Khamla (Sales)",
    },
    {
        id: "enq-4",
        code: "ENQ-2026-004",
        customerName: "Michael Chang",
        phone: "+856 20 7711 2233",
        destination: "Plain of Jars & Xieng Khouang",
        paxCount: 3,
        travelDate: "2026-10-05",
        channel: "PHONE",
        status: "CONVERTED",
        createdAt: "2026-07-25 16:45",
        assignedTo: "Noy (Manager)",
    },
    {
        id: "enq-5",
        code: "ENQ-2026-005",
        customerName: "Ketsana Vongsa",
        phone: "+856 20 5544 3322",
        destination: "Nong Khiaw Trekking",
        paxCount: 5,
        travelDate: "2026-08-20",
        channel: "WALK_IN",
        status: "CLOSED",
        createdAt: "2026-07-20 10:20",
        assignedTo: "Souk (Sales)",
    },
];

export default function EnquiriesListPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    // Filter Logic
    const filteredData = demoEnquiries.filter((item) => {
        const matchesSearch =
            item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.phone.includes(searchTerm);

        const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Badge Helpers
    const getStatusBadge = (status: EnquiryStatus) => {
        switch (status) {
            case "NEW":
                return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">New</Badge>;
            case "IN_PROGRESS":
                return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">In Progress</Badge>;
            case "QUOTED":
                return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">Quoted</Badge>;
            case "CONVERTED":
                return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Converted</Badge>;
            case "CLOSED":
                return <Badge variant="secondary">Closed</Badge>;
        }
    };

    const getChannelIcon = (channel: InquiryChannel) => {
        switch (channel) {
            case "WHATSAPP":
                return <span className="text-emerald-600 font-medium text-xs flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> WhatsApp</span>;
            case "FACEBOOK":
                return <span className="text-blue-600 font-medium text-xs flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> Facebook</span>;
            case "WEBSITE":
                return <span className="text-indigo-600 font-medium text-xs flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> Website</span>;
            case "PHONE":
                return <span className="text-amber-600 font-medium text-xs flex items-center gap-1"><PhoneCall className="h-3.5 w-3.5" /> Phone</span>;
            case "WALK_IN":
                return <span className="text-teal-600 font-medium text-xs flex items-center gap-1"><UserCheck className="h-3.5 w-3.5" /> Walk-In</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Title & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Customer Enquiries</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage incoming leads, travel requests, and customer inquiries.
                    </p>
                </div>
                <Link href="/admin/operations/enquiries/create">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Enquiry
                    </Button>
                </Link>
            </div>

            {/* Quick Summary Stats */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Total Enquiries</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold">128</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">New / Unassigned</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold text-blue-600">14</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Quotations Sent</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold text-purple-600">42</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="py-3 px-4">
                        <CardTitle className="text-xs font-medium text-muted-foreground">Conversion Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                        <div className="text-2xl font-bold text-emerald-600">34.5%</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table Card */}
            <Card>
                <CardHeader className="pb-3 space-y-4">
                    <div>
                        <CardTitle>Enquiry List</CardTitle>
                        <CardDescription>Showing all customer inquiries recorded in system.</CardDescription>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        {/* Filter controls */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search customer, phone, code..."
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
                                    <SelectItem value="NEW">New</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="QUOTED">Quoted</SelectItem>
                                    <SelectItem value="CONVERTED">Converted</SelectItem>
                                    <SelectItem value="CLOSED">Closed</SelectItem>
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
                                    <TableHead className="w-28">Code</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Destination & Pax</TableHead>
                                    <TableHead>Channel</TableHead>
                                    <TableHead>Est. Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Sales Rep</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            No enquiry records found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-mono text-xs font-semibold">
                                                {item.code}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-sm">{item.customerName}</div>
                                                <div className="text-xs text-muted-foreground">{item.phone}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">{item.destination}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Users className="h-3 w-3" /> {item.paxCount} Pax
                                                </div>
                                            </TableCell>
                                            <TableCell>{getChannelIcon(item.channel)}</TableCell>
                                            <TableCell className="text-xs font-medium">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    {item.travelDate}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {item.assignedTo}
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
                                                            <Eye className="h-4 w-4 text-muted-foreground" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 cursor-pointer">
                                                            <Edit className="h-4 w-4 text-muted-foreground" /> Edit Inquiry
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <Link href="/admin/operations/quotations/create">
                                                            <DropdownMenuItem className="gap-2 cursor-pointer text-primary">
                                                                <Plus className="h-4 w-4" /> Create Quotation
                                                            </DropdownMenuItem>
                                                        </Link>
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
                            Showing <strong>{filteredData.length}</strong> of <strong>{demoEnquiries.length}</strong> entries
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