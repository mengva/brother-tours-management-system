import type { ServerErrorDto, TRPCCodeError } from "@/server/packages/types";
import { ErrorHandler } from "@/server/packages/utils";
import { TRPCError } from "@trpc/server";

export class tRPCErrorServices {
    public static message(message: string, code: TRPCCodeError) {
        throw new TRPCError({
            code,
            message
        });
    }

    public static tRPCError(error: ServerErrorDto) {
        const message = ErrorHandler.getErrorMessage(error);
        if (error instanceof TRPCError) {
            let code = error.code as TRPCCodeError;
            throw this.message(message, code);
        }
        throw new Error(message);
    }
}