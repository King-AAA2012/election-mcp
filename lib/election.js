// lib/election.js
//
// Static sample data + query logic for the election-mcp MCP server.
//
// IMPORTANT: This is SAMPLE DATA generated for demonstration purposes.
// It is NOT real Election Commission of India (ECI) data. Names, parties,
// vote counts and constituencies are plausible but fabricated. Do not use
// this for any real electoral decision-making. For authoritative results,
// see https://eci.gov.in

/**
 * @typedef {Object} LokSabhaSeat
 * @property {string} constituency  e.g. "Mumbai North"
 * @property {string} state
 * @property {string} year          "2014" | "2019" | "2024"
 * @property {string} winnerName
 * @property {string} winnerParty
 * @property {number} winnerVotes
 * @property {string} runnerUpName
 * @property {string} runnerUpParty
 * @property {number} runnerUpVotes
 */

// Sample Lok Sabha results. Each state has 5-7 constituencies across the
// 2014, 2019 and 2024 general elections. The data is deliberately varied
// so that year/state filtering and name/constituency searches return
// interesting, non-empty results.
const DATA = [
  // ---------------- Maharashtra ----------------
  { constituency: "Mumbai North", state: "Maharashtra", year: "2014", winnerName: "Rajesh Deshmukh", winnerParty: "Indian National Congress", winnerVotes: 218450, runnerUpName: "Sanjay Raut", runnerUpParty: "Shiv Sena", runnerUpVotes: 195230 },
  { constituency: "Mumbai North", state: "Maharashtra", year: "2019", winnerName: "Bharati Gawde", winnerParty: "Indian National Congress", winnerVotes: 227310, runnerUpName: "Rajesh Deshmukh", runnerUpParty: "Shiv Sena", runnerUpVotes: 201880 },
  { constituency: "Mumbai North", state: "Maharashtra", year: "2024", winnerName: "Kiran Shetty", winnerParty: "Bharatiya Janata Party", winnerVotes: 236700, runnerUpName: "Bharati Gawde", runnerUpParty: "Indian National Congress", runnerUpVotes: 209150 },
  { constituency: "Mumbai Suburban", state: "Maharashtra", year: "2014", winnerName: "Rajen Takle", winnerParty: "Indian National Congress", winnerVotes: 205120, runnerUpName: "Sunil Tatkare", runnerUpParty: "Bharatiya Janata Party", runnerUpVotes: 198760 },
  { constituency: "Mumbai Suburban", state: "Maharashtra", year: "2019", winnerName: "Sunil Tatkare", winnerParty: "Bharatiya Janata Party", winnerVotes: 230440, runnerUpName: "Rajen Takle", runnerUpParty: "Indian National Congress", runnerUpVotes: 215330 },
  { constituency: "Mumbai Suburban", state: "Maharashtra", year: "2024", winnerName: "Sunil Tatkare", winnerParty: "Bharatiya Janata Party", winnerVotes: 241090, runnerUpName: "Nilesh Ralhe", runnerUpParty: "Indian National Congress", runnerUpVotes: 218660 },
  { constituency: "Pune", state: "Maharashtra", year: "2014", winnerName: "Rahul Naik", winnerParty: "Bharatiya Janata Party", winnerVotes: 222800, runnerUpName: "Prakash Ambedkar", runnerUpParty: "Bahujan Samaja Party", runnerUpVotes: 176540 },
  { constituency: "Pune", state: "Maharashtra", year: "2019", winnerName: "Rahul Naik", winnerParty: "Bharatiya Janata Party", winnerVotes: 248900, runnerUpName: "Prakash Ambedkar", runnerUpParty: "Bahujan Samaja Party", runnerUpVotes: 188210 },
  { constituency: "Pune", state: "Maharashtra", year: "2024", winnerName: "Rahul Naik", winnerParty: "Bharatiya Janata Party", winnerVotes: 259340, runnerUpName: "Snehal Apte", runnerUpParty: "Indian National Congress", runnerUpVotes: 205470 },
  { constituency: "Nagpur", state: "Maharashtra", year: "2014", winnerName: "Nitesh Rane", winnerParty: "Bharatiya Janata Party", winnerVotes: 211500, runnerUpName: "Anil Deshmukh", runnerUpParty: "Indian National Congress", runnerUpVotes: 190330 },
  { constituency: "Nagpur", state: "Maharashtra", year: "2019", winnerName: "Nitesh Rane", winnerParty: "Bharatiya Janata Party", winnerVotes: 233670, runnerUpName: "Anil Deshmukh", runnerUpParty: "Indian National Congress", runnerUpVotes: 201450 },
  { constituency: "Nagpur", state: "Maharashtra", year: "2024", winnerName: "Nitesh Rane", winnerParty: "Bharatiya Janata Party", winnerVotes: 245210, runnerUpName: "Meera Jadhav", runnerUpParty: "Indian National Congress", runnerUpVotes: 210880 },
  { constituency: "Nashik", state: "Maharashtra", year: "2014", winnerName: "Sanjay Samant", winnerParty: "Bharatiya Janata Party", winnerVotes: 206780, runnerUpName: "Vijay Wadettiwar", runnerUpParty: "Indian National Congress", runnerUpVotes: 184220 },
  { constituency: "Nashik", state: "Maharashtra", year: "2019", winnerName: "Sanjay Samant", winnerParty: "Bharatiya Janata Party", winnerVotes: 229440, runnerUpName: "Vijay Wadettiwar", runnerUpParty: "Indian National Congress", runnerUpVotes: 197660 },
  { constituency: "Nashik", state: "Maharashtra", year: "2024", winnerName: "Sanjay Samant", winnerParty: "Bharatiya Janata Party", winnerVotes: 240110, runnerUpName: "Aarti Modasiya", runnerUpParty: "Indian National Congress", runnerUpVotes: 206330 },

  // ---------------- Karnataka ----------------
  { constituency: "Bengaluru North", state: "Karnataka", year: "2014", winnerName: "Prakash Hampe", winnerParty: "Indian National Congress", winnerVotes: 198760, runnerUpName: "Girish Karumbaiah", runnerUpParty: "Bharatiya Janata Party", runnerUpVotes: 176540 },
  { constituency: "Bengaluru North", state: "Karnataka", year: "2019", winnerName: "Prakash Hampe", winnerParty: "Indian National Congress", winnerVotes: 221340, runnerUpName: "Girish Karumbaiah", runnerUpParty: "Bharatiya Janata Party", runnerUpVotes: 205120 },
  { constituency: "Bengaluru North", state: "Karnataka", year: "2024", winnerName: "Anusha Kumar", winnerParty: "Bharatiya Janata Party", winnerVotes: 234560, runnerUpName: "Prakash Hampe", runnerUpParty: "Indian National Congress", runnerUpVotes: 210880 },
  { constituency: "Bengaluru South", state: "Karnataka", year: "2014", winnerName: "Dinesh Gundu Rao", winnerParty: "Bharatiya Janata Party", winnerVotes: 207890, runnerUpName: "Niren Prasad", runnerUpParty: "Indian National Congress", runnerUpVotes: 188900 },
  { constituency: "Bengaluru South", state: "Karnataka", year: "2019", winnerName: "Dinesh Gundu Rao", winnerParty: "Bharatiya Janata Party", winnerVotes: 230110, runnerUpName: "Niren Prasad", runnerUpParty: "Indian National Congress", runnerUpVotes: 201450 },
  { constituency: "Bengaluru South", state: "Karnataka", year: "2024", winnerName: "Dinesh Gundu Rao", winnerParty: "Bharatiya Janata Party", winnerVotes: 242780, runnerUpName: "Sudha Rajasekaran", runnerUpParty: "Indian National Congress", runnerUpVotes: 213220 },
  { constituency: "Mysuru", state: "Karnataka", year: "2014", winnerName: "Prakash Shetty", winnerParty: "Bharatiya Janata Party", winnerVotes: 195430, runnerUpName: "Ramesh Jabbasi", runnerUpParty: "Indian National Congress", runnerUpVotes: 178660 },
  { constituency: "Mysuru", state: "Karnataka", year: "2019", winnerName: "Ramesh Jabbasi", winnerParty: "Indian National Congress", winnerVotes: 218900, runnerUpName: "Prakash Shetty", runnerUpParty: "Bharatiya Janata Party", runnerUpVotes: 201230 },
  { constituency: "Mysuru", state: "Karnataka", year: "2024", winnerName: "Ramesh Jabbasi", winnerParty: "Indian National Congress", winnerVotes: 231560, runnerUpName: "Kavitha Rao", runnerUpParty: "Bharatiya Janata Party", runnerUpVotes: 208770 },
  { constituency: "Hubballi-Dharwad", state: "Karnataka", year: "2014", winnerName: "H D Kumaraswamy", winnerParty: "Janata Dal (Secular)", winnerVotes: 203450, runnerUpName: "D V Sadananda Gowda", runnerUpParty: "Bharatiya Janata Party", runnerUpVotes: 190110 },
  { constituency: "Hubballi-Dharwad", state: "Karnataka", year: "2019", winnerName: "H D Kumaraswamy", winnerParty: "Janata Dal (Secular)", winnerVotes: 226780, runnerUpName: "D V Sadananda Gowda", runnerUpParty: "Bharatiya Janata Party", runnerUpVotes: 205440 },
  { constituency: "Hubballi-Dharwad", state: "Karnataka", year: "2024", winnerName: "D V Sadananda Gowda", winnerParty: "Bharatiya Janata Party", winnerVotes: 238900, runnerUpName: "Ganesh Jakkihalli", runnerUpParty: "Janata Dal (Secular)", runnerUpVotes: 210660 },

  // ---------------- Tamil Nadu ----------------
  { constituency: "Chennai Central", state: "Tamil Nadu", year: "2014", winnerName: "Ramesh Kumar", winnerParty: "Indian National Congress", winnerVotes: 189670, runnerUpName: "R Venkataraman", runnerUpParty: "Bharatiya Janata Party", runnerUpVotes: 172340 },
  { constituency: "Chennai Central", state: "Tamil Nadu", year: "2019", winnerName: "R Venkataraman", winnerParty: "Bharatiya Janata Party", winnerVotes: 210230, runnerUpName: "Sudhakar Raj", runnerUpParty: "Indian National Congress", runnerUpVotes: 195440 },
  { constituency: "Chennai Central", state: "Tamil Nadu", year: "2024", winnerName: "R Venkataraman", winnerParty: "Bharatiya Janata Party", winnerVotes: 223560, runnerUpName: "Sudhakar Raj", runnerUpParty: "Indian National Congress", runnerUpVotes: 204770 },
  { constituency: "Chennai South", state: "Tamil Nadu", year: "2014", winnerName: "Sudhakar Raj", winnerParty: "Dravida Munetra Kazhagam", winnerVotes: 196780, runnerUpName: "Kavitha Sundaram", runnerUpParty: "Bharatiya Janata Party", runnerUpVotes: 178900 },
  { constituency: "Chennai South", state: "Tamil Nadu", year: "2019", winnerName: "Kavitha Sundaram", winnerParty: "Dravida Munetra Kazhagam", winnerVotes: 218900, runnerUpName: "Sudhakar Raj", runnerUpParty: "Indian National Congress", runnerUpVotes: 198660 },
  { constituency: "Chennai South", state: "Tamil Nadu", year: "2024", winnerName: "Kavitha Sundaram", winnerParty: "Dravida Munetra Kazhagam", winnerVotes: 231230, runnerUpName: "Meena Krishnan", runnerUpParty: "Bharatiya Janata Party", runnerUpVotes: 208990 },
  { constituency: "Madurai", state: "Tamil Nadu", year: "2014", winnerName: "Ramesh Balakrishnan", winnerParty: "Dravida Munetra Kazhagam", winnerVotes: 192340, runnerUpName: "Sivakumar Rajan", runnerUpParty: "Bharatiya Janata Party", runnerUpVotes: 176540 },
  { constituency: "Madurai", state: "Tamil Nadu", year: "2019", winnerName: "Sivakumar Rajan", winnerParty: "All India Anna Dravida Munetra Kazhagam", winnerVotes: 214560, runnerUpName: "Ramesh Balakrishnan", runnerUpParty: "Dravida Munetra Kazhagam", runnerUpVotes: 201230 },
  { constituency: "Madurai", state: "Tamil Nadu", year: "2024", winnerName: "Ramesh Balakrishnan", winnerParty: "Dravida Munetra Kazhagam", winnerVotes: 227890, runnerUpName: "Poongavanam", runnerUpParty: "All India Anna Dravida Munetra Kazhagam", runnerUpVotes: 206660 },
  { constituency: "Coimbatore", state: "Tamil Nadu", year: "2014", winnerName: "Kavitha Periasamy", winnerParty: "Bharatiya Janata Party", winnerVotes: 198900, runnerUpName: "Sudhakar Chettiar", runnerUpParty: "Dravida Munetra Kazhagam", runnerUpVotes: 184220 },
  { constituency: "Coimbatore", state: "Tamil Nadu", year: "2019", winnerName: "Kavitha Periasamy", winnerParty: "Bharatiya Janata Party", winnerVotes: 221340, runnerUpName: "Sudhakar Chettiar", runnerUpParty: "Dravida Munetra Kazhagam", runnerUpVotes: 201450 },
  { constituency: "Coimbatore", state: "Tamil Nadu", year: "2024", winnerName: "Kavitha Periasamy", winnerParty: "Bharatiya Janata Party", winnerVotes: 234560, runnerUpName: "Meera Vasudevan", runnerUpParty: "Dravida Munetra Kazhagam", runnerUpVotes: 210880 },
];

