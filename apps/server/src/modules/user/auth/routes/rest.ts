import { zodValidationSendOTPToEmail, ZodValidationSendOTPToEmail, zodValidationSignIn, ZodValidationSignIn, ZodValidationSignInOTP, ZodValidationSignUp, zodValidationSignUp } from "@/server/packages/validations";
import { createRouter } from "@/server/server/rest/procedures";
import { handleHonoError, ZodValidateRestApiServices } from "@/server/utils";
import { AuthServices } from "../utils";
import { HonoUserAuthMiddleware } from "@/server/middleware/authRest";
import { SendCodeSignInOTPDto, SignInOTPDto, SignUpDto } from "../types";
import { HonoUserAuthMutationServices } from "../services/mutation";

const { router, guestProcedure } = createRouter();
const { validate } = ZodValidateRestApiServices;
const { getUserAgentAndDevice } = HonoUserAuthMiddleware;

guestProcedure.post("/sign-in", validate("json", zodValidationSignIn), async (c) => {
    try {
        const body = await c.req.json<ZodValidationSignIn>();

        return await HonoUserAuthMutationServices.signIn(c, body);

    } catch (error) {
        throw handleHonoError(error);
    }
});


guestProcedure.post("/sign-up", validate("json", zodValidationSignUp), async (c) => {
    try {
        const { confirmPassword, ...input } = await c.req.json<ZodValidationSignUp>();

        const {
            userAgent,
        } = getUserAgentAndDevice(c);

        await AuthServices.signUp({
            ...input,
            userAgent,
        } as SignUpDto);

        c.json({
            success: true,
            messages: "SignUp successfully"
        }, 201);
    } catch (error) {
        throw handleHonoError(error);
    }
});


guestProcedure.post("/send-code-sign-in-otp", validate("json", zodValidationSendOTPToEmail), async (c) => {
    try {
        const { email } = await c.req.json<ZodValidationSendOTPToEmail>();

        await AuthServices.sendCodeSignInOTP({
            email,
            ctx: c
        } as SendCodeSignInOTPDto);

        c.json({
            success: true,
            messages: "Sent code to your email successfully"
        }, 201);
    } catch (error) {
        throw handleHonoError(error);
    }
});

guestProcedure.post("/resend-code-sign-in-otp", async (c) => {
    try {

        await AuthServices.resendCodeSignInOTP(c);

        c.json({
            success: true,
            messages: "Resend code to your email successfully"
        }, 201);
    } catch (error) {
        throw handleHonoError(error);
    }
});

guestProcedure.post("/sign-in-otp", validate("json", zodValidationSignIn), async (c) => {
    try {
        const { code } = await c.req.json<ZodValidationSignInOTP>();

        const {
            userAgent,
            deviceFingerprint
        } = getUserAgentAndDevice(c);

        await AuthServices.signInOTP({
            code,
            ctx: c,
            userAgent,
            deviceFingerprint
        } as SignInOTPDto);

        c.json({
            success: true,
            messages: "OTP Sign in successful"
        }, 201);
    } catch (error) {
        throw handleHonoError(error);
    }
});

export default router;