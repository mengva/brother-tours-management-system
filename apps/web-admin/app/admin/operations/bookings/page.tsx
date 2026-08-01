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
  Calendar,
  Users,
  CreditCard,
  Printer,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  MapPin,
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
type BookingStatus = "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
type PaymentStatus = "PAID" | "PARTIAL" | "UNPAID" | "REFUNDED";

interface Booking {
  id: string;
  code: string;
  quotationCode: string;
  customerName: string;
  phone: string;
  tourName: string;
  paxCount: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  paidAmount: number;
  currency: "LAK" | "USD" | "THB";
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

// 2. Demo Mock Data
const demoBookings: Booking[] = [
  {
    id: "bk-1",
    code: "BK-2026-001",
    quotationCode: "QT-2026-002",
    customerName: "Bounmi Sayasith",
    phone: "+856 20 2233 4455",
    tourName: "Vientiane City Tour + Golf",
    paxCount: 8,
    startDate: "2026-08-10",
    endDate: "2026-08-12",
    totalAmount: 3200,
    paidAmount: 3200,
    currency: "USD",
    bookingStatus: "CONFIRMED",
    paymentStatus: "PAID",
    createdAt: "2026-07-29 16:00",
  },
  {
    id: "bk-2",
    code: "BK-2026-002",
    quotationCode: "QT-2026-001",
    customerName: "Sengdavone Phommasone",
    phone: "+856 20 5551 2345",
    tourName: "Luang Prabang & Vang Vieng Highlights",
    paxCount: 4,
    startDate: "2026-08-15",
    endDate: "2026-08-19",
    totalAmount: 18500000,
    paidAmount: 5000000,
    currency: "LAK",
    bookingStatus: "CONFIRMED",
    paymentStatus: "PARTIAL",
    createdAt: "2026-07-30 09:10",
  },
  {
    id: "bk-3",
    code: "BK-2026-003",
    quotationCode: "QT-2026-004",
    customerName: "John Anderson",
    phone: "+856 20 9988 7766",
    tourName: "4,000 Islands & Champasak Explorer",
    paxCount: 2,
    startDate: "2026-09-01",
    endDate: "2026-09-06",
    totalAmount: 52000,
    paidAmount: 0,
    currency: "THB",
    bookingStatus: "IN_PROGRESS",
    paymentStatus: "UNPAID",
    createdAt: "2026-07-28 14:30",
  },
  {
    id: "bk-4",
    code: "BK-2026-004",
    quotationCode: "QT-2026-006",
    customerName: "Alex Vance",
    phone: "+856 20 8822 1100",
    tourName: "Kuang Si Falls & Elephant Sanctuary Day Trip",
    paxCount: 3,
    startDate: "2026-07-25",
    endDate: "2026-07-25",
    totalAmount: 450,
    paidAmount: 450,
    currency: "USD",
    bookingStatus: "COMPLETED",
    paymentStatus: "PAID",
    createdAt: "2026-07-20 11:00",
  },
  {
    id: "bk-5",
    code: "BK-2026-005",
    quotationCode: "QT-2026-008",
    customerName: "Souphaphone Kham",
    phone: "+856 20 5411 9988",
    tourName: "Thakhek Loop Expedition",
    paxCount: 6,
    startDate: "2026-08-01",
    endDate: "2026-08-04",
    totalAmount: 14000000,
    paidAmount: 14000000,
    currency: "LAK",
    bookingStatus: "CANCELLED",
    paymentStatus: "REFUNDED",
    createdAt: "2026-07-15 10:20",
  },
];

export default function BookingsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");

  // Filter Logic
  const filteredData = demoBookings.filter((item) => {
    const matchesSearch =
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.quotationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm);

    const matchesStatus = statusFilter === "ALL" || item.bookingStatus === statusFilter;
    const matchesPayment = paymentFilter === "ALL" || item.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Helpers
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US").format(amount) + " " + currency;
  };

  const getBookingStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Confirmed</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">In Progress</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary" className="bg-slate-100 text-slate-700">Completed</Badge>;
      case "CANCELLED":
        return <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20">Cancelled</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-emerald-600 text-white font-normal text-[10px]">Paid</Badge>;
      case "PARTIAL":
        return <Badge className="bg-amber-500 text-white font-normal text-[10px]">Partial</Badge>;
      case "UNPAID":
        return <Badge className="bg-rose-500 text-white font-normal text-[10px]">Unpaid</Badge>;
      case "REFUNDED":
        return <Badge variant="outline" className="text-zinc-500 border-zinc-300 text-[10px]">Refunded</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings Management</h1>
          <p className="text-sm text-muted-foreground">
            Track active tours, payment collections, and customer itineraries.
          </p>
        </div>
        <Link href="/admin/operations/bookings/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Booking
          </Button>
        </Link>
      </div>

      {/* Quick Summary Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Active Bookings</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-2xl font-bold">42</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Upcoming Tours (7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-2xl font-bold text-blue-600">11</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-2xl font-bold text-amber-600">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Completed (This Month)</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-2xl font-bold text-emerald-600">65</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="pb-3 space-y-4">
          <div>
            <CardTitle>Booking Records</CardTitle>
            <CardDescription>Comprehensive list of all confirmed and ongoing tours.</CardDescription>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
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
                  <SelectValue placeholder="Booking Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-32 text-sm">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Payments</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PARTIAL">Partial</SelectItem>
                  <SelectItem value="UNPAID">Unpaid</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
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
                  <TableHead className="w-28">Booking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Tour / Package</TableHead>
                  <TableHead>Travel Dates</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-center">Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No booking records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs font-semibold">
                        <div>{item.code}</div>
                        <div className="text-[10px] text-muted-foreground font-normal">
                          Ref: {item.quotationCode}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{item.customerName}</div>
                        <div className="text-xs text-muted-foreground">{item.phone}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="truncate max-w-[200px]">{item.tourName}</span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Users className="h-3 w-3" /> {item.paxCount} Pax
                        </div>
                      </TableCell>
                      <TableCell className="text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {item.startDate}
                        </div>
                        <div className="text-[11px] text-muted-foreground pl-4">
                          to {item.endDate}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm whitespace-nowrap">
                        <div className="font-semibold">{formatAmount(item.totalAmount, item.currency)}</div>
                        {item.paymentStatus === "PARTIAL" && (
                          <div className="text-[10px] text-amber-600 font-normal">
                            Paid: {formatAmount(item.paidAmount, item.currency)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {getPaymentStatusBadge(item.paymentStatus)}
                      </TableCell>
                      <TableCell>{getBookingStatusBadge(item.bookingStatus)}</TableCell>
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
                              <Printer className="h-4 w-4 text-muted-foreground" /> Print Voucher
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Receipt className="h-4 w-4 text-muted-foreground" /> Issue Invoice
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 cursor-pointer text-emerald-600">
                              <CreditCard className="h-4 w-4" /> Record Payment
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Edit className="h-4 w-4 text-muted-foreground" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
                              <Trash2 className="h-4 w-4" /> Cancel Booking
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
              Showing <strong>{filteredData.length}</strong> of <strong>{demoBookings.length}</strong> entries
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