// A few sample voter registration records used by voter_lookup.
const VOTERS = [
  { cardNumber: "ABC12345670", name: "Anaya Sharma", state: "Maharashtra", assemblyConstituency: "Pune", status: "Active" },
  { cardNumber: "XYZ76543210", name: "Vikram Reddy", state: "Karnataka", assemblyConstituency: "Bengaluru North", status: "Active" },
  { cardNumber: "DEF55678900", name: "Meera Nair", state: "Tamil Nadu", assemblyConstituency: "Chennai South", status: "Active" },
  { cardNumber: "GHI99012340", name: "Rohan Mehta", state: "Maharashtra", assemblyConstituency: "Mumbai Suburban", status: "Suspended" },
];

// Sample Election Commission regional offices by state.
const OFFICES = {
  Maharashtra: { office: "State Election Office, Mumbai", address: "12, C.S.T. Road, Mumbai 400001", phone: "+91 22 2266 1190" },
  Karnataka: { office: "State Election Office, Bengaluru", address: "Secretariat Block, Bengaluru 560001", phone: "+91 80 2296 4100" },
  TamilNadu: { office: "State Election Office, Chennai", address: "36, Ripon Road, Chennai 600002", phone: "+91 44 2535 1600" },
};

/**
 * Normalize a year argument to a 4-digit string.
 * @param {string} year
 * @returns {string|null}
 */
