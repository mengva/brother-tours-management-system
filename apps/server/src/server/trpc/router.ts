import { router } from "./procedures";

export const appRouter = router({
  app: router({

  })
});

export type AppRouter = typeof appRouter;
