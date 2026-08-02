import db from "../config/db";
import { CookieServices, HandlerSuccess, Helper, tokenName } from "../utils";
import { Context as HonoContext } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import type { UserRoleDto } from "@/server/packages/types";

interface PayloadDto {
    userId: string;
    role: string;
    userAgent: string;
    exp: number; // Expiration time in seconds since the epoch
    iat: number;
}

export class RefreshTokenMiddleware {

    public static async refreshToken(oldToken: string, currentUA: string) {
        try {
            // 1. Verify and get payload
            const payload = await Helper.verifyTokenSecret(oldToken) as PayloadDto;

            if (payload.userAgent !== currentUA) {
                console.warn("User agent mismatch. Possible token theft attempt.");
                return { action: "ERROR", token: oldToken, role: null };
            }

            // --- NEW LOGIC: CHECK REMAINING TIME ---
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            const secondsIn7Days = 7 * 24 * 60 * 60; // 604,800 seconds

            // If (Expiration Time - Current Time) > 7 days, 
            // it means the token is still "young" enough. No need to refresh.
            if (payload.exp && (payload.exp - currentTime) > secondsIn7Days) {
                return { action: "NONE", token: oldToken };
            }
            // ---------------------------------------

            // 2. If it's less than 7 days, proceed to validate user and generate new token
            const user = await db.query.users.findFirst({
                where: (users, { eq, and }) => and(
                    eq(users.id, payload.userId),
                    eq(users.isActive, true),
                )
            });

            if (!user) {
                console.warn("User account is no longer active or exists")
                return { action: "ERROR", token: oldToken, role: null };
            }

            const newToken = await Helper.generateToken({
                userId: user.id,
                role: user.role as UserRoleDto,
                userAgent: currentUA,
            });

            return { action: "REFRESHED", token: newToken, role: user.role };

        } catch (error) {
            return { action: "ERROR", token: oldToken, role: null };
        }
    }

    public static async refreshUserToken(ctx: HonoContext) {
        // ... (Keep the role and cookie logic same as before) ...
        const oldToken = getCookie(ctx, tokenName);
        const currentUA = ctx.req.header("user-agent") || "";

        if (!oldToken) {
            console.warn("No session found");
            return;
        }

        try {

            const result = await this.refreshToken(oldToken, currentUA);

            // Only set a new cookie if the action is "REFRESHED"
            if (result.action === "REFRESHED" && result.role) {
                const cookieName = getCookie(ctx, tokenName);

                if (!cookieName) {
                    console.warn("Token name not found in cookies");
                    return;
                }

                setCookie(ctx, tokenName, result.token, CookieServices.cookieOption);
                return HandlerSuccess.success("Token has been extended for another period");
            }

            // If action is "NONE", just return success without updating cookie
            return HandlerSuccess.success("Token is still valid for more than 7 days");

        } catch (error) {
            console.warn("Refresh Token Error:", error);
        }
    }
}