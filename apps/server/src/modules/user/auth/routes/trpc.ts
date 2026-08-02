import { publicProcedure, router } from "@/server/server/trpc/procedures";
import { tRPCUserAuthMutationServices } from "../services/mutation";
import { tRPCUserAuthMiddleware } from "@/server/middleware/authTRPC";
import { zodValidationSendOTPToEmail, zodValidationServerResetPassword, zodValidationSignIn, zodValidationSignInOTP } from "@/server/packages/validations";
import { HandlerSuccess, tRPCErrorServices } from "@/server/utils";

export const tRPCUserAuthRouter = router({
    signIn: publicProcedure
        .input(zodValidationSignIn)
        .use(tRPCUserAuthMiddleware.isUserAlreadyAuth)
        .mutation(async ({ input, ctx }) => {
            ctx.bodyInfo = { ...input }; // Store the original input for logging or debugging purposes
            return await tRPCUserAuthMutationServices.signIn(ctx);
        }),

    sendCodeSignInOTP: publicProcedure
        .input(zodValidationSendOTPToEmail)
        .use(tRPCUserAuthMiddleware.isUserAlreadyAuth)
        .mutation(async ({ input, ctx }) => {
            ctx.bodyInfo = { ...input }; // Store the original input for logging or debugging purposes
            return await tRPCUserAuthMutationServices.sendCodeSignInOTP(ctx);
        }),

    resendCodeSignInOTP: publicProcedure
        .use(tRPCUserAuthMiddleware.isUserAlreadyAuth)
        .mutation(async ({ ctx }) => {
            return await tRPCUserAuthMutationServices.resendCodeSignInOTP(ctx);
        }),

    signInOTP: publicProcedure
        .input(zodValidationSignInOTP)
        .use(tRPCUserAuthMiddleware.isUserAlreadyAuth)
        .mutation(async ({ input, ctx }) => {
            ctx.bodyInfo = { ...input }; // Store the original input for logging or debugging purposes
            return await tRPCUserAuthMutationServices.signInOTP(ctx);
        }),

    signOut: publicProcedure
        .use(tRPCUserAuthMiddleware.isUserAuth)
        .mutation(async ({ ctx }) => {
            return await tRPCUserAuthMutationServices.signOut(ctx);
        }),

    sendCodeResetPassword: publicProcedure
        .input(zodValidationSendOTPToEmail)
        .use(tRPCUserAuthMiddleware.isUserAlreadyAuth)
        .mutation(async ({ input, ctx }) => {
            ctx.bodyInfo = { ...input }; // Store the original input for logging or debugging purposes
            return await tRPCUserAuthMutationServices.sendCodeResetPassword(ctx);
        }),

    resendCodeResetPassword: publicProcedure
        .use(tRPCUserAuthMiddleware.isUserAlreadyAuth)
        .mutation(async ({ ctx }) => {
            return await tRPCUserAuthMutationServices.resendCodeResetPassword(ctx);
        }),

    resetPassword: publicProcedure
        .input(zodValidationServerResetPassword)
        .use(tRPCUserAuthMiddleware.isUserAlreadyAuth)
        .mutation(async ({ input, ctx }) => {
            ctx.bodyInfo = { ...input }; // Store the original input for logging or debugging purposes
            return await tRPCUserAuthMutationServices.resetPassword(ctx);
        }),


    getUserAuth: publicProcedure
        .use(tRPCUserAuthMiddleware.isUserAuth)
        .query(async ({ ctx }) => {
            try {

                const userAuthInfo = ctx.userInfo ?? {};

                return HandlerSuccess.success("User authentication information retrieved successfully?", userAuthInfo);

            } catch (error) {
                throw tRPCErrorServices.tRPCError(error);
            }
        })

});