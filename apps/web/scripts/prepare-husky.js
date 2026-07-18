/**
 * Husky prepare script.
 *
 * Runs automatically after `bun install` via the `prepare` lifecycle script.
 * Installs Git hooks from the repository root so the pre-commit hook is
 * available to every developer. Skips installation in CI environments.
 */

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

// Skip in CI environments — hooks are a local developer convenience.
if (process.env.CI || process.env.CONTINUOUS_INTEGRATION) {
  process.exit(0);
}

try {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));

  // Resolve the Git repository root. This works regardless of which
  // subdirectory `bun install` runs from.
  const gitRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], {
    encoding: 'utf8',
    cwd: scriptDir,
  }).trim();

  // Resolve the locally-installed husky binary so this works on Windows and
  // when the global `husky` command is not on PATH. Husky does not expose its
  // internals via package exports, so we walk up from this script until we find
  // it (handles both regular and hoisted node_modules layouts).
  let searchDir = scriptDir;
  let huskyBin = '';
  while (searchDir !== path.dirname(searchDir)) {
    const candidate = path.join(searchDir, 'node_modules', 'husky', 'bin.js');
    if (fs.existsSync(candidate)) {
      huskyBin = candidate;
      break;
    }
    searchDir = path.dirname(searchDir);
  }

  if (!huskyBin) {
    throw new Error('Could not find husky binary. Run `bun install` first.');
  }

  execFileSync(process.execPath, [huskyBin], { cwd: gitRoot, stdio: 'inherit' });
} catch (error) {
  // In development, surface the failure so the team knows hooks were not installed.
  if (!process.env.CI && !process.env.CONTINUOUS_INTEGRATION) {
    console.warn('Husky install skipped:', error.message);
  }
  process.exit(0);
}
