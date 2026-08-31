import type { Context as HonoContext } from 'hono';

export interface UserAgentAndDeviceDto {
    userAgent: string;
    deviceFingerprint: string;
}

export interface SignInDto extends UserAgentAndDeviceDto {
    email: string;
    password: string;
}

export interface SignUpDto extends SignInDto {
    phoneNumber: string;
    whatsappNumber: string;
    fullName: string;
    gender: string;
}

export interface SendCodeSignInOTPDto {
    email: string;
    ctx: HonoContext
}

export interface SignInOTPDto extends UserAgentAndDeviceDto {
    code: string;
    ctx: HonoContext;
}

export interface SendCodeResetPasswordDto extends SendCodeSignInOTPDto {
   
}