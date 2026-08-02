"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Separator } from "@workspace/ui/components/separator";
import {
    LucideUser,
    LucideLock,
    LucideSliders,
    LucideBell,
    LucideSave,
    LucideShieldCheck,
} from "lucide-react";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert("Settings updated successfully!");
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
                <p className="text-muted-foreground">
                    Manage your profile, security preferences, and tour platform configurations.
                </p>
            </div>

            <Separator />

            {/* Settings Navigation Tabs */}
            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <LucideUser className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <LucideLock className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="general" className="flex items-center gap-2">
                        <LucideSliders className="h-4 w-4" />
                        System
                    </TabsTrigger>
                </TabsList>

                {/* 1. PROFILE TAB */}
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Profile</CardTitle>
                            <CardDescription>
                                Update your personal details and public information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src="/avatar-placeholder.png" alt="Admin" />
                                    <AvatarFallback className="text-lg bg-primary/10 text-primary font-bold">
                                        AD
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-2">
                                    <Button variant="outline" size="sm">
                                        Change Avatar
                                    </Button>
                                    <p className="text-xs text-muted-foreground">
                                        JPG, GIF or PNG. Max size of 2MB.
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input id="fullName" defaultValue="Brother Tours Admin" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" defaultValue="admin@brothertours.com" disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" defaultValue="+856 20 5555 9999" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role Permission</Label>
                                    <div className="flex items-center gap-2 pt-2 text-sm font-medium text-emerald-600">
                                        <LucideShieldCheck className="h-4 w-4" />
                                        Administrator (Full Access)
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4 flex justify-end">
                            <Button onClick={handleSave} disabled={loading} className="gap-2">
                                <LucideSave className="h-4 w-4" />
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* 2. SECURITY TAB */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password & Security</CardTitle>
                            <CardDescription>
                                Manage your credentials and authentication preferences.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPass">Current Password</Label>
                                <Input id="currentPass" type="password" placeholder="••••••••" />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="newPass">New Password</Label>
                                    <Input id="newPass" type="password" placeholder="••••••••" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPass">Confirm New Password</Label>
                                    <Input id="confirmPass" type="password" placeholder="••••••••" />
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Two-Factor Authentication (2FA)</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Add an extra layer of security to your admin account.
                                    </p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4 flex justify-end">
                            <Button onClick={handleSave} disabled={loading}>
                                Update Security Settings
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* 3. SYSTEM GENERAL TAB */}
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>System & Operations Config</CardTitle>
                            <CardDescription>
                                Configure global settings for Brother Tours System.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base flex items-center gap-2">
                                        <LucideBell className="h-4 w-4" />
                                        New Enquiry Email Alerts
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Send real-time email notification to Sales when a customer submits an Enquiry.
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Supplier Price Anomaly Protection</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Require confirmation & audit reasons when supplier rates change by over 30%.
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <Separator />

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Default Currency</Label>
                                    <Input id="currency" defaultValue="USD ($)" disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                                    <Input id="taxRate" type="number" defaultValue="10" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4 flex justify-end">
                            <Button onClick={handleSave} disabled={loading}>
                                Save System Config
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}