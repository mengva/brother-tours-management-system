import { initTRPC } from "@trpc/server"
import { parse, stringify } from "devalue";
import superjson from "superjson";
import type { MyContext } from "./context";

export const transformer = {
  deserialize: (object: any) => parse(object),
  serialize: (object: any) => stringify(object),
};

export const t = initTRPC.context<MyContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;