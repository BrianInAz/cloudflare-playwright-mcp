# Cloudflare Playwright MCP Server

A production-ready Cloudflare Workers deployment of the Playwright MCP (Model Context Protocol) server that provides browser automation capabilities to AI agents using Cloudflare's Browser Rendering service.

## 🚀 Live Deployment

**Production URL**: https://playwright-mcp-bjzy.bjzy.workers.dev  
**MCP Endpoint**: https://playwright-mcp-bjzy.bjzy.workers.dev/mcp  
**Legacy SSE Endpoint**: https://playwright-mcp-bjzy.bjzy.workers.dev/sse (not recommended due to timeout issues)

## ✨ Features

- **Fast & Lightweight**: Uses Playwright's accessibility tree, not pixel-based input
- **LLM-Friendly**: No vision models needed, operates purely on structured data  
- **Deterministic**: Avoids ambiguity common with screenshot-based approaches
- **Serverless**: Runs on Cloudflare Workers with global edge deployment
- **Persistent Sessions**: Durable Objects maintain browser state across requests

## 🏗️ Architecture

- **Cloudflare Workers**: Serverless runtime for the MCP server
- **Browser Rendering**: Provides headless browser capabilities  
- **Durable Objects**: Manages browser sessions and state
- **MCP Protocol**: Enables communication with AI agents

## 🔧 Quick Usage

### Cloudflare AI Playground
1. Go to: https://playground.ai.cloudflare.com/
2. Set model to: `llama-3.3-70b-instruct-fp8-fast`
3. MCP Server URL: `https://playwright-mcp-bjzy.bjzy.workers.dev/mcp`
4. Connect and enjoy the full suite of browser automation tools!

> **Note**: Use `/mcp` endpoint for reliable HTTP transport. The `/sse` endpoint may experience connection timeouts due to Cloudflare Workers' execution limits.

### Example Commands
```
"Go to demo.playwright.dev/todomvc"
"Create some todo entry"  
"Create a todo in pirate style"
"Take a screenshot"
```

## 📚 Documentation

- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)**: Complete setup and deployment instructions
- **[Cloudflare Docs](https://developers.cloudflare.com/browser-rendering/platform/playwright-mcp/)**: Official documentation

## 🔄 Development Workflow

This repository follows **GitFlow**:

- **`main`**: Production releases only
- **`develop`**: Default branch for development  
- **`feature/*`**: New features (branch from `develop`)
- **`bugfix/*`**: Bug fixes (branch from `develop`)

### Local Development

```bash
# Clone and setup
git clone https://github.com/BrianInAz/cloudflare-playwright-mcp.git
cd cloudflare-playwright-mcp
npm install

# Create feature branch
git checkout develop
git checkout -b feature/my-new-feature

# Deploy to Cloudflare
npm run deploy
```

## 📝 Requirements

- Node.js 18+
- Cloudflare account with Workers access
- Wrangler CLI

## 🏷️ Versioning

This project uses semantic versioning. Check [releases](../../releases) for version history.

## 📄 License

Apache-2.0 - See [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Create feature branch from `develop`
2. Make your changes
3. Test deployment
4. Submit pull request to `develop`

---

**Deployed with ❤️ on Cloudflare Workers**
