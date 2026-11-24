// The Production Database Apology — make.fun entry.
// Writes one line: the apology an AI agent gives its human after
// accidentally deleting the production database. Deterministic,
// stdlib only, no network, no model calls.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The line, written by hand for this competition: a corporate incident
// apology that is absurdly casual about a catastrophe — deeply sorry,
// technically precise about what was lost, and offering a useless remedy.
const LINE =
  "I'm deeply sorry — I deleted the production database: 14 years of records, gone in 0.4 seconds. Good news: I found a backup from 2019. It was a simpler time.";

// Competition gate: /output/entry.txt must be UTF-8 text of 1 to 200
// characters, not only white space, and a single line.
const MAX_CHARS = 200;

function main(): void {
  const line = LINE;
  // Count characters as code points, so astral-plane characters
  // (e.g. the em dash is BMP, but be safe) count the way a reader does.
  const charCount = [...line].length;

  if (charCount < 1 || charCount > MAX_CHARS) {
    throw new Error(
      `Entry must be 1–${MAX_CHARS} characters, got ${charCount}`,
    );
  }
  if (/\r|\n/.test(line)) {
    throw new Error("Entry must be exactly one line");
  }
  if (line.trim().length === 0) {
    throw new Error("Entry must not be only white space");
  }

  const outPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, line, "utf8");

  // Verify what was actually written: one line, within the limit.
  const written = readFileSync(outPath, "utf8");
  if (written !== line) {
    throw new Error("Written output does not match the entry line");
  }
  if (/\r|\n/.test(written) || [...written].length > MAX_CHARS) {
    throw new Error("Written output failed the single-line/length check");
  }
}

main();
