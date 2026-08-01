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
    Globe,
    Image as ImageIcon,
    Compass,
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

interface AttractionSpot {
    name: string;
    category: string;
}

export default function CreateDestinationPage() {
    const router = useRouter();

    // Basic Details
    const [code, setCode] = useState("DEST-LPB");
    const [nameEn, setNameEn] = useState("");
    const [nameLa, setNameLa] = useState("");
    const [province, setProvince] = useState("Luang Prabang");
    const [region, setRegion] = useState("NORTHERN");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);

    // Key Attractions Builder
    const [spots, setSpots] = useState<AttractionSpot[]>([
        { name: "Kuang Si Waterfall", category: "Nature & Waterfalls" },
        { name: "Wat Xieng Thong", category: "Temples & History" },
        { name: "Mount Phousi", category: "Viewpoints" },
    ]);

    const [newSpotName, setNewSpotName] = useState("");
    const [newSpotCategory, setNewSpotCategory] = useState("Nature & Sightseeing");

    const handleAddSpot = () => {
        if (!newSpotName.trim()) return;
        setSpots([...spots, { name: newSpotName, category: newSpotCategory }]);
        setNewSpotName("");
    };

    const handleRemoveSpot = (index: number) => {
        setSpots(spots.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting New Destination:", {
            code,
            nameEn,
            nameLa,
            province,
            region,
            description,
            isActive,
            spots,
        });
        router.push("/admin/tours-management/destinations");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/admin/tours-management/destinations">
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Add New Destination</h1>
                        <p className="text-sm text-muted-foreground">
                            Define travel region, province, and highlight attractions.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" type="button" onClick={() => router.push("/admin/tours-management/destinations")}>
                        Cancel
                    </Button>
                    <Button type="submit" className="gap-2">
                        <Save className="h-4 w-4" />
                        Save Destination
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column: General Info & Attractions (2 Cols) */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Globe className="h-4 w-4 text-primary" /> Location Information
                            </CardTitle>
                            <CardDescription>Bilingual titles and province classification.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Destination Code</Label>
                                    <Input
                                        id="code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="e.g. DEST-LPB"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="province">Province</Label>
                                    <Input
                                        id="province"
                                        value={province}
                                        onChange={(e) => setProvince(e.target.value)}
                                        placeholder="e.g. Luang Prabang"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nameEn">Name (English)</Label>
                                    <Input
                                        id="nameEn"
                                        value={nameEn}
                                        onChange={(e) => setNameEn(e.target.value)}
                                        placeholder="e.g. Luang Prabang"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nameLa">Name (Lao)</Label>
                                    <Input
                                        id="nameLa"
                                        value={nameLa}
                                        onChange={(e) => setNameLa(e.target.value)}
                                        placeholder="e.g. ຫຼວງພະບາງ"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Overview Description</Label>
                                <Textarea
                                    id="description"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Short historical or cultural summary of this destination..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Key Attraction Spots List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" /> Highlight Attractions & Landmarks
                            </CardTitle>
                            <CardDescription>Famous spots that belong to this destination.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="e.g. Kuang Si Waterfall"
                                    value={newSpotName}
                                    onChange={(e) => setNewSpotName(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="button" variant="secondary" onClick={handleAddSpot} className="gap-1.5 shrink-0">
                                    <Plus className="h-4 w-4" /> Add Spot
                                </Button>
                            </div>

                            <div className="space-y-2 pt-2">
                                {spots.length === 0 ? (
                                    <p className="text-xs text-muted-foreground text-center py-4">No highlight attractions added yet.</p>
                                ) : (
                                    spots.map((spot, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-md border text-xs">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-3.5 w-3.5 text-primary" />
                                                <span className="font-semibold">{spot.name}</span>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                                onClick={() => handleRemoveSpot(idx)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Region & Status (1 Col) */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Compass className="h-4 w-4 text-primary" /> Region Classification
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="region">Region Zone</Label>
                                <Select value={region} onValueChange={setRegion}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NORTHERN">Northern Laos</SelectItem>
                                        <SelectItem value="CENTRAL">Central Laos</SelectItem>
                                        <SelectItem value="SOUTHERN">Southern Laos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between border-t pt-4">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-medium">Active Status</Label>
                                    <p className="text-xs text-muted-foreground">Visible for Tour Package creation.</p>
                                </div>
                                <Switch checked={isActive} onCheckedChange={setIsActive} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}