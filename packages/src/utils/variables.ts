// export type ErrorCode =
//   | 'PARSE_ERROR'              // 400
//   | 'BAD_REQUEST'              // 400
//   | 'UNAUTHORIZED'             // 401
//   | 'PAYMENT_REQUIRED'         // 402
//   | 'FORBIDDEN'                // 403
//   | 'NOT_FOUND'                // 404
//   | 'METHOD_NOT_SUPPORTED'     // 405
//   | 'TIMEOUT'                  // 408
//   | 'CONFLICT'                 // 409
//   | 'PRECONDITION_FAILED'      // 412
//   | 'PAYLOAD_TOO_LARGE'        // 413
//   | 'UNSUPPORTED_MEDIA_TYPE'   // 415
//   | 'UNPROCESSABLE_CONTENT'    // 422
//   | 'PRECONDITION_REQUIRED'    // 428
//   | 'TOO_MANY_REQUESTS'        // 429
//   | 'CLIENT_CLOSED_REQUEST'    // 499
//   | 'INTERNAL_SERVER_ERROR'    // 500
//   | 'NOT_IMPLEMENTED'          // 501
//   | 'BAD_GATEWAY'              // 502
//   | 'SERVICE_UNAVAILABLE'      // 503
//   | 'GATEWAY_TIMEOUT';         // 504

import { TRPC_ERROR_CODE_KEY } from "@trpc/server";

export type ErrorCode = TRPC_ERROR_CODE_KEY;