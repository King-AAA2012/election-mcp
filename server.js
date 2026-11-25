#!/usr/bin/env node
// server.js
//
// Standalone MCP server exposing Indian Election Commission data.
// Tools:
//   - election_results : filter Lok Sabha results by year and/or state
//   - voter_lookup     : validate a voter ID / find an election office
//   - candidate_search : search candidates by name or constituency
//
// Data is STATIC SAMPLE DATA (see lib/election.js). It is fabricated for
// demonstration and is NOT real ECI data.

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  electionResults,
  voterLookup,
  candidateSearch,
} from "./lib/election.js";

const TOOLS = [
  {
    name: "election_results",
    description:
      "Search Indian Lok Sabha (parliament) election results by year (2014, 2019 or 2024) and/or state. Returns constituency, winning party, winning candidate, votes, and the runner-up for each matching seat. Data is sample data.",
    inputSchema: {
      type: "object",
      properties: {
        year: {
          type: "string",
          description: "Election year: 2014, 2019 or 2024 (Lok Sabha).",
        },
        state: {
          type: "string",
          description:
            "Indian state, e.g. Maharashtra, Karnataka or Tamil Nadu.",
        },
      },
      required: [],
    },
  },
  {
    name: "voter_lookup",
    description:
      "Validate a voter ID card number and/or look up the state Election Commission office. The standard voter ID format is 3 uppercase letters followed by 8 digits (e.g. ABC1234567). Sample voter records are only returned for the few IDs in the demo dataset.",
    inputSchema: {
      type: "object",
      properties: {
        cardNumber: {
          type: "string",
          description: "Voter ID card number, e.g. ABC1234567.",
        },
        state: {
          type: "string",
          description: "State to look up the Election Commission office for.",
        },
      },
      required: [],
    },
  },
  {
    name: "candidate_search",
    description:
      "Search Lok Sabha candidates / MPs by name or by constituency. Returns the year, constituency, winning party and votes for every matching seat in the sample data.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Candidate or MP name (partial match).",
        },
        constituency: {
          type: "string",
          description: "Constituency name (partial match).",
        },
      },
      required: [],
    },
  },
];

const server = new Server(
  { name: "election-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const wrap = (ok, content) => ({
    content: [{ type: "text", text: JSON.stringify(ok, null, 2) }],
  });

  if (name === "election_results") {
    return wrap(true, [
      { type: "text", text: JSON.stringify(electionResults(args ?? {}), null, 2) },
    ]);
  }

  if (name === "voter_lookup") {
    return wrap(true, [
      { type: "text", text: JSON.stringify(voterLookup(args ?? {}), null, 2) },
    ]);
  }

  if (name === "candidate_search") {
    return wrap(true, [
      { type: "text", text: JSON.stringify(candidateSearch(args ?? {}), null, 2) },
    ]);
  }

  return {
    content: [{ type: "text", text: `Unknown tool: ${name}` }],
    isError: true,
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("election-mcp server running on stdio");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