function normalizeYear(year) {
  if (typeof year !== "string") return null;
  const trimmed = year.trim();
  if (!/^\d{4}$/.test(trimmed)) return null;
  const n = Number(trimmed);
  if (![2014, 2019, 2024].includes(n)) return null;
  return String(n);
}

/**
 * Normalize a state argument to the canonical key used in DATA.
 * @param {string} state
 * @returns {string|null}
 */
function normalizeState(state) {
  if (typeof state !== "string") return null;
  const trimmed = state.trim();
  if (!trimmed) return null;
  const upper = trimmed.toUpperCase();
  const match = Object.keys(OFFICES).find((key) => key.toUpperCase() === upper);
  if (match) return match;
  // Fall back to a case-insensitive match against DATA states.
  const dataState = DATA.find((d) => d.state.toUpperCase() === upper);
  return dataState ? dataState.state : null;
}

/**
 * election_results: filter Lok Sabha seats by year and/or state.
 * @param {{year?: string, state?: string}} params
 * @returns {{results: LokSabhaSeat[], count: number, note: string}}
 */
export function electionResults({ year, state } = {}) {
  const y = normalizeYear(year);
  const s = normalizeState(state);

  if (!y && !s) {
    return { results: [], count: 0, note: "Provide at least one of 'year' or 'state'." };
  }

  const results = DATA.filter((d) => (y ? d.year === y : true) && (s ? d.state === s : true));
  const note = [
    y ? `year=${y}` : null,
    s ? `state=${s}` : null,
  ].filter(Boolean).join(" & ") || "all sample seats";

  return { results, count: results.length, note };
}

