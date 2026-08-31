import type { UserRoleDto } from '@/server/packages/types';
import type { Context as HonoContext } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

export type UserInfoDto = {
  userId: string;
  role: UserRoleDto;
};

export type AppVariables = {
  // bodyInfo: Record<string, unknown>;
  ip: string;
  userAgent: string;
  userInfo: UserInfoDto;
  deviceFingerprint: string;
};

export type AppEnv = {
  Variables: AppVariables;
};

declare module 'hono' {
  interface ContextVariableMap extends AppVariables { }
}

const ANONYMOUS_USER: UserInfoDto = {
  userId: '',
  role: '' as UserRoleDto,
};

export const getIPAddress = (c: HonoContext<AppEnv>): string => {
  const forwarded = c.req.header('x-forwarded-for');
  return (
    c.req.header('cf-connecting-ip') ||
    c.req.header('x-real-ip') ||
    (forwarded?.split(',')[0]?.trim() ?? undefined) ||
    '127.0.0.1'
  );
};

export const getUserAgent = (c: HonoContext<AppEnv>) =>
  c.req.header('user-agent') ?? c.req.header('User-Agent') ?? '';

export const getDeviceFingerPrint = (c: HonoContext<AppEnv>) =>
  c.req.header('x-device-fingerprint') ?? '';

export const createdTRPCContext = (c: HonoContext<AppEnv>) => {
  return {
    c,
    ip: getIPAddress(c),
    userAgent: getUserAgent(c),
    deviceFingerprint: getDeviceFingerPrint(c),
    // userInfo: c.get('userInfo') ?? ANONYMOUS_USER,
    // bodyInfo: c.get('bodyInfo') ?? {},
    cookies: {
      get: (name: string) => getCookie(c, name),
      set: (name: string, value: string, options?: Parameters<typeof setCookie>[3]) =>
        setCookie(c, name, value, options),
      delete: (name: string, options?: Parameters<typeof deleteCookie>[2]) =>
        deleteCookie(c, name, options),
    },
  };
};

export type MyContext = ReturnType<typeof createdTRPCContext>;