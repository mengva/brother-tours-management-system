import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { logger } from 'hono/logger'
import { appRouter } from './router';
import { createdTRPCContext } from './context';
import { header } from '../../config/env';
import type { Context as HonoContext } from "hono";
import { RefreshTokenMiddleware } from '@/server/middleware/refreshToken';
import { RateLimiterMiddleware } from '@/server/middleware/rateLimiter';
import { generateUser } from '@/server/script/generateUser';

const app = new Hono();

app.use("/*", logger());

app.use("/*", async (c, next) => {
    await RateLimiterMiddleware.rateLimitAuthAndApi(c);
    await next();
});

// refresh user session
app.use("/*", async (c, next) => {
    await RefreshTokenMiddleware.refreshUserToken(c);
    await next();
});

// Enable CORS for all routes

header.setupCORS(app);

header.setupSecurityHeaders(app);

app.use('/trpc/*', trpcServer({
    router: appRouter,
    createContext: async (req, c) => {
        const context = await createdTRPCContext(c as HonoContext);
        return typeof context === 'object' ? context : {};
    },
}));

// Test route
app.get('/generate-user', async (c) => {
    await generateUser(c);
    return c.json({
        message: "Hello Hono + trpc",
    });
});

export default app;