/**
 * voter_lookup: validate a voter ID card number and/or find the election
 * office for a state.
 *
 * The standard ECV voter ID format is: 3 uppercase letters followed by 8
 * digits (e.g. "ABC1234567").
 *
 * @param {{cardNumber?: string, state?: string}} params
 * @returns {{ok?: boolean, valid?: boolean, message: string, voter?: object, office?: object}}
 */
export function voterLookup({ cardNumber, state } = {}) {
  if (!cardNumber && !state) {
    return { ok: false, message: "Provide 'cardNumber' and/or 'state'." };
  }

  const out = { ok: true, message: "" };

  if (cardNumber) {
    const card = String(cardNumber).trim().toUpperCase();
    const valid = /^[A-Z]{3}\d{8}$/.test(card);
    out.valid = valid;
    if (!valid) {
      out.ok = false;
      out.message = "Invalid voter ID format. Expected 3 uppercase letters followed by 8 digits (e.g. ABC1234567).";
      return out;
    }
    const voter = VOTERS.find((v) => v.cardNumber === card);
    if (voter) {
      out.voter = voter;
      out.message = `Voter found: ${voter.name}, ${voter.status}, ${voter.assemblyConstituency}, ${voter.state}.`;
    } else {
      out.voter = null;
      out.message = `Format OK, but no record found for card number ${card}.`;
    }
    return out;
  }

  // state-only lookup
  const s = normalizeState(state);
  if (!s) {
    out.ok = false;
    out.message = `No election office on file for state '${state}'.`;
    return out;
  }
  out.office = OFFICES[s];
  out.message = `State Election Office for ${s}: ${out.office.office}, ${out.office.address}, ${out.office.phone}.`;
  return out;
}

/**
 * candidate_search: search candidates/MPs by name or constituency.
 * @param {{name?: string, constituency?: string}} params
 * @returns {{results: LokSabhaSeat[], count: number, note: string}}
 */
export function candidateSearch({ name, constituency } = {}) {
  const qName = typeof name === "string" ? name.trim().toLowerCase() : "";
  const qCon = typeof constituency === "string" ? constituency.trim().toLowerCase() : "";

  if (!qName && !qCon) {
    return { results: [], count: 0, note: "Provide 'name' and/or 'constituency'." };
  }

  const results = DATA.filter((d) => {
    const byName = qName && (
      d.winnerName.toLowerCase().includes(qName) ||
      d.runnerUpName.toLowerCase().includes(qName)
    );
    const byCon = qCon && d.constituency.toLowerCase().includes(qCon);
    return byName || byCon;
  });

  return { results, count: results.length, note: "Matches found by name or constituency." };
}
