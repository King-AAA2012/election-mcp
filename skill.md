---
name: election-mcp
version: 0.1.0
description: A standalone MCP server for Indian Election Commission data: Lok Sabha results, voter ID checks, and candidate/MP lookups.
author: King-AAA2012
license: MIT
---

# election-mcp â€” Skill

A single MCP (Model Context Protocol) server for Indian data. It lets Claude
Desktop, Claude Code, Cline, or any other MCP client call tools backed by real
Indian data.


## Requirements
- **Node.js 18+
No API key is required.

## How to Install / Run

```bash
npm install
node server.js      # boots the MCP server over stdio
```

### Register with an MCP client

Add a server entry to your MCP client config JSON:

```json
{
  "mcpServers": {
    "election-mcp": {
      "command": "node",
      "args": ["C:/Users/Aditya Shah/Desktop/Code/election-mcp/server.js"]
    }
  }
}
```

## How to Verify (Tests)

```bash
npm test
```

## Selling / Redistributing

This skill is provided under MIT, so it may be sold or redistributed. Ship it
as its own zip (election-mcp-0.1.0.zip) in the packages/ folder alongside the other
india-mcp packages.

