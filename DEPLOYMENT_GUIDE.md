# Cloudflare Playwright MCP Server Deployment Guide

## Overview

This document describes the complete setup and deployment of a Cloudflare Playwright MCP (Model Context Protocol) server that provides browser automation capabilities to AI agents using Cloudflare's Browser Rendering service.

## What is Playwright MCP?

[`@cloudflare/playwright-mcp`](https://github.com/cloudflare/playwright-mcp) is a Playwright MCP server fork that provides browser automation capabilities using Playwright and Browser Rendering. Key features:

- **Fast and lightweight**: Uses Playwright's accessibility tree, not pixel-based input
- **LLM-friendly**: No vision models needed, operates purely on structured data  
- **Deterministic**: Avoids ambiguity common with screenshot-based approaches
- **Serverless**: Runs on Cloudflare Workers with global edge deployment

## Prerequisites

- Node.js 18+ installed
- Cloudflare account with Workers access
- Wrangler CLI (installed via npm)
- Git (for repository management)

## Deployment Steps

### 1. Authentication Setup

First, authenticate with Cloudflare:

```bash
npx wrangler login
```

This opens a browser window for OAuth authentication. After successful login, verify with:

```bash
npx wrangler whoami
```

### 2. Project Setup

Clone the official Cloudflare Playwright MCP repository:

```bash
git clone https://github.com/cloudflare/playwright-mcp.git
cd playwright-mcp/cloudflare/example
```

### 3. Configuration

The project includes a pre-configured `wrangler.toml`:

```toml
name = "playwright-mcp-bjzy"
main = "src/index.ts"
compatibility_date = "2025-03-10"
compatibility_flags = ["nodejs_compat"]

[browser]
binding = "BROWSER"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["PlaywrightMCP"]

[[durable_objects.bindings]]
name = "MCP_OBJECT"
class_name = "PlaywrightMCP"
```

**Key Configuration Elements:**
- `browser.binding`: Provides access to Cloudflare's Browser Rendering
- `durable_objects`: Manages browser sessions and state persistence
- `nodejs_compat`: Enables Node.js compatibility for Playwright

### 4. Dependencies Installation

```bash
npm install
```

This installs:
- `@cloudflare/playwright-mcp`: The MCP server implementation
- `wrangler`: Cloudflare Workers CLI
- `typescript`: For TypeScript compilation
- `@types/node`: Node.js type definitions

### 5. Source Code Structure

The main entry point (`src/index.ts`):

```typescript
import { env } from 'cloudflare:workers';
import { createMcpAgent } from '@cloudflare/playwright-mcp';

export const PlaywrightMCP = createMcpAgent(env.BROWSER);

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const { pathname } = new URL(request.url);

    switch (pathname) {
      case '/sse':
      case '/sse/message':
        return PlaywrightMCP.serveSSE('/sse').fetch(request, env, ctx);
      case '/mcp':
        return PlaywrightMCP.serve('/mcp').fetch(request, env, ctx);
      default:
        return new Response('Not Found', { status: 404 });
    }
  },
};
```

**Endpoint Structure:**
- `/sse`: Server-Sent Events endpoint for real-time communication
- `/mcp`: Standard MCP protocol endpoint
- Default: 404 for other paths

### 6. Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

## Deployment Results

### Successful Deployment Output:
```
✅ Worker Deployed Successfully!
URL: https://playwright-mcp-bjzy.bjzy.workers.dev
MCP Endpoint: https://playwright-mcp-bjzy.bjzy.workers.dev/sse
```

### Available Resources:
- **Browser Rendering**: Full headless browser capabilities
- **Durable Objects**: Persistent browser session management
- **23 MCP Tools**: Complete Playwright automation toolkit

## Usage Instructions

### Option 1: Cloudflare AI Playground (Recommended)

1. Navigate to: https://playground.ai.cloudflare.com/
2. Set model to: `llama-3.3-70b-instruct-fp8-fast`
3. In **MCP Servers** section:
   - **URL**: `https://playwright-mcp-bjzy.bjzy.workers.dev/sse`
   - Click **Connect**
4. Verify connection shows "Connected" with 23 available tools

### Option 2: Claude Desktop Integration

Add to Claude Desktop MCP configuration file:

```json
{
  "mcpServers": {
    "playwright-mcp-cloudflare": {
      "command": "npx",
      "args": ["@cloudflare/playwright-mcp"],
      "env": {
        "MCP_SERVER_URL": "https://playwright-mcp-bjzy.bjzy.workers.dev/sse"
      }
    }
  }
}
```

## Example Usage Scenarios

### Basic Web Automation Sequence:
1. **"Go to demo.playwright.dev/todomvc"**
2. **"Create some todo entry"**  
3. **"Create a todo in pirate style"**
4. **"Create another todo in Yoda style"**
5. **"Take a screenshot"**

### Advanced Use Cases:
- **Form Automation**: Fill out complex web forms
- **Data Extraction**: Scrape structured data from websites  
- **UI Testing**: Automated testing of web applications
- **Content Generation**: Create content based on web interactions
- **Monitoring**: Automated website monitoring and reporting

## Architecture Details

### Cloudflare Workers Runtime:
- **Global Edge Deployment**: Low latency worldwide
- **Serverless Execution**: No server management required
- **Automatic Scaling**: Handles traffic spikes seamlessly

### Browser Rendering Service:
- **Chromium-based**: Full modern browser capabilities
- **Headless Operation**: Optimized for automation
- **Integrated**: Native integration with Workers runtime

### Durable Objects:
- **Session Persistence**: Maintains browser state across requests
- **Geographic Distribution**: Data locality for performance
- **Consistency**: Strong consistency guarantees

## Security Considerations

- **Sandboxed Execution**: Browser runs in isolated environment
- **No Persistent Storage**: Session data automatically cleaned up
- **Rate Limiting**: Built-in protection against abuse
- **HTTPS Only**: All communication encrypted in transit

## Monitoring and Maintenance

### Cloudflare Dashboard:
- **Analytics**: Request volume, response times, errors
- **Logs**: Real-time worker execution logs
- **Metrics**: Performance and usage statistics

### Version Management:
```bash
# Deploy new version
npm run deploy

# Rollback if needed
npx wrangler rollback [version-id]
```

## Troubleshooting

### Common Issues:

1. **Authentication Errors**:
   ```bash
   npx wrangler whoami  # Verify login status
   npx wrangler login   # Re-authenticate if needed
   ```

2. **Deployment Failures**:
   - Check `wrangler.toml` syntax
   - Verify account permissions
   - Ensure unique worker name

3. **Runtime Errors**:
   - Check worker logs in Cloudflare dashboard
   - Verify browser binding configuration
   - Test with simple commands first

### Getting Help:
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Playwright MCP GitHub Repository](https://github.com/cloudflare/playwright-mcp)
- [Browser Rendering Documentation](https://developers.cloudflare.com/browser-rendering/)

## Cost Considerations

### Cloudflare Workers Pricing:
- **Free Tier**: 100,000 requests/day
- **Paid Plans**: $5/month for 10M requests
- **Browser Rendering**: Additional usage-based charges

### Optimization Tips:
- Use session persistence to minimize browser startup costs
- Implement request batching for multiple operations
- Monitor usage through Cloudflare dashboard

## Conclusion

This deployment provides a production-ready, globally distributed browser automation service that integrates seamlessly with AI agents through the MCP protocol. The serverless architecture ensures reliability, scalability, and cost-effectiveness while providing full Playwright capabilities.

---

**Deployed Service**: https://playwright-mcp-bjzy.bjzy.workers.dev/sse
**Documentation**: This guide
**Support**: Cloudflare Workers community and documentation