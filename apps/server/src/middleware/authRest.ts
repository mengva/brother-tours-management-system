import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { tokenName, UserAuthMiddlewareServices } from "../utils";
import type { Context as HonoContext } from "hono";
import { getDeviceFingerPrint, getUserAgent } from "../server/trpc/context";

export class HonoUserAuthMiddleware {

    public static getTokenAndDevice(c: HonoContext) {
        const token = getCookie(c, tokenName) || "";
        const deviceFingerprint = getDeviceFingerPrint(c);

        return {
            token,
            deviceFingerprint
        }
    }

    public static getUserAgentAndDevice(c: HonoContext) {
        const userAgent = getUserAgent(c);
        const deviceFingerprint = getDeviceFingerPrint(c);

        return {
            userAgent,
            deviceFingerprint
        }
    }

    public static preventReAuth = createMiddleware(async (c, next) => {
        const {
            token,
            deviceFingerprint
        } = this.getTokenAndDevice(c);

        await UserAuthMiddlewareServices.preventReAuth({
            token,
            deviceFingerprint,
        });

        await next();
    });

    public static requireAuth = createMiddleware(async (c, next) => {
        const {
            token,
            deviceFingerprint
        } = this.getTokenAndDevice(c);

        const authData = await UserAuthMiddlewareServices.requireAuth({
            token,
            deviceFingerprint,
        });

        // ເອົາຂໍ້ມູນອັດໃສ່ Context Variables ຂອງ Hono ໄດ້ເລີຍ
        c.set("userInfo", {
            userId: authData.userId,
            role: authData.role,
        });

        c.set("deviceFingerprint", authData.deviceFingerprint);

        await next();
    });

}