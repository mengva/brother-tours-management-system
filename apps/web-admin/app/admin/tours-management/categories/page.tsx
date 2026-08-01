"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Plus,
    Search,
    MoreHorizontal,
    Pencil,
    Trash2,
    FolderTree,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Loader2,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Badge } from "@workspace/ui/components/badge";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
    Card,
    CardContent,
    CardHeader,
} from "@workspace/ui/components/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
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
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@workspace/ui/components/form";

import * as z from "zod";

export const categorySchema = z.object({
    name: z
        .string()
        .min(2, { message: "Category name must be at least 2 characters." })
        .max(50, { message: "Category name must not exceed 50 characters." }),
    slug: z
        .string()
        .min(2, { message: "Slug must be at least 2 characters." })
        .max(60, { message: "Slug must not exceed 60 characters." })
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            message: "Slug must be lowercase and contain only letters, numbers, and hyphens (e.g. eco-tours).",
        }),
    description: z
        .string()
        .max(200, { message: "Description must not exceed 200 characters." })
        .optional(),
    isActive: z.boolean().default(true),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: {
        tours: number;
    };
}

// ---------------- Mock 55 Categories Data ----------------
const INITIAL_CATEGORIES: Category[] = Array.from({ length: 55 }).map((_, index) => {
    const id = (index + 1).toString();
    const names = [
        "Cultural & Heritage",
        "Adventure & Trekking",
        "Eco & Wildlife",
        "Beach & Relaxation",
        "Food & Culinary",
        "River Cruise",
        "Photography Tour",
        "Family Vacation",
        "Luxury Explorer",
        "City Day Tours",
    ];
    const name = `${names[index % names.length]} ${Math.floor(index / names.length) + 1}`;
    return {
        id: `cat-${id}`,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
        description: `Discover best handpicked packages for ${name.toLowerCase()}.`,
        isActive: index % 5 !== 0,
        createdAt: new Date(Date.now() - index * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - index * 43200000).toISOString(),
        _count: {
            tours: (index * 4) % 30,
        },
    };
});

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modals state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

    // --- React Hook Form Setup ---
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            isActive: true,
        },
    });

    // Auto Generate Slug Function
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");
    };

    // --- Search & Filter Logic ---
    const filteredCategories = categories.filter((category) => {
        const matchesSearch =
            category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.slug.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === "ALL"
                ? true
                : statusFilter === "ACTIVE"
                    ? category.isActive
                    : !category.isActive;

        return matchesSearch && matchesStatus;
    });

    // --- Pagination Logic ---
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const paginatedCategories = filteredCategories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // --- Modal Handlers ---
    const handleOpenCreateModal = () => {
        setEditingCategory(null);
        form.reset({
            name: "",
            slug: "",
            description: "",
            isActive: true,
        });
        setIsFormOpen(true);
    };

    const handleOpenEditModal = (category: Category) => {
        setEditingCategory(category);
        form.reset({
            name: category.name,
            slug: category.slug,
            description: category.description || "",
            isActive: category.isActive,
        });
        setIsFormOpen(true);
    };

    // Form Submit Handler
    const onSubmit = (data: CategoryFormValues) => {
        if (editingCategory) {
            // Update
            setCategories(
                categories.map((cat) =>
                    cat.id === editingCategory.id
                        ? {
                            ...cat,
                            name: data.name,
                            slug: data.slug,
                            description: data.description || null,
                            isActive: data.isActive,
                            updatedAt: new Date().toISOString(),
                        }
                        : cat
                )
            );
        } else {
            // Create
            const newCategory: Category = {
                id: `cat-${Date.now()}`,
                name: data.name,
                slug: data.slug,
                description: data.description || null,
                isActive: data.isActive,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                _count: { tours: 0 },
            };
            setCategories([newCategory, ...categories]);
        }

        setIsFormOpen(false);
    };

    const handleDeleteConfirm = () => {
        if (!deletingCategory) return;
        setCategories(categories.filter((cat) => cat.id !== deletingCategory.id));
        setDeletingCategory(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <FolderTree className="h-6 w-6 text-primary" />
                        Tour Categories
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Organize and manage category taxonomy for tour packages.
                    </p>
                </div>
                <Button onClick={handleOpenCreateModal} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Category
                </Button>
            </div>

            {/* Main Content Card */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search Input */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search category or slug..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                            <Select
                                value={statusFilter}
                                onValueChange={(val) => {
                                    setStatusFilter(val);
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Status</SelectItem>
                                    <SelectItem value="ACTIVE">Active Only</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive Only</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="text-sm text-muted-foreground whitespace-nowrap">
                                Total: <span className="font-semibold text-foreground">{filteredCategories.length}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* Table */}
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[220px]">Name</TableHead>
                                    <TableHead className="w-[180px]">Slug</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-center w-[120px]">Tours</TableHead>
                                    <TableHead className="text-center w-[120px]">Status</TableHead>
                                    <TableHead className="text-right w-[80px]">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedCategories.length > 0 ? (
                                    paginatedCategories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">{category.name}</TableCell>
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {category.slug}
                                            </TableCell>
                                            <TableCell className="max-w-[250px] truncate text-muted-foreground">
                                                {category.description || "-"}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary" className="font-semibold">
                                                    {category._count?.tours ?? 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {category.isActive ? (
                                                    <Badge variant="outline" className="gap-1 border-emerald-500/30 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20">
                                                        <CheckCircle2 className="h-3 w-3" /> Active
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="gap-1 text-muted-foreground">
                                                        <XCircle className="h-3 w-3" /> Inactive
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Actions</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleOpenEditModal(category)}>
                                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => setDeletingCategory(category)}
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            No categories found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4">
                            <p className="text-xs text-muted-foreground">
                                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                                {Math.min(currentPage * itemsPerPage, filteredCategories.length)} of{" "}
                                {filteredCategories.length} categories
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => p - 1)}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-xs font-medium px-1">
                                    {currentPage} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => p + 1)}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal Dialog: Create / Edit Category with react-hook-form */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory ? "Edit Category" : "Create New Category"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCategory
                                ? "Update details for this tour category."
                                : "Fill out the fields below to create a new category."}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                            {/* Category Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category Name *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Cultural & Heritage"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    // Auto generate slug if creating or slug hasn't been heavily customized
                                                    if (!editingCategory) {
                                                        form.setValue("slug", generateSlug(e.target.value), {
                                                            shouldValidate: true,
                                                        });
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Category Slug */}
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL Slug *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="cultural-heritage"
                                                className="font-mono text-xs"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-[11px]">
                                            Unique Identifier used in the tour URL address.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Brief summary about this category..."
                                                className="resize-none"
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Is Active Status */}
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="cursor-pointer">
                                                Active Category
                                            </FormLabel>
                                            <FormDescription className="text-xs">
                                                Visible and selectable on the public booking platform.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsFormOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {editingCategory ? "Save Changes" : "Create Category"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Modal Dialog: Delete Confirmation */}
            <Dialog open={Boolean(deletingCategory)} onOpenChange={() => setDeletingCategory(null)}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Delete Category?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-foreground">"{deletingCategory?.name}"</span>?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0 pt-2">
                        <Button variant="outline" onClick={() => setDeletingCategory(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}