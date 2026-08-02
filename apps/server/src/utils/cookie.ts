import { env } from "../config/env";

export interface CookieOptionDto {
    sameSite: 'strict' | 'lax' | 'none';
    secure: boolean;
    httpOnly: boolean;
    domain?: string;
    maxAge: number;
    path: string;
}

export class CookieServices {
    public static isProduction = env("NODE_ENV") === 'production'

    public static tokenExpriresIn = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30); // 30 days in seconds

    public static cookieOption: CookieOptionDto = {
        sameSite: this.isProduction ? 'lax' : 'lax',
        secure: this.isProduction,
        httpOnly: true,
        domain: undefined,
        maxAge: 60 * 60 * 24 * 30, // 30d 
        path: '/',
    }
}