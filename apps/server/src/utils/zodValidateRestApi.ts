import { zValidator } from "@hono/zod-validator";
import type { Context as HonoContext } from "hono";
import { ZodObject } from "zod";
import { AppError } from "./errors";

export type bodyType = "cookie" | 'form' | "json" | "header" | "param" | "query";

export class ZodValidateRestApiServices {
    public static validate(target: bodyType, zodValidate: ZodObject) {
        return zValidator(target, zodValidate, (result) => {
            if (!result?.success) {
                throw new AppError(result.error.message || "Invalid validate zod data", "UNSUPPORTED_MEDIA_TYPE");
            }
        });
    }

    public static async validateBody(c: HonoContext, zodValidate: ZodObject) {
        const body = await c.req.json();
        const validate = zodValidate.safeParse(body);
        if (!validate?.success) {
            throw new AppError(validate.error.message || "Invalid validate zod data", "UNSUPPORTED_MEDIA_TYPE");
        }
        return validate.data;
    }
}