import { serve } from '@hono/node-server'
import app, { injectWebSocket } from './trpc/app';
import { env } from '../config/env';

const PORT = Number(env('PORT')) || 5050;

const server = serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    console.log(`🚀 Server running at http://localhost:${info.port}`);
  }
);

injectWebSocket(server);

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`🔥 Port ${PORT} is already in use.`);
  } else {
    console.error('🔥 Server failed to start:', err);
  }
  process.exit(1);
});

// Graceful shutdown — same reasoning as your Express entry: container
// platforms (Docker, Render, Railway, k8s) send SIGTERM on redeploy, and
// without this the process is killed mid-request instead of finishing
// in-flight work.
const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000).unref();
};

process.on('SIGINT', shutdown);  // Ctrl + C
process.on('SIGTERM', shutdown); // Docker / PM2 stop
