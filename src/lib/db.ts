// Database client that works on both local dev (SQLite file) and Cloudflare D1
import { PrismaClient } from '@prisma/client';

// Cache per-request PrismaClient
let cachedClient: PrismaClient | null = null;

// Type for D1 binding
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
  exec(query: string): Promise<D1Result>;
  binding(value: any): D1Binding;
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = any>(): Promise<T | null>;
  all<T = any>(): Promise<{ results: T[]; success: boolean; meta: any }>;
  run<T = any>(): Promise<D1Result<T>>;
  raw<T = any>(): Promise<T[]>;
}

interface D1Result<T = any> {
  results?: T[];
  success: boolean;
  meta: any;
}

interface D1Binding {
  ref: string;
  type: string;
}

interface CloudflareEnv {
  DB: D1Database;
  SESSION_SECRET?: string;
}

/**
 * Get the PrismaClient instance.
 * - On Cloudflare Pages: uses D1 binding via @cloudflare/next-on-pages getRequestContext()
 * - On local dev: uses regular SQLite PrismaClient
 */
export async function db(): Promise<PrismaClient> {
  if (cachedClient) return cachedClient;

  // Try Cloudflare D1 context (production)
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages');
    const ctx = getRequestContext() as { env: CloudflareEnv; ctx: any; cf: any };
    if (ctx?.env?.DB) {
      // Use dynamic import to avoid bundling issues
      const { PrismaD1 } = await import('@prisma/adapter-d1');
      const adapter = new PrismaD1(ctx.env.DB);
      cachedClient = new PrismaClient({ adapter } as any);
      return cachedClient;
    }
  } catch (e) {
    // Not on Cloudflare, fall through to local dev
    console.log('[db] Not on Cloudflare, using local SQLite');
  }

  // Local dev: regular SQLite PrismaClient
  cachedClient = new PrismaClient();
  return cachedClient;
}

// Reset cached client (useful for tests / hot reload)
export function resetDb() {
  cachedClient = null;
}

// Legacy export for backward compatibility (works only in local dev)
export const dbLegacy: any = new Proxy({} as any, {
  get(_target: any, prop: string) {
    console.warn(`[db] Direct db.${prop} access is deprecated. Use async db() instead.`);
    return undefined;
  },
});
