import { ErrorCode } from "@/server/packages/utils";

export class AppError extends Error {
    constructor(
        public override message: string,
        public code: ErrorCode = 'INTERNAL_SERVER_ERROR'
    ) {
        super(message);
        this.name = 'AppError';
    }
}