import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@workspace/server/trpc/router';

export const trpc: ReturnType<typeof createTRPCReact<AppRouter>> = createTRPCReact<AppRouter>();

export default trpc;