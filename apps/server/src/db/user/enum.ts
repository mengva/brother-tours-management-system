import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum('role', [
    'Admin',
    'Sales',
    'Viewer',
    'Customer',
    'Supplier'
]);

export const userPermissionEnum = pgEnum("user_permission", [
    "Create",
    "Read",
    "Update",
    "Delete",
    "Rollback",
]);