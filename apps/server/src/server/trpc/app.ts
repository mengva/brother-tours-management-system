import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { logger } from 'hono/logger';
import { appRouter } from './router';
import { createdTRPCContext } from './context';
import type { Context as HonoContext } from 'hono';
import { RefreshTokenMiddleware } from '@/server/middleware/refreshToken';
import { RateLimiterMiddleware } from '@/server/middleware/rateLimiter';
import { env } from '../../config/env';
import { SecurityHeaders } from '@/server/config';
import { bodyLimit } from 'hono/body-limit';
import { createNodeWebSocket } from '@hono/node-ws'; // 👈 1. Import node-ws

const app = new Hono();

// 👈 Create WebSocket Helper
export const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

const isProd = env('NODE_ENV') === 'production';
const isDev = env('NODE_ENV') === 'development';

// 1. Logging (only in development is also fine)
app.use('/*', logger());

// 2. Security headers + CORS (must be early)
SecurityHeaders.setupSecurityHeaders(app);
SecurityHeaders.setupCORS(app);

app.use('/*', async (c, next) => {
    if (isProd && c.req.header('x-forwarded-proto') === 'http') {
        const host = c.req.header('host');
        return c.redirect(`https://${host}${c.req.path}`, 301);
    }
    await next();
});

app.use('/*', bodyLimit({
    maxSize: 50 * 1024 * 1024, // 50MB
    onError: (c) => {
        return c.json({
            success: false,
            message: 'File or request body is too large (maximum 50MB)',
        }, 413);
    },
}));

// 3. Rate limiting (ALL methods, not only GET)
app.use('/*', async (c, next) => {
    await RateLimiterMiddleware.rateLimitAuthAndApi(c);
    await next();
});

// 4. Refresh token middleware
app.use('/*', async (c, next) => {
    await RefreshTokenMiddleware.refreshUserToken(c);
    await next();
});

// 5. tRPC
app.use(
    '/trpc/*',
    trpcServer({
        router: appRouter,
        createContext: async (_opts, c) => {
            return createdTRPCContext(c as HonoContext);
        },
    })
);

// 404 handler — mirrors the Express catch-all shape
app.notFound((c) => {
    return c.json(
        {
            success: false,
            message: `Route ${c.req.path} not found`,
        },
        404
    );
});

// Global error handler — mirrors the Express global error handler shape
app.onError((err, c) => {
    console.error('🔥 Global Error:', err);

    const statusCode = (err as any).statusCode || (err as any).status || 500;
    const message = err.message || 'Internal Server Error';

    return c.json(
        {
            success: false,
            message,
            ...(isDev && { stack: err.stack }),
        },
        statusCode
    );
});

// 6. Health check (safe for production)
app.get('/health', (c) => {
    return c.json({
        success: true,
        message: 'OK',
        timestamp: new Date().toISOString(),
    });
});

// Remove or protect this in production
if (isDev) {
    app.get('/generate-user', (c) => {
        return c.json({ message: 'Hello Hono + tRPC' });
    });
}

app.get(
    '/ws',
    upgradeWebSocket((c) => {
        // Can be Query Params or Auth Token from cookie/header here
        const userId = c.req.query('userId') || 'anonymous';

        return {
            onOpen(evt, ws) {
                console.log(`🔌 Client connected: ${userId}`);
                ws.send(JSON.stringify({ event: 'connected', message: 'Welcome to WebSocket Server!' }));
            },
            onMessage(evt, ws) {
                console.log(`📩 Message from ${userId}:`, evt.data);
                // Echo back or Broadcast to another
                ws.send(JSON.stringify({ event: 'reply', data: evt.data }));
            },
            onClose(evt, ws) {
                console.log(`❌ Client disconnected: ${userId}`);
            },
            onError(evt, ws) {
                console.error('🔥 WS Error:', evt);
            },
        };
    })
);

export default app;