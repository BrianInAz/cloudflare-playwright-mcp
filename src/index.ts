import { env } from 'cloudflare:workers';

import { createMcpAgent } from '@cloudflare/playwright-mcp';

export const PlaywrightMCP = createMcpAgent(env.BROWSER);

// Track worker start time to detect cold starts
const workerStartTime = Date.now();

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const requestStartTime = Date.now();
    const { pathname }  = new URL(request.url);
    
    // Log request details
    console.log({
      timestamp: new Date().toISOString(),
      path: pathname,
      method: request.method,
      workerAge: requestStartTime - workerStartTime,
      coldStart: requestStartTime - workerStartTime < 100, // Likely cold if worker started very recently
    });

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
