import { t } from "../server/trpc/procedures";
import { TRPCError } from "@trpc/server";
import db from "../config/db";
import { Helper, tokenName, tRPCErrorServices } from "../utils";
import type { UserRoleDto } from "@/server/packages/types";

export class tRPCUserAuthMiddleware {

    public static isUserAlreadyAuth = t.middleware(async ({ ctx, next }) => {

        const token = ctx.getCookie(tokenName);

        if (token) {
            try {
                // Verify JWT and extract payload
                const payload = await Helper.verifyTokenSecret(token);
                // Security Check: Compare Token's User-Agent with Current Request's User-Agent
                if (payload) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "You are already authenticated. Please sign out before trying to sign in again.",
                    });
                } else {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "Invalid or expired authentication token. Please sign in again.",
                    });
                }
            } catch (error) {
                throw tRPCErrorServices.tRPCError(error);
            }
        }

        return await next();
    });

    public static isUserAuth = t.middleware(async ({ ctx, next }) => {
        // Determine the token name based on the user's role (staff in this case)

        // 1. Get token from cookies
        const token = ctx.getCookie(tokenName);
        const userAgent = ctx.userAgent; // Get current User-Agent from Request Headers

        if (!token) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Authentication token is missing",
            });
        }

        try {
            // 2. Verify JWT and extract payload
            const payload = await Helper.verifyTokenSecret(token);

            // 3. Security Check: Compare Token's User-Agent with Current Request's User-Agent
            // This prevents Session Hijacking from different browsers/devices
            if (payload.userAgent !== userAgent) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid session: Device mismatch detected. Please login again.",
                });
            }

            // 4. Double Check with Database (Optional but recommended for Role/Status)
            const user = await db.query.users.findFirst({
                where: (users, { eq, and }) => and(
                    eq(users.id, payload.userId),
                    eq(users.isActive, true),
                ),
            });

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User account no longer exists or is inactive",
                });
            }

            ctx.userInfo = {
                userId: payload.userId,
                role: payload.role as UserRoleDto,
            }; // Attach user info to context for downstream procedures

            ctx.userAgent = payload.userAgent; // Attach user agent to context for potential future use (e.g., logging, analytics)

            // 5. Pass user data to the next procedure context
            return await next();

        } catch (error) {
            throw tRPCErrorServices.tRPCError(error);
        }
    });

}
