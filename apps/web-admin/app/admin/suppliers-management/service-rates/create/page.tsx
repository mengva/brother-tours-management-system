"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Save,
    Building2,
    Calendar as CalendarIcon,
    DollarSign,
    Percent,
    Hotel,
    Bus,
    UserCheck,
    Ticket,
    Utensils,
    Plus,
    Trash2,
    AlertCircle,
    HelpCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Badge } from "@workspace/ui/components/badge";
import { Switch } from "@workspace/ui/components/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@workspace/ui/components/tooltip";

type ServiceCategory = "ROOM_NIGHT" | "VEHICLE_DAILY" | "GUIDE_DAILY" | "MEAL_PER_PAX" | "ENTRANCE_FEE";
type Currency = "USD" | "LAK" | "THB";
type SeasonType = "HIGH_SEASON" | "LOW_SEASON" | "PEAK_SEASON";

interface TieredPricing {
    id: string;
    minPax: number;
    maxPax: number;
    netRate: number;
    sellingRate: number;
}

export default function CreateServiceRatePage() {
    const router = useRouter();

    // Basic Details
    const [supplierId, setSupplierId] = useState("");
    const [category, setCategory] = useState<ServiceCategory>("ROOM_NIGHT");
    const [serviceName, setServiceName] = useState("");
    const [rateCode, setRateCode] = useState(`RAT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);

    // Pricing & Currency
    const [currency, setCurrency] = useState<Currency>("USD");
    const [unitType, setUnitType] = useState("Per Room / Night");
    const [netRate, setNetRate] = useState<number | "">("");
    const [sellingRate, setSellingRate] = useState<number | "">("");
    const [enableTieredPricing, setEnableTieredPricing] = useState(false);

    // Dynamic Tiered Pricing
    const [pricingTiers, setPricingTiers] = useState<TieredPricing[]>([
        { id: "1", minPax: 1, maxPax: 4, netRate: 0, sellingRate: 0 },
        { id: "2", minPax: 5, maxPax: 9, netRate: 0, sellingRate: 0 },
    ]);

    // Season & Validity
    const [season, setSeason] = useState<SeasonType>("HIGH_SEASON");
    const [validFrom, setValidFrom] = useState("");
    const [validTo, setValidTo] = useState("");
    const [isContracted, setIsContracted] = useState(true);
    const [cancellationPolicy, setCancellationPolicy] = useState("");

    // Auto-calculated Profit Margin
    const calculateMargin = () => {
        const net = typeof netRate === "number" ? netRate : 0;
        const sell = typeof sellingRate === "number" ? sellingRate : 0;
        if (net <= 0 || sell <= 0) return { profit: 0, percentage: 0 };
        const profit = sell - net;
        const percentage = (profit / net) * 100;
        return { profit, percentage };
    };

    const marginInfo = calculateMargin();

    const handleAddTier = () => {
        const lastTier = pricingTiers[pricingTiers.length - 1];
        const newMin = lastTier ? lastTier.maxPax + 1 : 1;
        setPricingTiers([
            ...pricingTiers,
            { id: Date.now().toString(), minPax: newMin, maxPax: newMin + 4, netRate: 0, sellingRate: 0 },
        ]);
    };

    const handleRemoveTier = (id: string) => {
        setPricingTiers(pricingTiers.filter((tier) => tier.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate save logic
        console.log({
            rateCode,
            supplierId,
            category,
            serviceName,
            currency,
            netRate,
            sellingRate,
            season,
            validFrom,
            validTo,
            isContracted,
            enableTieredPricing,
            pricingTiers,
        });
        router.push("/admin/suppliers-management/service-rates");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon">
                        <Link href="/admin/suppliers-management/service-rates">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create Service Rate Card</h1>
                        <p className="text-sm text-muted-foreground">
                            Configure contract net pricing, margins, and seasonal rules for supplier services.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Link href="/admin/suppliers-management/service-rates">Cancel</Link>
                    </Button>
                    <Button onClick={handleSubmit} className="gap-2">
                        <Save className="h-4 w-4" />
                        Save Rate Card
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Configuration Columns (2 Cols) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Supplier & Service Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-primary" />
                                Service Identification
                            </CardTitle>
                            <CardDescription>Select the supplier partner and define the service scope.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="rateCode">Rate Card Code</Label>
                                    <Input id="rateCode" value={rateCode} onChange={(e) => setRateCode(e.target.value)} className="font-mono" readOnly />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="supplier">Supplier Partner *</Label>
                                    <Select value={supplierId} onValueChange={setSupplierId}>
                                        <SelectTrigger id="supplier">
                                            <SelectValue placeholder="Select Supplier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sup-1">Avani+ Luang Prabang Resort</SelectItem>
                                            <SelectItem value="sup-2">Lao-China Transport Express</SelectItem>
                                            <SelectItem value="sup-3">Sengchanh Tour Guide Services</SelectItem>
                                            <SelectItem value="sup-4">Tamarind Lao Restaurant</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select
                                        value={category}
                                        onValueChange={(val) => {
                                            const cat = val as ServiceCategory;
                                            setCategory(cat);
                                            if (cat === "ROOM_NIGHT") setUnitType("Per Room / Night");
                                            else if (cat === "VEHICLE_DAILY") setUnitType("Per Vehicle / Day");
                                            else if (cat === "GUIDE_DAILY") setUnitType("Per Guide / Day");
                                            else setUnitType("Per Person");
                                        }}
                                    >
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ROOM_NIGHT">Accommodation (Hotels)</SelectItem>
                                            <SelectItem value="VEHICLE_DAILY">Transport & Rental</SelectItem>
                                            <SelectItem value="GUIDE_DAILY">Tour Guide Service</SelectItem>
                                            <SelectItem value="MEAL_PER_PAX">Dining & Meal Plan</SelectItem>
                                            <SelectItem value="ENTRANCE_FEE">Attraction / Activity Fee</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unitType">Pricing Unit</Label>
                                    <Input
                                        id="unitType"
                                        placeholder="e.g. Per Room / Night"
                                        value={unitType}
                                        onChange={(e) => setUnitType(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="serviceName">Service / Room Name *</Label>
                                <Input
                                    id="serviceName"
                                    placeholder="e.g. Deluxe Garden View Room (Includes Breakfast)"
                                    value={serviceName}
                                    onChange={(e) => setServiceName(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing & Rate Structure */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-emerald-600" />
                                    Cost & Selling Rates
                                </CardTitle>
                                <CardDescription>Enter contracted net costs and public selling rates.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="tiered-toggle" className="text-xs text-muted-foreground">
                                    Group Tiered Rates
                                </Label>
                                <Switch
                                    id="tiered-toggle"
                                    checked={enableTieredPricing}
                                    onCheckedChange={setEnableTieredPricing}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="w-full sm:w-1/2 space-y-2">
                                <Label htmlFor="currency">Contract Currency *</Label>
                                <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                                    <SelectTrigger id="currency">
                                        <SelectValue placeholder="Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                                        <SelectItem value="LAK">LAK (₭) - Lao Kip</SelectItem>
                                        <SelectItem value="THB">THB (฿) - Thai Baht</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {!enableTieredPricing ? (
                                /* Standard Single Rate Inputs */
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/20">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="netRate">Net Cost Rate (Supplier Price) *</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-pointer" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>The actual cost paid to the supplier.</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Input
                                            id="netRate"
                                            type="number"
                                            placeholder="0.00"
                                            value={netRate}
                                            onChange={(e) => setNetRate(e.target.value === "" ? "" : Number(e.target.value))}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="sellingRate">Selling Rate (B2C / Public) *</Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-pointer" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>The standard rate charged to end customers.</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Input
                                            id="sellingRate"
                                            type="number"
                                            placeholder="0.00"
                                            value={sellingRate}
                                            onChange={(e) => setSellingRate(e.target.value === "" ? "" : Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            ) : (
                                /* Tiered Pricing Section (Per Pax Ranges) */
                                <div className="space-y-3 pt-2">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Pax Volume Price Tiers
                                    </Label>
                                    {pricingTiers.map((tier, idx) => (
                                        <div key={tier.id} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/10">
                                            <div className="w-24 space-y-1">
                                                <Label className="text-[11px]">Min Pax</Label>
                                                <Input
                                                    type="number"
                                                    value={tier.minPax}
                                                    onChange={(e) => {
                                                        const updated = [...pricingTiers];
                                                        updated[idx].minPax = Number(e.target.value);
                                                        setPricingTiers(updated);
                                                    }}
                                                />
                                            </div>
                                            <div className="w-24 space-y-1">
                                                <Label className="text-[11px]">Max Pax</Label>
                                                <Input
                                                    type="number"
                                                    value={tier.maxPax}
                                                    onChange={(e) => {
                                                        const updated = [...pricingTiers];
                                                        updated[idx].maxPax = Number(e.target.value);
                                                        setPricingTiers(updated);
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <Label className="text-[11px]">Net ({currency})</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={tier.netRate || ""}
                                                    onChange={(e) => {
                                                        const updated = [...pricingTiers];
                                                        updated[idx].netRate = Number(e.target.value);
                                                        setPricingTiers(updated);
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <Label className="text-[11px]">Selling ({currency})</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={tier.sellingRate || ""}
                                                    onChange={(e) => {
                                                        const updated = [...pricingTiers];
                                                        updated[idx].sellingRate = Number(e.target.value);
                                                        setPricingTiers(updated);
                                                    }}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="mt-5 text-destructive hover:bg-destructive/10"
                                                onClick={() => handleRemoveTier(tier.id)}
                                                disabled={pricingTiers.length === 1}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={handleAddTier} className="gap-1.5 mt-2">
                                        <Plus className="h-3.5 w-3.5" /> Add Pax Tier Range
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Cancellation Policy / Terms */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Contract Terms & Cancellation Policy</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                rows={4}
                                placeholder="e.g. Free cancellation up to 7 days prior to arrival. 50% charge within 3 days. No-show full charge."
                                value={cancellationPolicy}
                                onChange={(e) => setCancellationPolicy(e.target.value)}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Controls (1 Col) */}
                <div className="space-y-6">
                    {/* Profit Calculation Summary Widget */}
                    {!enableTieredPricing && (
                        <Card className="border-indigo-100 dark:border-indigo-950 bg-indigo-50/40 dark:bg-indigo-950/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                    Calculated Profitability
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-sm text-muted-foreground">Estimated Profit:</span>
                                    <span className="text-lg font-bold font-mono text-emerald-600">
                                        +{marginInfo.profit.toFixed(2)} {currency}
                                    </span>
                                </div>
                                <div className="flex items-baseline justify-between">
                                    <span className="text-sm text-muted-foreground">Profit Margin:</span>
                                    <Badge className="font-mono text-xs bg-indigo-600">
                                        +{marginInfo.percentage.toFixed(1)}%
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Season & Validity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-primary" />
                                Validity & Season
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="season">Season Classification</Label>
                                <Select value={season} onValueChange={(val) => setSeason(val as SeasonType)}>
                                    <SelectTrigger id="season">
                                        <SelectValue placeholder="Season" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="HIGH_SEASON">High Season (Oct - Apr)</SelectItem>
                                        <SelectItem value="LOW_SEASON">Low Season (May - Sep)</SelectItem>
                                        <SelectItem value="PEAK_SEASON">Peak Season / Holidays</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="validFrom">Valid From *</Label>
                                <Input
                                    id="validFrom"
                                    type="date"
                                    value={validFrom}
                                    onChange={(e) => setValidFrom(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="validTo">Valid To *</Label>
                                <Input
                                    id="validTo"
                                    type="date"
                                    value={validTo}
                                    onChange={(e) => setValidTo(e.target.value)}
                                />
                            </div>

                            <div className="pt-2 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="contracted-toggle" className="text-sm font-medium">
                                        Signed Contract
                                    </Label>
                                    <p className="text-xs text-muted-foreground">Official agreement in place</p>
                                </div>
                                <Switch
                                    id="contracted-toggle"
                                    checked={isContracted}
                                    onCheckedChange={setIsContracted}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}