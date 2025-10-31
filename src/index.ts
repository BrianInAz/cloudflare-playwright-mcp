import { env } from 'cloudflare:workers';

import { createMcpAgent } from '@cloudflare/playwright-mcp';

export const PlaywrightMCP = createMcpAgent(env.BROWSER);

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const { pathname }  = new URL(request.url);

    switch (pathname) {
      case '/':
      case '/mcp':
        // Use HTTP transport instead of SSE for better Workers compatibility
        return PlaywrightMCP.serve('/mcp').fetch(request, env, ctx);
      case '/sse':
      case '/sse/message':
        // Legacy SSE endpoint - not recommended for Workers due to connection timeout issues
        return PlaywrightMCP.serveSSE('/sse').fetch(request, env, ctx);
      default:
        return new Response('Not Found', { status: 404 });
    }
  },
};
