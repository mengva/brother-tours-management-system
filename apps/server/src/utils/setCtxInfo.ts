import { UserRoleDto } from "@/server/packages/types";
import type { Context as HonoContext } from 'hono';

export class SetCtxInfoServices {
   
    // public static bodyInfo(input: any, ctx: HonoContext) {
    //     ctx.bodyInfo = { ...input }; // Store the original input for logging or debugging purposes
    //     ctx.set("bodyInfo", input)
    //     return ctx;
    // }

    public static userInfo(input: {
        userId: string;
        role: UserRoleDto;
    }, ctx: HonoContext) {
        // ctx.userInfo = { ...input }; // Store the original input for logging or debugging purposes
        ctx.set("userInfo", input);
        return ctx;
    }
}