import z from "zod";

// file zod
export const zodValidationFile = z.object({
    fileData: z.string(), // base64 string
    fileName: z.string(),
    fileType: z.string(),
    size: z.number() // in bytes
});
export const zodValidationFiles = z.array(zodValidationFile).nonempty("Document file not empty");

// filter query
export const zodValidationFilter = z.object({
    page: z.number().default(1),
    limit: z.number().max(100).default(20)
});

export const zodValidationOrderBy = z.enum(['desc', 'asc']).default("desc");