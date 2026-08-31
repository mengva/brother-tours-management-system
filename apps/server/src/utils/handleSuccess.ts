import type { Context as HonoContext } from "hono";

export class HandlerSuccess {
    public static tRPCSuccess(message: string, data: any = {}) {
        return {
            success: true,
            message,
            data
        }
    }
}