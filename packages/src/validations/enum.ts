import z from "zod";

export const zodValidationUserEnum = z.enum([
    'Admin',
    'Sales',
    'Viewer',
    'Customer',
    'Supplier'
]);

export const zodValidationUserPermission = z.enum([
    "Create",
    "Read",
    "Update",
    "Delete",
    "Rollback",
]);