import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { env } from './env';

export class SecurityHeaders {
    public static setupCORS(app: Hono) {
        const isProd = env('NODE_ENV') === 'production';

        const allowedOrigins = isProd
            ? env('CORS_ORIGIN').split(',').map((o) => o.trim())
            : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'];

        return app.use(
            '/*',
            cors({
                origin: (origin) => {
                    // Allow requests with no origin (mobile apps, curl, server-to-server)
                    if (!origin) return origin; // or return allowedOrigins[0] if you want stricter

                    return allowedOrigins.includes(origin) ? origin : null;
                },
                credentials: true,
                maxAge: 86400, // 24 hours
                allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
                allowHeaders: [
                    'Content-Type',
                    'Authorization',
                    'Cookie',
                    'Header',
                    'X-Requested-With',
                    'x-device-fingerprint',
                ],
                exposeHeaders: ['Content-Length', 'Set-Cookie'],
            })
        );
    }

    public static setupSecurityHeaders(app: Hono) {
        const isProd = env('NODE_ENV') === 'production';

        return app.use('*', async (c, next) => {
            // Basic security headers
            c.header('X-Content-Type-Options', 'nosniff');
            c.header('X-Frame-Options', 'DENY');
            c.header('X-XSS-Protection', '0'); // modern browsers ignore this; CSP is better
            c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
            c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

            if (isProd) {
                c.header(
                    'Strict-Transport-Security',
                    'max-age=31536000; includeSubDomains; preload'
                );

                c.header(
                    'Content-Security-Policy',
                    [
                        "default-src 'self'",
                        "script-src 'self' 'unsafe-inline'",
                        "style-src 'self' 'unsafe-inline'",
                        "img-src 'self' data: https://res.cloudinary.com https://utfs.io https://uploadthing.com",
                        "connect-src 'self' ws: wss:",
                        "frame-ancestors 'none'",
                        "object-src 'none'",
                        "base-uri 'self'",
                        "form-action 'self'",
                    ].join('; ')
                );
            }

            await next();
        });
    }
}