import z from "zod"
import { forbiddenHtmlRegex, forbiddenLinkRegex, zodSanitizeInput } from "../../constants";

// variable const
export const zodValidationStr = zodSanitizeInput("String")(
    z.string().min(2, "Input should be 2 characters")
        .nonempty("Input is required")
)

export const zodValidationEmail = zodSanitizeInput("Email")(
    z.string()
        .email("Invalid email formatter")
        .nonempty("Email is required")
)

export const zodValidationClientPassword = z.string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password too long")


export const zodValidationPassword = z.string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password too long")
    .regex(/^(?=.*[a-z])/, "must contain lowercase letter")
    .regex(/^(?=.*[A-Z])/, "must contain uppercase letter")
    .regex(/^(?=.*\d)/, "must contain number")
    .regex(/^(?=.*[@$!%*?&])/, "must contain special character")

export const zodValidationConfirmPassword = z.string()
    .nonempty("Confirm password is required")
    .min(6, "Confirm password must be at least 6 characters")
    .max(128, "Confirm password too long")
    .regex(/^(?=.*[a-z])/, "must contain lowercase letter")
    .regex(/^(?=.*[A-Z])/, "must contain uppercase letter")
    .regex(/^(?=.*\d)/, "must contain number")
    .regex(/^(?=.*[@$!%*?&])/, "must contain special character")

export const zodValidationGender = z.enum(["male", "female", "other"]).default('other');

export const zodRegistrationPassword = z.object({
    password: zodValidationPassword,
    confirmPassword: zodValidationConfirmPassword, // Reuse the same rules!
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Confirm password must match password",
        path: ["confirmPassword"], // This sets the error on the confirmPassword field specifically
    });

export const zodValidationBirthday = z.string()
    .min(1, "Date of birth is required.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format.")
    .refine((val) => {
        const date = new Date(val);
        const now = new Date();
        return date <= now;
    }, "Birthday cannot be a future date.")
    .refine((val) => {
        const date = new Date(val);
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 120);
        return date >= minDate;
    }, "Age should not exceed 120 years.");

export const zodValidationOTPCode = zodSanitizeInput("OTP")(
    z.string()
        .length(6, 'OTP must be exactly 6 digits')
        .regex(/^\d+$/, 'OTP must contain only numbers')
        .nonempty('OTP is required')
)

// Helper: normalize to E.164 (+85620xxxxxxxx)
const normalizeLaoMobile = (val: string): string => {
    // Remove spaces, dashes, parentheses
    let cleaned = val.replace(/[\s\-\(\)]/g, "");

    // Already correct international format
    if (/^\+85620\d{8}$/.test(cleaned)) {
        return cleaned;
    }

    // Starts with 85620... (missing +)
    if (/^85620\d{8}$/.test(cleaned)) {
        return `+${cleaned}`;
    }

    // Starts with 020... (domestic)
    if (/^020\d{8}$/.test(cleaned)) {
        return `+856${cleaned.slice(1)}`; // 020... → +85620...
    }

    // Starts with 20... (without 0)
    if (/^20\d{8}$/.test(cleaned)) {
        return `+856${cleaned}`;
    }

    // Just the 8 digits after 20
    if (/^\d{8}$/.test(cleaned)) {
        return `+85620${cleaned}`;
    }

    return cleaned; // fallback (will fail later validation)
};

// ---------- Phone Number ----------
export const zodValidationPhoneNumber = z
    .string()
    .nonempty("Phone number is required")
    .transform(normalizeLaoMobile) // auto-convert to +85620xxxxxxxx
    .refine(
        (val) => /^\+85620\d{8}$/.test(val),
        {
            message: "Phone number must be a valid Lao mobile number (e.g. +8562012345678 or 02012345678)",
        }
    )
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "Phone number cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "Phone number cannot contain links (http://, https://, www.)." }
    );

// ---------- WhatsApp Number ----------
export const zodValidationWhatsAppPhoneNumber = z
    .string()
    .nonempty("WhatsApp phone number is required")
    .transform(normalizeLaoMobile)
    .refine(
        (val) => /^\+85620\d{8}$/.test(val),
        {
            message: "WhatsApp number must be a valid Lao mobile number (e.g. +8562012345678 or 02012345678)",
        }
    )
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        {
            message: "WhatsApp phone number cannot contain HTML tags or script characters (<, >).",
        }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        {
            message: "WhatsApp phone number cannot contain links (http://, https://, www.).",
        }
    );

export const zodValidationSearchQuery = zodSanitizeInput("Search Query")(
    z.string()
)

export const zodValidationFullName = zodSanitizeInput("FullName")(
    z.string()
        .nonempty("FullName is required")
)

export const zodValidationFirstName = zodSanitizeInput("FirstName")(
    z.string()
        .nonempty("FirstName is required")
)

export const zodValidationLastName = zodSanitizeInput("LastName")(
    z.string()
        .nonempty("LastName is required")
)

export const zodValidationVillage = zodSanitizeInput("Village")(
    z.string()
        .nonempty("Village is required")
)

export const zodValidationDistrict = zodSanitizeInput("District")(
    z.string()
        .nonempty("District is required")
)

export const zodValidationProvince = zodSanitizeInput("Province")(
    z.string()
        .nonempty("Province is required")
)