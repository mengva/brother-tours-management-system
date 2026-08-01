import { tRPCUserAuthRouter } from "@/server/modules/user/auth/routes/trpc";
import { router } from "./procedures";

export const appRouter = router({
  app: router({
    user: router({
      auth: tRPCUserAuthRouter
    })
  })
});

export type AppRouter = typeof appRouter;
