import { FileDto } from "../types";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "../validations";

export class SecureFileUploadServices {

    public static readonly IMAGE_FILE_TYPE = ALLOWED_FILE_TYPES;

    public static ALLOWED_FILE_SIGNATURES: Record<string, string> = {
        "25504446": "application/pdf", // PDF
        "ffd8ff": "image/jpeg",        // JPEG / JPG
        "89504e47": "image/png",       // PNG
        "47494638": "image/gif",       // GIF
        "52494646": "image/webp",      // WEBP (RIFF)
    };

    public static validationFile(file: FileDto): { valid: boolean; error?: string } {
        if (file.size > MAX_FILE_SIZE) {
            return { valid: false, error: 'File size exceeds 10MB limit' };
        }
        // ตรวจสอบ file signature
        const base64Data = file.fileData.split(',')[1] || '';
        const buffer = Buffer.from(base64Data, 'base64');
        const signature = buffer.toString('hex', 0, 8).toLowerCase();
        let isValidImage = false;
        for (const [sig, type] of Object.entries(this.ALLOWED_FILE_SIGNATURES)) {
            if (signature.startsWith(sig)) {
                isValidImage = true;
                break;
            }
        }
        if (!isValidImage) {
            return { valid: false, error: 'Invalid file type' };
        }
        return { valid: true };
    }

    public static async validationFiles(files: FileDto[]): Promise<string | undefined> {
        const valids = await Promise.all(
            files.map(file => this.validationFile(file))
        )
        const errorMessage = valids.find(v => v.valid === false)?.error;
        return errorMessage;
    }

}