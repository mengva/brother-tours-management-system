import { AuthServices } from "../../utils";
import { CookieServices, handleTRPCError, HandlerSuccess, SetCtxInfoServices, tokenName, AppError } from "@/server/utils";
import type { ServerResponseDto, UserRoleDto } from "@/server/packages/types";
import { SendCodeResetPasswordDto, SendCodeSignInOTPDto, SignInDto, SignInOTPDto, SignUpDto } from "../../types";
import type { Context as HonoContext } from 'hono';
import { deleteCookie, setCookie } from "hono/cookie";
import { ZodValidationSendOTPToEmail, ZodValidationServerResetPassword, ZodValidationSignIn, ZodValidationSignInOTP, ZodValidationSignUp } from "@/server/packages/validations";
import { MyContext } from "@/server/server/trpc/context";

export class tRPCUserAuthMutationServices {

    public static async signIn({
        input,
        ctx
    }: {
        input: ZodValidationSignIn;
        ctx: MyContext;
    }): Promise<ServerResponseDto | void> {
        try {
            const {
                token,
                message
            } = await AuthServices.signIn({
                ...input,
                userAgent: ctx.c.get("userAgent") || "",
                deviceFingerprint: ctx.c.get("deviceFingerprint") || ""
            } as SignInDto);

            setCookie(ctx.c, tokenName, token, CookieServices.option);
            return HandlerSuccess.tRPCSuccess(message);
        } catch (error) {
            throw handleTRPCError(error);
        }
    }

    public static async signUp({
        input,
        ctx
    }: {
        input: ZodValidationSignUp;
        ctx: MyContext;
    }): Promise<ServerResponseDto | void> {
        try {
            const { confirmPassword, ...data } = input;
            const { message } = await AuthServices.signUp({
                ...data,
                userAgent: ctx.c.get("userAgent") || "",
                deviceFingerprint: ctx.c.get("deviceFingerprint") || ""
            } as SignUpDto);

            return HandlerSuccess.tRPCSuccess(message);
        } catch (error) {
            throw handleTRPCError(error);
        }
    }

    public static async sendCodeSignInOTP({
        input,
        ctx
    }: {
        input: ZodValidationSendOTPToEmail;
        ctx: MyContext;
    }): Promise<ServerResponseDto | void> {
        try {
            const {
                message
            } = await AuthServices.sendCodeSignInOTP({
                email: input.email,
                ctx: ctx.c
            } as SendCodeSignInOTPDto);

            return HandlerSuccess.tRPCSuccess(message);

        } catch (error) {
            throw handleTRPCError(error);
        }
    }

    public static async resendCodeSignInOTP(ctx: HonoContext): Promise<ServerResponseDto | void> {
        try {
            const { message } = await AuthServices.resendCodeSignInOTP(ctx);

            return HandlerSuccess.tRPCSuccess(message);

        } catch (error) {
            throw handleTRPCError(error);
        }
    }

    // This method is for users who want to sign in using OTP sent to their email without password
    public static async signInOTP({
        input,
        ctx
    }: {
        input: ZodValidationSignInOTP;
        ctx: MyContext;
    }): Promise<ServerResponseDto | void> {
        try {
            const { message } = await AuthServices.signInOTP({
                code: input.code,
                ctx: ctx.c,
                deviceFingerprint: ctx.c.get("deviceFingerprint") || ""
            } as SignInOTPDto);

            return HandlerSuccess.tRPCSuccess(message);
        } catch (error) {
            throw handleTRPCError(error);
        }
    }

    // This method is for users who want to sign out and clear their session
    public static async signOut(ctx: HonoContext): Promise<ServerResponseDto | void> {
        try {

            // Clear cookie from the client side as well
            deleteCookie(ctx, tokenName)

            SetCtxInfoServices.userInfo({
                userId: '' as string,
                role: "" as UserRoleDto,
            }, ctx);

            return HandlerSuccess.tRPCSuccess("Logged out successfully");

        } catch (error) {
            throw handleTRPCError(error);
        }
    }

    // This method is for users who want to sign in using OTP sent to their email without password
    public static async sendCodeResetPassword({
        input,
        ctx
    }: {
        input: ZodValidationSendOTPToEmail;
        ctx: MyContext;
    }): Promise<ServerResponseDto | void> {
        try {
            const { message } = await AuthServices.sendCodeResetPassword({
                email: input.email,
                ctx: ctx.c
            } as SendCodeResetPasswordDto);

            return HandlerSuccess.tRPCSuccess(message);
        } catch (error) {
            throw handleTRPCError(error);
        }
    }

    // This method is for users who forgot their password and want to reset it using OTP sent to their email
    public static async resendCodeResetPassword(ctx: HonoContext): Promise<ServerResponseDto | void> {
        try {
            const { message } = await AuthServices.resendCodeResetPassword(ctx);

            return HandlerSuccess.tRPCSuccess(message);
        } catch (error) {
            throw handleTRPCError(error);
        }
    }

    public static async resetPassword({
        input,
        ctx
    }: {
        input: ZodValidationServerResetPassword;
        ctx: MyContext;
    }): Promise<ServerResponseDto | void> {
        try {
            const { message } = await AuthServices.resetPassword({
                input,
                ctx: ctx.c
            });

            return HandlerSuccess.tRPCSuccess(message);
        } catch (error) {
            throw handleTRPCError(error);
        }
    }
}