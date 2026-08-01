import type { MyContext } from "@/server/server/trpc/context";
import { tRPCAuthServices } from "../../utils";
import { HandlerSuccess, tRPCErrorServices } from "@/server/utils";
import type { ServerResponseDto, UserRoleDto } from "@/server/packages/types";
import { tokenName } from "@/server/packages/utils";

export class tRPCUserAuthMutationServices {
    public static async signIn(ctx: MyContext): Promise<ServerResponseDto | void> {
        try {
            return await tRPCAuthServices.signIn(ctx);
        } catch (error) {
            // Log the error and return standardized error message
            throw tRPCErrorServices.tRPCError(error);
        }
    }

    public static async sendCodeSignInOTP(ctx: MyContext): Promise<ServerResponseDto | void> {
        try {
            return await tRPCAuthServices.sendCodeSignInOTP(ctx);
        } catch (error) {
            throw tRPCErrorServices.tRPCError(error);
        }
    }

    public static async resendCodeSignInOTP(ctx: MyContext): Promise<ServerResponseDto | void> {
        try {
            return await tRPCAuthServices.resendCodeSignInOTP(ctx);
        } catch (error) {
            throw tRPCErrorServices.tRPCError(error);
        }
    }

    // This method is for users who want to sign in using OTP sent to their email without password
    public static async signInOTP(ctx: MyContext): Promise<ServerResponseDto | void> {
        try {
            return await tRPCAuthServices.signInOTP(ctx);
        } catch (error) {
            throw tRPCErrorServices.tRPCError(error);
        }
    }

    // This method is for users who want to sign out and clear their session
    public static async signOut(ctx: MyContext): Promise<ServerResponseDto | void> {
        try {

            ctx.deleteCookie(tokenName); // Clear cookie from the client side as well

            ctx.userInfo = {
                userId: '' as string,
                role: "" as UserRoleDto,
            }; // Clear user info from context

            return HandlerSuccess.success("Logged out successfully");

        } catch (error) {
            throw tRPCErrorServices.tRPCError(error);
        }
    }

    // This method is for users who want to sign in using OTP sent to their email without password
    public static async sendCodeResetPassword(ctx: MyContext): Promise<ServerResponseDto | void> {
        try {
            return await tRPCAuthServices.sendCodeResetPassword(ctx);
        } catch (error) {
            throw tRPCErrorServices.tRPCError(error);
        }
    }

    // This method is for users who forgot their password and want to reset it using OTP sent to their email
    public static async resendCodeResetPassword(ctx: MyContext): Promise<ServerResponseDto | void> {
        try {
            return await tRPCAuthServices.resendCodeResetPassword(ctx);
        } catch (error) {
            throw tRPCErrorServices.tRPCError(error);
        }
    }

    public static async resetPassword(ctx: MyContext): Promise<ServerResponseDto | void> {
        try {
            return await tRPCAuthServices.resetPassword(ctx);
        } catch (error) {
            throw tRPCErrorServices.tRPCError(error);
        }
    }
}