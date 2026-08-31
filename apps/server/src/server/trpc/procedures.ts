import { initTRPC } from "@trpc/server"
import { parse, stringify } from "devalue";
import superjson from "superjson";
import type { MyContext } from "./context";
import { handleTRPCError, tokenName, UserAuthMiddlewareServices } from "@/server/utils";

export const transformer = {
  deserialize: (object: any) => parse(object),
  serialize: (object: any) => stringify(object),
};

export const t = initTRPC.context<MyContext>().create({
  transformer: superjson,
});

// ============================================
// Auth Middleware
// ============================================
const isAuthenticated = t.middleware(async ({ ctx, next }) => {

  const token = ctx.cookies.get(tokenName) || "";
  const deviceFingerprint = ctx.deviceFingerprint || "";

  try {
    const authData = await UserAuthMiddlewareServices.requireAuth({
      token,
      deviceFingerprint
    });

    return next({
      ctx: {
        ...ctx,
        userInfo: {
          userId: authData.userId,
          role: authData.role,
        },
        deviceFingerprint: authData.deviceFingerprint
      },
    });
  } catch (error) {
    throw handleTRPCError(error);
  }
});
const isUnauthenticatedOnly = t.middleware(async ({ ctx, next }) => {

  const token = ctx.cookies.get(tokenName) || "";
  const deviceFingerprint = ctx.deviceFingerprint || "";

  await UserAuthMiddlewareServices.preventReAuth({
    token,
    deviceFingerprint
  });
  return next();
});

// ============================================
// Procedures
// ============================================

/** Anyone can access */
export const router = t.router;
export const publicProcedure = t.procedure;

/** Must be logged in */
export const protectedProcedure = t.procedure.use(isAuthenticated);

/** Must be unauthenticatedOnly */
export const guestProcedure = t.procedure.use(isUnauthenticatedOnly);

/** Only Admin */
export const adminProcedure = t.procedure.use(UserAuthMiddlewareServices.hasRole(["Admin"]));

/** Admin or Moderator */
// export const moderatorProcedure = t.procedure.use(
//   hasRole(['ADMIN', 'MODERATOR'])
// );

/** Example: only specific roles */
// export const staffProcedure = t.procedure.use(
//   hasRole(['ADMIN', 'MODERATOR', 'STAFF'])
// );