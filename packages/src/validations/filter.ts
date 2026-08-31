import z from "zod";
import { ALLOWED_FILE_TYPES, isValidMagicBytes, MAX_FILE_SIZE } from "./constants";


// Base64 Data URI Regex (ກວດ Format: data:image/png;base64,iVBORw0KGgo...)
const base64DataUriRegex = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9\-.+]+);base64,([A-Za-z0-9+/=]+)$/;

// ==========================================
// 1. REUSABLE FILE SCHEMA
// ==========================================
export const zodValidationFile = z.object({
    // 1. Check Base64 Format
    fileData: z.string()
        .min(1, "File data is required")
        .regex(base64DataUriRegex, "Invalid Base64 Data URI format")
        .refine((val) => isValidMagicBytes(val), {
            message: "Security Alert: File header does not match valid file signature (Fake file extension detected)!",
        }),

    // 2. Check File Name (ປ້ອງກັນ Path Traversal & Special Chars)
    fileName: z.string()
        .min(1, "File name is required")
        .max(255, "File name too long")
        .refine((name) => !/[<>\r\n]/.test(name), {
            message: "File name contains invalid characters",
        }),

    // 3. Check Restricted MIME Types
    fileType: z.enum(ALLOWED_FILE_TYPES, {
        errorMap: () => ({
            message: `Invalid file type. Allowed: ${ALLOWED_FILE_TYPES.join(", ")}`,
        }),
    }),

    // 4. Check File Size Bounds (0 < Size <= 5MB)
    size: z.number()
        .gt(0, "File size must be greater than 0 bytes")
        .max(MAX_FILE_SIZE, `File size cannot exceed ${MAX_FILE_SIZE}MB`),
});

export const zodValidationFiles = z.array(zodValidationFile).nonempty("Document file not empty");

// filter query
export const zodValidationFilter = z.object({
    page: z.number().default(1),
    limit: z.number().max(100).default(20)
});

export const zodValidationOrderBy = z.enum(['desc', 'asc']).default("desc");