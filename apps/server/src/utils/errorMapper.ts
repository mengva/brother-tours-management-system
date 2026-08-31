import { HTTPException } from 'hono/http-exception';
import { TRPC_ERROR_CODE_KEY, TRPCError } from '@trpc/server';
import { ErrorCode } from '@/server/packages/utils';
import { AppError } from './errors';

// Single source of truth
/** Single source of truth */
export const ERROR_MAP: Record<
    ErrorCode,
    { http: number; trpc: TRPC_ERROR_CODE_KEY }
> = {
    PARSE_ERROR: { http: 400, trpc: 'PARSE_ERROR' }, //Invalid JSON / parsing error
    BAD_REQUEST: { http: 400, trpc: 'BAD_REQUEST' }, //Client error (bad input)
    UNAUTHORIZED: { http: 401, trpc: 'UNAUTHORIZED' }, //Missing / invalid auth
    PAYMENT_REQUIRED: { http: 402, trpc: 'PAYMENT_REQUIRED' }, //Payment required
    FORBIDDEN: { http: 403, trpc: 'FORBIDDEN' }, //Authenticated but not allowed
    NOT_FOUND: { http: 404, trpc: 'NOT_FOUND' }, //Resource not found
    METHOD_NOT_SUPPORTED: { http: 405, trpc: 'METHOD_NOT_SUPPORTED' }, //HTTP method not allowed
    TIMEOUT: { http: 408, trpc: 'TIMEOUT' }, //Request timed out
    CONFLICT: { http: 409, trpc: 'CONFLICT' }, //Conflict (e.g. duplicate)
    PRECONDITION_FAILED: { http: 412, trpc: 'PRECONDITION_FAILED' }, //Precondition failed
    PAYLOAD_TOO_LARGE: { http: 413, trpc: 'PAYLOAD_TOO_LARGE' }, //Body too large
    UNSUPPORTED_MEDIA_TYPE: { http: 415, trpc: 'UNSUPPORTED_MEDIA_TYPE' }, //Unsupported content type
    UNPROCESSABLE_CONTENT: { http: 422, trpc: 'UNPROCESSABLE_CONTENT' }, //Validation / semantic error (note: older versions used UNPROCESSABLE_ENTITY)
    PRECONDITION_REQUIRED: { http: 428, trpc: 'PRECONDITION_REQUIRED' }, //Missing required precondition header
    TOO_MANY_REQUESTS: { http: 429, trpc: 'TOO_MANY_REQUESTS' }, //Rate limit
    CLIENT_CLOSED_REQUEST: { http: 499, trpc: 'CLIENT_CLOSED_REQUEST' }, //Client closed connection
    INTERNAL_SERVER_ERROR: { http: 500, trpc: 'INTERNAL_SERVER_ERROR' }, //Unexpected server error
    NOT_IMPLEMENTED: { http: 501, trpc: 'NOT_IMPLEMENTED' }, //Feature not implemented
    BAD_GATEWAY: { http: 502, trpc: 'BAD_GATEWAY' }, //Bad upstream response
    SERVICE_UNAVAILABLE: { http: 503, trpc: 'SERVICE_UNAVAILABLE' }, //Service temporarily unavailable
    GATEWAY_TIMEOUT: { http: 504, trpc: 'GATEWAY_TIMEOUT' }, //Upstream timeout
};

// 1️⃣ Hono
export const handleHonoError = (error: unknown): never => {
    if (error instanceof AppError) {
        const status = ERROR_MAP[error.code]?.http ?? 500;
        throw new HTTPException(status as any, { message: error.message });
    }
    if (error instanceof HTTPException) throw error;

    console.error('[Unhandled Hono Error]:', error);
    throw new HTTPException(500, { message: 'Internal Server Error' });
};

// 2️⃣ tRPC
export const handleTRPCError = (error: unknown): never => {
    if (error instanceof AppError) {
        const code = ERROR_MAP[error.code]?.trpc ?? 'INTERNAL_SERVER_ERROR';
        throw new TRPCError({ code, message: error.message });
    }
    if (error instanceof TRPCError) throw error;

    console.error('[Unhandled tRPC Error]:', error);
    throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error',
    });
};