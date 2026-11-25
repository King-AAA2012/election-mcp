// scripts/test.mjs
//
// Exercises every tool's data layer and confirms the server boots over stdio.
// Run with: node scripts/test.mjs

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

import { electionResults, voterLookup, candidateSearch } from "../lib/election.js";

let passed = 0;
function ok(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (error) {
    console.error(`  ✗ ${name}\n    ${error.message}`);
    passed--;
  }
}

async function okAsync(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (error) {
    console.error(`  ✗ ${name}\n    ${error.message}`);
    passed--;
  }
}

// ---------------------------------------------------------------------------
// Unit tests for the pure data layer
// ---------------------------------------------------------------------------
console.log("Data layer:");

ok("election_results filters by year", () => {
  const r = electionResults({ year: "2024" });
  assert.ok(r.count > 0, "expected results for 2024");
  assert.ok(r.results.every((s) => s.year === "2024"), "all rows are 2024");
  assert.ok(
    r.results[0].winnerName && r.results[0].winnerParty,
    "rows have winner name and party",
  );
});

ok("election_results filters by state", () => {
  const r = electionResults({ state: "Tamil Nadu" });
  assert.ok(r.count > 0, "expected results for Tamil Nadu");
  assert.ok(
    r.results.every((s) => s.state === "Tamil Nadu"),
    "all rows are Tamil Nadu",
  );
});

ok("election_results requires year or state", () => {
  const r = electionResults({});
  assert.equal(r.count, 0);
});

ok("voter_lookup rejects a malformed card number", () => {
  const r = voterLookup({ cardNumber: "123" });
  assert.equal(r.valid, false);
  assert.equal(r.ok, false);
});

ok("voter_lookup accepts a well-formed card number", () => {
  const r = voterLookup({ cardNumber: "ABC12345670" });
  assert.equal(r.valid, true);
  assert.ok(r.message.includes("Format OK") || !!r.voter);
});

ok("voter_lookup finds a known voter", () => {
  const r = voterLookup({ cardNumber: "ABC12345670" });
  assert.equal(r.voter?.name, "Anaya Sharma");
});

ok("voter_lookup finds an election office by state", () => {
  const r = voterLookup({ state: "Maharashtra" });
  assert.ok(
    r.message.includes("Maharashtra"),
    "message mentions Maharashtra",
  );
});

ok("candidate_search by name", () => {
  const r = candidateSearch({ name: "R Venkataraman" });
  assert.ok(r.count > 0, "expected matches for the name");
});

ok("candidate_search by constituency", () => {
  const r = candidateSearch({ constituency: "Chennai Central" });
  assert.ok(r.count > 0, "expected matches for Chennai Central");
});

ok("candidate_search requires a query", () => {
  const r = candidateSearch({});
  assert.equal(r.count, 0);
});

// ---------------------------------------------------------------------------
// Integration test: boot the server over stdio
// ---------------------------------------------------------------------------
console.log("Server integration:");

await okAsync("server boots and announces on stdio", async () => {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["server.js"], {
      cwd: fileURLToPath(new URL("..", import.meta.url)),
      stdio: ["pipe", "pipe", "pipe"],
    });
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error("server did not boot in time"));
    }, 5000);
    child.stderr.on("data", (d) => {
      if (d.toString().includes("election-mcp server running on stdio")) {
        clearTimeout(timer);
        child.kill();
        resolve();
      }
    });
    child.on("error", reject);
  });
});

// ---------------------------------------------------------------------------
console.log(`\n${passed} passed.`);
