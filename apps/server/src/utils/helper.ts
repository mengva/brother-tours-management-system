import * as bcrypt from "bcryptjs"
import { env } from "../config/env";
import * as jwt from "jsonwebtoken";
import * as nodemailer from "nodemailer";
import type { UserRoleDto } from "@/server/packages/types";

interface PayloadDto {
    userId: string;
    role: UserRoleDto;
    userAgent: string;
}

export interface MailOptionsDto {
    from: string;
    to: string;
    subject: string;
    html: string;
}

export class Helper {

    public static async generateToken(payload: PayloadDto): Promise<string> {
        const secret = env("USER_SECRET");
        const expiresIn = env("ACCESS_TOKEN_EXPIRES_IN"); // Example: "1d" or "24h"

        if (!secret || !expiresIn) {
            throw new Error("Secret key or expiration time is not defined in environment variables");
        }

        const signOptions: jwt.SignOptions = {
            algorithm: env("ALGORITHM") as jwt.Algorithm,
            // If your env is a string like "1d", remove parseInt. 
            // If it's a number of seconds, keep parseInt.
            expiresIn: expiresIn as any, // jwt library can handle string formats like "1d", "24h" directly
        };

        return jwt.sign(payload, secret, signOptions);
    }

    public static async verifyTokenSecret(token: string): Promise<PayloadDto> {
        if (!token) {
            throw new Error("Token is not provided");
        }

        const secret = env("USER_SECRET");
        if (!secret) {
            throw new Error("Secret key is not defined");
        }

        try {
            // We use a manual Promise to handle potential errors cleanly
            const decoded = jwt.verify(token, secret) as PayloadDto;
            return decoded;
        } catch (error) {
            // Handle expired or malformed token
            throw new Error("Invalid or expired token");
        }
    }

    public static async bcryptHash(code: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(code, salt);
        return hashed;
    }

    public static async bcryptCompare(code: string, hashedCode: string) {
        return await bcrypt.compare(code, hashedCode);
    }

    public static generateOTP() {
        // Generate a random 6 digit OTP
        return (Math.floor(100000 + Math.random() * 900000)).toString() as string;
    }

    public static generateOTPSignIn() {
        // Generate a random 8 digit OTP for sign in
        return (Math.floor(10000000 + Math.random() * 90000000)).toString() as string;
    }

    public static codeExpiredIn(second: number) {
        // Set the OTP code to expire in m minutes
        return new Date(Date.now() + second * 1000) as Date;
    }

    public static currentDate() {
        // Get the current date and time
        return new Date(Date.now()) as Date;
    }

    public static setCurrentDate(day: number) {
        return new Date(Date.now() + day);
    }

    public static transporter() {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: env('EMAIL_ADDRESS'),
                pass: env('EMAIL_PASSWORD'),
            },
        });
        return transporter;
    }

    public static mailOptions({ from, to, subject, html }: MailOptionsDto): MailOptionsDto {
        return {
            from,
            to,
            subject,
            html
        }
    }
}