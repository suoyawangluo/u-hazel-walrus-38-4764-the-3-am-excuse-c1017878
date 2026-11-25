// The 3 AM Excuse — make.fun entry
// A hardware wallet refuses to sign a transaction at 3 AM.
// Voice: the wallet as a worker off the clock — keys punched out,
// buttons on strike — not the tired battery/firmware/cold-storage jokes.
// The 3 AM hour is the joke: a 3 AM "emergency" is just FOMO with a timestamp.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Named parts of the excuse, assembled by buildLine().
const SETUP = "My keys clocked out at midnight and my buttons are on strike";
const PUNCHLINE = "your 3 AM 'emergency' is just FOMO with a timestamp.";
const LINE = `${SETUP} — ${PUNCHLINE}`;

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

interface GateReport {
  valid: boolean;
  codePoints: number;
  lines: number;
}

function validateEntry(line: string): GateReport {
  const codePoints = [...line].length;
  const lines = line.split("\n").length;
  const valid =
    codePoints >= 1 &&
    codePoints <= 200 &&
    lines === 1 &&
    line.trim().length > 0;
  return { valid, codePoints, lines };
}

function buildLine(): string {
  return LINE;
}

function verifyWritten(path: string): string {
  const written = readFileSync(path, "utf8");
  if (written.trim() !== LINE) {
    throw new Error("written entry does not match the entry line");
  }
  return createHash("sha256").update(written).digest("hex");
}

function main(): void {
  const line = buildLine();
  const report = validateEntry(line);
  if (!report.valid) {
    throw new Error(
      `gate failed: ${report.codePoints} code points, ${report.lines} lines`,
    );
  }
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, line + "\n", "utf8");
  const sha256 = verifyWritten(OUT_FILE);
  console.log(
    `gate passes: ${report.codePoints} code points, ${report.lines} line`,
  );
  console.log(`wrote ${OUT_FILE} (sha256 ${sha256})`);
  console.log(`verified: ${JSON.stringify(line)}`);
}

main();
