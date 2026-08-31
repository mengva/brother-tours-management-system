import z from "zod";

// not allowed enter html tag into input
export const forbiddenHtmlRegex = /[<>]/;

// 2. Regex not allowed links (xws li http://, https://, www.)
// not allowed link http, https, or file script into input
export const forbiddenLinkRegex = /(http:\/\/|https:\/\/|www\.)\S+/i;

export const zodValidationUuid = z.string()
    .min(1, "UUID is required")
    .uuid("Invalid UUID format");

export const ZOD_VALDIATION_EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

// ==========================================
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Define the Type of File tp allowed Upload
export const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    'image/jpg',
    "application/pdf",
] as const;

// ==========================================
// FILE SIGNATURES CONFIG
// ==========================================
export const ALLOWED_FILE_SIGNATURES: Record<string, string> = {
    "25504446": "application/pdf", // PDF
    "ffd8ff": "image/jpeg",        // JPEG / JPG
    "89504e47": "image/png",       // PNG
    "47494638": "image/gif",       // GIF
    "52494646": "image/webp",      // WEBP (RIFF)
};















// Functions

export const zodSanitizeInput = (schema: z.ZodString) =>
    schema
        .refine((val) => !forbiddenHtmlRegex.test(val), {
            message: "Input cannot contain HTML tags (<, >).",
        })
        .refine((val) => !forbiddenLinkRegex.test(val), {
            message: "Input cannot contain links (http://, https://, www.).",
        });


export const isValidMagicBytes = (base64DataUri: string): boolean => {
    try {
        // ດຶງແຄ່ສ່ວນ Base64 string ຫຼັງຄຳວ່າ base64,
        const base64String = base64DataUri.split(",")[1];
        if (!base64String) return false;

        // Convert ບາງສ່ວນຂອງ Base64 ມາເປັນ Buffer/Hex (ດຶງແຄ່ 8 bytes ທຳອິດ)
        const buffer = Buffer.from(base64String.slice(0, 32), "base64");
        const hexHeader = buffer.toString("hex", 0, 4).toLowerCase();

        // ເອົາ Hex ໄປທຽບກັບ Allowed Signatures
        return Object.keys(ALLOWED_FILE_SIGNATURES).some((signature) =>
            hexHeader.startsWith(signature)
        );
    } catch {
        return false;
    }
};