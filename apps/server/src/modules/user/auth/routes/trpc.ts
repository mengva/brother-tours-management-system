import { guestProcedure, protectedProcedure, router } from "@/server/server/trpc/procedures";
import { tRPCUserAuthMutationServices } from "../services/mutation";
import { zodValidationSendOTPToEmail, zodValidationServerResetPassword, zodValidationSignIn, zodValidationSignInOTP, zodValidationSignUp } from "@/server/packages/validations";
import { HandlerSuccess, handleTRPCError } from "@/server/utils";

export const tRPCUserAuthRouter = router({
    signIn: guestProcedure
        .input(zodValidationSignIn)
        .mutation(async ({ input, ctx }) => {
            return await tRPCUserAuthMutationServices.signIn({ input, ctx });
        }),

    signUp: guestProcedure
        .input(zodValidationSignUp)
        .mutation(async ({ input, ctx }) => {
            return await tRPCUserAuthMutationServices.signUp({ input, ctx });
        }),

    sendCodeSignInOTP: guestProcedure
        .input(zodValidationSendOTPToEmail)
        .mutation(async ({ input, ctx }) => {
            return await tRPCUserAuthMutationServices.sendCodeSignInOTP({ input, ctx });
        }),

    resendCodeSignInOTP: guestProcedure
        .mutation(async ({ ctx }) => {
            return await tRPCUserAuthMutationServices.resendCodeSignInOTP(ctx.c);
        }),

    signInOTP: guestProcedure
        .input(zodValidationSignInOTP)
        .mutation(async ({ input, ctx }) => {
            return await tRPCUserAuthMutationServices.signInOTP({ input, ctx });
        }),

    signOut: protectedProcedure
        .mutation(async ({ ctx }) => {
            return await tRPCUserAuthMutationServices.signOut(ctx.c);
        }),

    sendCodeResetPassword: guestProcedure
        .input(zodValidationSendOTPToEmail)
        .mutation(async ({ input, ctx }) => {
            return await tRPCUserAuthMutationServices.sendCodeResetPassword({ input, ctx });
        }),

    resendCodeResetPassword: guestProcedure
        .mutation(async ({ ctx }) => {
            return await tRPCUserAuthMutationServices.resendCodeResetPassword(ctx.c);
        }),

    resetPassword: guestProcedure
        .input(zodValidationServerResetPassword)
        .mutation(async ({ input, ctx }) => {
            return await tRPCUserAuthMutationServices.resetPassword({ input, ctx });
        }),

    getUserAuth: protectedProcedure
        .query(async ({ ctx }) => {
            try {

                const userAuthInfo = ctx.c.get("userInfo") ?? {};

                return HandlerSuccess.tRPCSuccess("User authentication information retrieved successfully?", userAuthInfo);

            } catch (error) {
                throw handleTRPCError(error);
            }
        })

});