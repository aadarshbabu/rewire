#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

// Parse CLI flags
const args = process.argv.slice(2);
function getArg(name, defaultValue = undefined) {
  const prefix = `--${name}=`;
  const exact = `--${name}`;
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith(prefix)) {
      return args[i].slice(prefix.length);
    }
    if (args[i] === exact && args[i + 1] && !args[i + 1].startsWith("--")) {
      return args[i + 1];
    }
  }
  return defaultValue;
}

const isDryRun = args.includes("--dry-run");
const targetEnv = getArg("env", "production"); // production, preview, development
const defaultFile =
  targetEnv === "preview" && existsSync(resolve(process.cwd(), "apps/web/.env.preview"))
    ? "apps/web/.env.preview"
    : "apps/web/.env.production";

const filePath = resolve(process.cwd(), getArg("file", defaultFile));

if (!["production", "preview", "development"].includes(targetEnv)) {
  console.error(`❌ Invalid environment "${targetEnv}". Must be production, preview, or development.`);
  process.exit(1);
}

if (!existsSync(filePath)) {
  console.error(`❌ Env file not found at: ${filePath}`);
  process.exit(1);
}

console.log(`\n========================================`);
console.log(`🚀 Vercel Environment Variable Sync`);
console.log(`🎯 Target Environment: ${targetEnv}`);
console.log(`📄 Source File:        ${filePath}`);
if (isDryRun) {
  console.log(`🔍 Dry Run Mode:       ENABLED (No changes will be made)`);
}
console.log(`========================================\n`);

// Simple .env parser
function parseEnv(content) {
  const entries = [];
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIdx = trimmed.indexOf("=");
    if (equalsIdx === -1) continue;

    const key = trimmed.slice(0, equalsIdx).trim();
    let value = trimmed.slice(equalsIdx + 1).trim();

    // Strip wrapping single or double quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key) {
      entries.push({ key, value });
    }
  }
  return entries;
}

const content = readFileSync(filePath, "utf-8");
const envVars = parseEnv(content);

if (envVars.length === 0) {
  console.log(`⚠️ No variables found to sync in ${filePath}`);
  process.exit(0);
}

console.log(`Found ${envVars.length} variables to sync:\n`);

let successCount = 0;
let failCount = 0;

for (const { key, value } of envVars) {
  const maskedValue =
    value.length > 8 ? `${value.slice(0, 4)}...${value.slice(-4)}` : "********";

  if (isDryRun) {
    console.log(`  [DRY RUN] ${key.padEnd(26)} -> ${maskedValue}`);
    successCount++;
    continue;
  }

  process.stdout.write(`  Syncing ${key.padEnd(26)} ... `);

  // Use vercel env add with stdin to avoid escaping issues and command line limits
  // vercel env add <key> <env> --force --yes
  const result = spawnSync("vercel", ["env", "add", key, targetEnv, "--force", "--yes"], {
    input: value,
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  });

  if (result.status === 0) {
    console.log(`✅ OK`);
    successCount++;
  } else {
    console.log(`❌ FAILED`);
    const errMsg = (result.stderr || result.stdout || "").trim();
    if (errMsg) {
      console.error(`     Error: ${errMsg.split("\n")[0]}`);
    }
    failCount++;
  }
}

console.log(`\n========================================`);
if (failCount === 0) {
  console.log(`🎉 Successfully synced all ${successCount} variable(s) to ${targetEnv}!`);
} else {
  console.log(`⚠️ Synced ${successCount} variable(s), but ${failCount} failed.`);
  console.log(`Tip: Ensure your project is linked by running "pnpm vercel:link".`);
}
console.log(`========================================\n`);
