import { ZodValidationSignIn } from "@/server/packages/validations";
import type { Context as HonoContext } from "hono";
import { AuthServices } from "../../utils";
import { setCookie } from "hono/cookie";
import { CookieServices, handleHonoError, tokenName } from "@/server/utils";
import { SignInDto } from "../../types";

export class HonoUserAuthMutationServices {
  public static async signIn(ctx: HonoContext, body: ZodValidationSignIn) {
    try {
      const {
        token,
        message
      } = await AuthServices.signIn({
        ...body,
        userAgent: ctx.get("userAgent") || "",
        deviceFingerprint: ctx.get("deviceFingerprint") || ""
      } as SignInDto);

      setCookie(ctx, tokenName, token, CookieServices.option);

      return ctx.json({
        success: true,
        message
      }, 201);
      
    } catch (error) {
      throw handleHonoError(error);
    }
  }
}