"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Save,
    MapPin,
    Clock,
    Compass,
    DollarSign,
    Image as ImageIcon,
    Calendar,
    Layers,
    Sparkles,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Badge } from "@workspace/ui/components/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import { Switch } from "@workspace/ui/components/switch";

interface ItineraryDay {
    dayNumber: number;
    title: string;
    description: string;
    activities: string;
    meals: {
        breakfast: boolean;
        lunch: boolean;
        dinner: boolean;
    };
}

export default function CreateTourPage() {
    const router = useRouter();

    // Basic Details State
    const [code, setCode] = useState("BT-LP-007");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Cultural & Heritage");
    const [location, setLocation] = useState("Luang Prabang");
    const [difficulty, setDifficulty] = useState("EASY");
    const [durationDays, setDurationDays] = useState<number>(3);
    const [durationNights, setDurationNights] = useState<number>(2);
    const [isFeatured, setIsFeatured] = useState(false);
    const [status, setStatus] = useState("DRAFT");

    // Pricing State
    const [startingPrice, setStartingPrice] = useState<number>(250);
    const [currency, setCurrency] = useState("USD");
    const [maxPax, setMaxPax] = useState<number>(12);

    // Dynamic Itinerary Days Builder State
    const [itinerary, setItinerary] = useState<ItineraryDay[]>([
        {
            dayNumber: 1,
            title: "Arrival & Luang Prabang Night Market",
            description: "Pick up from airport, check-in to hotel and relax. Evening street food walk.",
            activities: "Airport transfer, Night market exploration",
            meals: { breakfast: false, lunch: false, dinner: true },
        },
        {
            dayNumber: 2,
            title: "Tak Bat, Wat Xieng Thong & Kuang Si Waterfall",
            description: "Morning alms giving ceremony, historical temple visit, afternoon at Kuang Si.",
            activities: "Alms giving, Temple tour, Waterfall swimming & Bear Rescue center",
            meals: { breakfast: true, lunch: true, dinner: true },
        },
    ]);

    // Actions
    const handleAddDay = () => {
        const nextDay = itinerary.length + 1;
        setItinerary([
            ...itinerary,
            {
                dayNumber: nextDay,
                title: `Day ${nextDay} Activity`,
                description: "",
                activities: "",
                meals: { breakfast: true, lunch: true, dinner: false },
            },
        ]);
    };

    const handleRemoveDay = (index: number) => {
        if (itinerary.length <= 1) return;
        const updated = itinerary
            .filter((_, i) => i !== index)
            .map((day, newIndex) => ({ ...day, dayNumber: newIndex + 1 }));
        setItinerary(updated);
    };

    const handleItineraryChange = (index: number, field: keyof ItineraryDay, value: any) => {
        const updated = [...itinerary];
        updated[index] = { ...updated[index], [field]: value };
        setItinerary(updated);
    };

    const handleMealToggle = (dayIndex: number, meal: "breakfast" | "lunch" | "dinner") => {
        const updated = [...itinerary];
        updated[dayIndex].meals[meal] = !updated[dayIndex].meals[meal];
        setItinerary(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Connect to tRPC/Hono Mutation here
        console.log("Submitting New Tour Package:", {
            code,
            title,
            category,
            location,
            difficulty,
            durationDays,
            durationNights,
            isFeatured,
            status,
            startingPrice,
            currency,
            maxPax,
            itinerary,
        });
        router.push("/admin/tours-management/tours");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/admin/tours-management/tours">
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create Tour Package</h1>
                        <p className="text-sm text-muted-foreground">
                            Define itinerary, pricing tiers, and package highlights.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" type="button" onClick={() => router.push("/admin/tours-management/tours")}>
                        Cancel
                    </Button>
                    <Button type="submit" className="gap-2">
                        <Save className="h-4 w-4" />
                        Save Tour Package
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column: Essential Details & Itinerary (2 Cols) */}
                <div className="md:col-span-2 space-y-6">
                    {/* Card 1: General Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Compass className="h-4 w-4 text-primary" /> General Tour Information
                            </CardTitle>
                            <CardDescription>Basic attributes and location categorizations.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Tour Code</Label>
                                    <Input
                                        id="code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="e.g. BT-LP-001"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
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

                            <div className="space-y-2">
                                <Label htmlFor="title">Tour Title / Name</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Luang Prabang Cultural Heritage & Kuang Si Waterfall"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location">Destination / Location</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="location"
                                            className="pl-8"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="e.g. Luang Prabang"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="difficulty">Difficulty Level</Label>
                                    <Select value={difficulty} onValueChange={setDifficulty}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="EASY">Easy</SelectItem>
                                            <SelectItem value="MODERATE">Moderate</SelectItem>
                                            <SelectItem value="CHALLENGING">Challenging</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card 2: Dynamic Itinerary Days Builder */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" /> Day-by-Day Itinerary Builder
                                </CardTitle>
                                <CardDescription>Construct daily schedules and meal plans for travelers.</CardDescription>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={handleAddDay} className="gap-1.5">
                                <Plus className="h-3.5 w-3.5" /> Add Day
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {itinerary.map((day, idx) => (
                                <div key={idx} className="p-4 rounded-lg border bg-zinc-50/50 dark:bg-zinc-900/50 space-y-4 relative">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <Badge variant="secondary" className="font-mono">
                                            Day {day.dayNumber}
                                        </Badge>
                                        {itinerary.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                onClick={() => handleRemoveDay(idx)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs">Day Title</Label>
                                        <Input
                                            value={day.title}
                                            onChange={(e) => handleItineraryChange(idx, "title", e.target.value)}
                                            placeholder="Title of day activities..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs">Description / Highlights</Label>
                                        <Textarea
                                            rows={2}
                                            value={day.description}
                                            onChange={(e) => handleItineraryChange(idx, "description", e.target.value)}
                                            placeholder="Detailed schedule description for this day..."
                                        />
                                    </div>

                                    {/* Meals Included Checklist */}
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground">Meals Included</Label>
                                        <div className="flex items-center gap-4 text-xs">
                                            <label className="flex items-center gap-1.5 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={day.meals.breakfast}
                                                    onChange={() => handleMealToggle(idx, "breakfast")}
                                                    className="rounded border-zinc-300"
                                                />
                                                Breakfast (B)
                                            </label>
                                            <label className="flex items-center gap-1.5 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={day.meals.lunch}
                                                    onChange={() => handleMealToggle(idx, "lunch")}
                                                    className="rounded border-zinc-300"
                                                />
                                                Lunch (L)
                                            </label>
                                            <label className="flex items-center gap-1.5 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={day.meals.dinner}
                                                    onChange={() => handleMealToggle(idx, "dinner")}
                                                    className="rounded border-zinc-300"
                                                />
                                                Dinner (D)
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Pricing, Duration & Settings (1 Col) */}
                <div className="space-y-6">
                    {/* Duration & Capacity Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" /> Duration & Capacity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="days">Days</Label>
                                    <Input
                                        id="days"
                                        type="number"
                                        min={1}
                                        value={durationDays}
                                        onChange={(e) => setDurationDays(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nights">Nights</Label>
                                    <Input
                                        id="nights"
                                        type="number"
                                        min={0}
                                        value={durationNights}
                                        onChange={(e) => setDurationNights(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maxPax">Max Group Size (Pax)</Label>
                                <Input
                                    id="maxPax"
                                    type="number"
                                    min={1}
                                    value={maxPax}
                                    onChange={(e) => setMaxPax(Number(e.target.value))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-primary" /> Pricing Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select value={currency} onValueChange={setCurrency}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USD">USD ($)</SelectItem>
                                        <SelectItem value="LAK">LAK (₭)</SelectItem>
                                        <SelectItem value="THB">THB (฿)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Base Starting Price / Pax</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={startingPrice}
                                    onChange={(e) => setStartingPrice(Number(e.target.value))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Settings & Visibility Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Layers className="h-4 w-4 text-primary" /> Visibility & Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Publish Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DRAFT">Draft</SelectItem>
                                        <SelectItem value="PUBLISHED">Published</SelectItem>
                                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between border-t pt-3">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-medium">Featured Package</Label>
                                    <p className="text-xs text-muted-foreground">Highlight on home / promo banner.</p>
                                </div>
                                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}