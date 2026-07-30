// 1. Define a strict Union Type of your supported document categories
export type DocumentPrefix = "BK" | "CT" | "CI" | "CO" | "IV" | "PM" | "RC";

export class DocsCodeServices {
    public static generateReferenceCode(prefix: DocumentPrefix): string {
        // 1. Get current date (Laos local timezone friendly)
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        const dateStr = `${year}${month}${day}`;

        // 2. Generate a random 4-digit number tail (1000 to 9999)
        const min = 1000;
        const max = 9999;
        const randomSequence = Math.floor(Math.random() * (max - min + 1)) + min;

        // 3. Assemble code using your dynamic input prefix
        return `${prefix}-${dateStr}-${randomSequence}`;
    }
}