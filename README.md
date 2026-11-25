# election-mcp

A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server for **Indian Election Commission (ECI) data**. It lets Claude Code, Claude Desktop, Cline, and any other MCP client query Lok Sabha election results, validate voter IDs, and search candidates — all from a self-contained, static sample dataset. No API key or network access is required.

## What it does

Three tools:

- **`election_results`** — search Lok Sabha (parliament) results by year (2014, 2019 or 2024) and/or state. Returns the constituency, winning party, winning candidate, votes, and the runner-up for each matching seat.
- **`voter_lookup`** — validate a voter ID card number and/or find the state Election Commission office.
- **`candidate_search`** — search candidates / MPs by name or by constituency.

> **Data is sample data.** The constituencies, candidates, parties and vote counts in this package are plausible but **fabricated for demonstration**. They are **not** real Election Commission of India results. For authoritative results, see https://eci.gov.in

## Quick start

Requires **Node.js 18+** (uses the built-in global `fetch`). No API key is needed.

```bash
# from the monorepo root
npm install          # installs @modelcontextprotocol/sdk
npm run test --workspace election-mcp   # run the tests
```

Run the server directly (stdio transport):

```bash
node server.js
```

## MCP client configuration

Add it to your MCP client's configuration as a stdio server:

```json
{
  "mcpServers": {
    "election": {
      "command": "node",
      "args": ["/absolute/path/to/india-mcp/election-mcp/server.js"]
    }
  }
}
```

Or, from inside the package folder:

```json
{
  "mcpServers": {
    "election": {
      "command": "node",
      "args": ["server.js"]
    }
  }
}
```

## Tool examples

**`election_results`** — arguments:

| argument | type | required | description |
| --- | --- | --- | --- |
| `year` | string | no | Election year: `2014`, `2019` or `2024` (Lok Sabha) |
| `state` | string | no | Indian state, e.g. `Maharashtra`, `Karnataka`, `Tamil Nadu` |

Example call:

```json
{ "name": "election_results", "arguments": { "state": "Karnataka", "year": "2024" } }
```

Example response (trimmed):

```json
{
  "ok": true,
  "results": [
    {
      "constituency": "Bengaluru North",
      "state": "Karnataka",
      "year": "2024",
      "winnerName": "Anusha Kumar",
      "winnerParty": "Bharatiya Janata Party",
      "winnerVotes": 234560,
      "runnerUpName": "Prakash Hampe",
      "runnerUpParty": "Indian National Congress",
      "runnerUpVotes": 210880
    }
  ],
  "count": 1,
  "note": "year=2024 & state=Karnataka"
}
```

**`voter_lookup`** — arguments:

| argument | type | required | description |
| --- | --- | --- | --- |
| `cardNumber` | string | no | Voter ID, e.g. `ABC1234567` (3 letters + 8 digits) |
| `state` | string | no | State to look up the Election Commission office for |

Example call:

```json
{ "name": "voter_lookup", "arguments": { "cardNumber": "ABC1234567" } }
```

A malformed card number is rejected locally:

```json
{ "name": "voter_lookup", "arguments": { "cardNumber": "123" } }
```

```json
{ "ok": false, "valid": false, "message": "Invalid voter ID format. Expected 3 uppercase letters followed by 8 digits (e.g. ABC1234567)." }
```

**`candidate_search`** — arguments:

| argument | type | required | description |
| --- | --- | --- | --- |
| `name` | string | no | Candidate / MP name (partial match) |
| `constituency` | string | no | Constituency name (partial match) |

Example call:

```json
{ "name": "candidate_search", "arguments": { "constituency": "Chennai Central" } }
```

## Data source

There is **no external data source** — this package ships with a bundled, static sample dataset (`lib/election.js`) covering Lok Sabha results for **Maharashtra**, **Karnataka** and **Tamil Nadu** across the **2014**, **2019** and **2024** general elections (5–7 constituencies each).

The data is intentionally fabricated and labeled as sample data. Do not use it for any real electoral decision-making. For official results, refer to the [Election Commission of India](https://eci.gov.in).

## Scripts

| script | description |
| --- | --- |
| `npm start` | run the server (`node server.js`) |
| `npm run dev` | run the server (`node server.js`) |
| `npm test` | run the tests (`node scripts/test.mjs`) |

## License

[MIT](./LICENSE)
