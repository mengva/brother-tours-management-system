import { HonoUserAuthMiddleware } from "@/server/middleware/authRest";
import { Hono, Handler, Env } from "hono";
type Method = "get" | "post" | "put" | "patch" | "delete";

// Helper function ສຳລັບສ້າງ procedure ໃນ Hono
const createProcedure = <E extends Env = Env>(
    app: Hono<E>,
    middleware?: Handler<E>
) => {
    const methods: Method[] = ["get", "post", "put", "patch", "delete"];

    return methods.reduce((acc, method) => {
        acc[method] = (path: string, ...handlers: Handler<E>[]) => {
            if (middleware) {
                return app[method](path, middleware, ...handlers);
            }
            return app[method](path, ...handlers);
        };
        return acc;
    }, {} as Record<Method, (path: string, ...handlers: Handler<E>[]) => Hono<E, any, any>>);
};

export const createRouter = <E extends Env = Env>() => {
    const router = new Hono<E>();

    return {
        router,
        publicProcedure: createProcedure(router),
        guestProcedure: createProcedure(router, HonoUserAuthMiddleware.preventReAuth),
        protectedProcedure: createProcedure(router, HonoUserAuthMiddleware.requireAuth),
    };
};