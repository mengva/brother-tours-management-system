import { TRPCError } from "@trpc/server";
import { MyContext } from "../server/trpc/context.js";
import { Helper } from "./helper.js";
import db from "../config/db.js";
import { UserRoleDto } from "@/server/packages/types";
import { t } from "../server/trpc/procedures";
import { AppError } from "./errors.js";

// Type for next function in the tRPC Middleware
type TRPCNextFn<TContext extends MyContext> = {
    <TContextOverrides>(opts?: { ctx?: TContextOverrides }): Promise<{
        ok: boolean;
        data: unknown;
        ctx: TContext & TContextOverrides;
    }>;
};

export class UserAuthMiddlewareServices {

    public static async preventReAuth({
        token,
        deviceFingerprint
    }: {
        token: string;
        deviceFingerprint: string;
    }) {

        if (token) {
            try {
                // Verify JWT and extract payload
                const payload = await Helper.verifyTokenSecret(token);
                // Security Check: Compare Token's User-Agent with Current Request's User-Agent
                if (payload && payload.deviceFingerprint === deviceFingerprint) {
                    throw new AppError("You are already authenticated. Please sign out before trying to sign in again.", "BAD_REQUEST");
                } else {
                    throw new AppError("Invalid authentication token. Please sign in again.", "UNAUTHORIZED");
                }
            } catch (error) {
                if (error instanceof AppError) throw error;
                throw new AppError("Invalid or expired authentication token", "UNAUTHORIZED");
            }
        }
    }
    public static async requireAuth({
        token,
        deviceFingerprint
    }: {
        token: string;
        deviceFingerprint: string;
    }): Promise<{
        userId: string;
        role: UserRoleDto;
        deviceFingerprint: string;
    }> {
        if (!token) {
            throw new AppError("Authentication token is missing", "UNAUTHORIZED");
        }

        try {
            // 1. Verify JWT
            const payload = await Helper.verifyTokenSecret(token);

            // 2. Device Fingerprint Check
            if (payload.deviceFingerprint !== deviceFingerprint) {
                throw new AppError("Invalid session: Device mismatch detected. Please login again.", "UNAUTHORIZED");
            }

            // 3. Database Check
            const user = await db.query.users.findFirst({
                where: (users, { eq, and }) =>
                    and(
                        eq(users.id, payload.userId),
                        eq(users.isActive, true)
                    ),
            });

            if (!user) {
                throw new AppError("User account no longer exists or is inactive", "NOT_FOUND");
            }

            return {
                userId: payload.userId,
                role: payload.role as UserRoleDto,
                deviceFingerprint: payload.deviceFingerprint,
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Invalid or expired authentication token", "UNAUTHORIZED");
        }
    }

    public static hasRole = (allowedRoles: UserRoleDto[]) => t.middleware(async ({ ctx, next }) => {

        const { userId, role } = ctx.c.get("userInfo");

        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'You must be logged in',
            });
        }

        if (!allowedRoles.includes(role as UserRoleDto)) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You do not have permission to access this resource',
            });
        }

        ctx.c.set("userInfo", {
            userId,
            role,
        });

        return next({ ctx });
    });
}

