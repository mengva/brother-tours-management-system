import { serve } from '@hono/node-server'
import app from './trpc/app';
import { env } from '../config/env';

serve({
  fetch: app.fetch,
  port: `${env("PORT")}` as any,
});

console.log(`✅ Server running at http://localhost:${env("PORT")}`);
