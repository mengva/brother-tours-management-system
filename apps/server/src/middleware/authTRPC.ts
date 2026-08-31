import { t } from "../server/trpc/procedures";
import { tokenName, UserAuthMiddlewareServices } from "../utils";

export class tRPCUserAuthMiddleware {

    public static preventReAuth = t.middleware(async ({ ctx, next }) => {

        const token = ctx.cookies.get(tokenName) || "";
        const deviceFingerprint = ctx.deviceFingerprint || "";

        await UserAuthMiddlewareServices.preventReAuth({
            token,
            deviceFingerprint
        });
        return next();
    });

    public static requireAuth = t.middleware(async ({ ctx, next }) => {

        const token = ctx.cookies.get(tokenName) || "";
        const deviceFingerprint = ctx.deviceFingerprint || "";

        const authData = await UserAuthMiddlewareServices.requireAuth({
            token,
            deviceFingerprint
        });

        ctx.c.set("userInfo", {
            userId: authData.userId,
            role: authData.role,
        });

        return next({
            ctx: {
                ...ctx,
                // userInfo: {
                //     userId: authData.userId,
                //     role: authData.role,
                // },
                deviceFingerprint: authData.deviceFingerprint,
            },
        });
    });

}


