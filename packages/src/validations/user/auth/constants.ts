import z from "zod"
import { forbiddenHtmlRegex, forbiddenLinkRegex } from "../../constants";

// variable const
export const zodValidationStr = z.string().min(2, "String should be 2 characters")
    .nonempty("String is required")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "String cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "String cannot contain links (http://, https://, www.)." }
    )

export const zodValidationEmail = z.string().email("Invalid email formatter").nonempty("Email is required");

export const zodValidationClientPassword = z.string()
    .nonempty("Password is required")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "Password cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "Password cannot contain links (http://, https://, www.)." }
    )

export const zodValidationPassword = zodValidationClientPassword
    .min(6, "password must be at least 6 characters")
    .max(128, "password too long")
    .regex(/^(?=.*[a-z])/, "must contain lowercase letter")
    .regex(/^(?=.*[A-Z])/, "must contain uppercase letter")
    .regex(/^(?=.*\d)/, "must contain number")
    .regex(/^(?=.*[@$!%*?&])/, "must contain special character")

export const zodValidationConfirmPassword = z.string()
    .min(6, "password must be at least 6 characters")
    .max(128, "password too long")
    .regex(/^(?=.*[a-z])/, "must contain lowercase letter")
    .regex(/^(?=.*[A-Z])/, "must contain uppercase letter")
    .regex(/^(?=.*\d)/, "must contain number")
    .regex(/^(?=.*[@$!%*?&])/, "must contain special character")
    .nonempty("Confirm password is required")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "Confirm password cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "Confirm password cannot contain links (http://, https://, www.)." }
    );

export const zodValidationGender = z.enum(["male", "female", "other"]).default('other')
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "Gender cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "Gender cannot contain links (http://, https://, www.)." }
    );

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

export const zodValidationOTPCode = z.string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers')
    .nonempty('OTP is required')
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "OTP code cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "OTP code cannot contain links (http://, https://, www.)." }
    )

export const zodValidationPhoneNumber = z.string()
    .min(8, "Phone number must be at least 8 digits")
    .max(14, "Phone number must be at most 14 digits")
    .regex(/^\+?\d+$/, "Phone number must contain only numbers and optional leading +")
    .nonempty("Phone number is required")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "Phone number cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "Phone number cannot contain links (http://, https://, www.)." }
    )

export const zodValidationSearchQuery = z.string()
    .default("")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "Search query cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "Search query cannot contain links (http://, https://, www.)." }
    );


export const zodValidationFullName = z.string()
    .nonempty("FullName is required")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "FullName cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "FullName cannot contain links (http://, https://, www.)." }
    )

export const zodValidationFirstName = z.string()
    .nonempty("FirstName is required")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "FirstName cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "FirstName cannot contain links (http://, https://, www.)." }
    )

export const zodValidationLastName = z.string()
    .nonempty("LastName is required")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "LastName cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "LastName cannot contain links (http://, https://, www.)." }
    )

export const zodValidationVillage = z.string()
    .nonempty("Village is required")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "Village cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "Village cannot contain links (http://, https://, www.)." }
    );

export const zodValidationDistrict = z.string()
    .nonempty("District is required")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "District cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "District cannot contain links (http://, https://, www.)." }
    );

export const zodValidationProvince = z.string()
    .nonempty("Province is required")
    .refine(
        (val) => !forbiddenHtmlRegex.test(val),
        { message: "Province cannot contain HTML tags or script characters (<, >)." }
    )
    .refine(
        (val) => !forbiddenLinkRegex.test(val),
        { message: "Province cannot contain links (http://, https://, www.)." }
    );