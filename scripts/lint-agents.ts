#!/usr/bin/env bun
/**
 * lint-agents.ts — Enforce the agent spec schema from agents/_schema.md
 *
 * Charter principle: "Every organizational capability must be registered."
 * Agents are primary capability units; their specs must match the schema.
 *
 * Day-3+ full implementation. Replaces the Day-2 stub.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const AGENTS_DIR = 'agents';
const SKIP_FILES = new Set(['_schema.md', 'README.md']);

const REQUIRED_FRONTMATTER = ['agent_id', 'division', 'reports_to', 'status', 'version'] as const;

const VALID_DIVISIONS = new Set([
  'Executive',
  'Research',
  'Architecture',
  'Engineering',
  'QA',
  'Security',
  'Infrastructure',
  'Marketing',
  'SEO',
  'Sales',
  'Finance',
  'Operations',
  'Knowledge',
]);

const VALID_STATUSES = new Set(['draft', 'active', 'deprecated']);

const REQUIRED_SECTIONS = [
  'Mission',
  'Scope',
  'Escalates',
  'Inputs',
  'Outputs',
  'Tools',
  'Memory',
  'KPIs',
  'Acceptance Criteria',
] as const;

const SEMVER_RE = /^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?(?:\+[a-zA-Z0-9.-]+)?$/;

interface AgentSpec {
  file: string;
  frontmatter: Record<string, string>;
  sections: string[];
}

function parseAgentFile(file: string): AgentSpec {
  const content = readFileSync(join(AGENTS_DIR, file), 'utf-8');
  const lines = content.split('\n');

  // Frontmatter is the section from the first non-# line to the first `## ` line.
  const frontmatter: Record<string, string> = {};
  let i = 0;
  for (; i < lines.length; i++) {
    const line = lines[i]?.trim() ?? '';
    if (line.startsWith('# ')) continue; // skip H1 title
    if (line.startsWith('## ')) break; // first section reached
    if (line === '') continue;
    const m = line.match(/^([a-zA-Z_]+)\s*:\s*(.+)$/);
    if (m?.[1] && m[2] !== undefined) {
      frontmatter[m[1]] = m[2].trim();
    }
  }

  // Sections: all `## ` headings (allow parenthetical suffix or descriptive tail)
  const sections: string[] = [];
  for (; i < lines.length; i++) {
    const line = lines[i]?.trim() ?? '';
    const m = line.match(/^##\s+(.+)$/);
    if (m?.[1]) {
      // "Scope (decides on own)" -> "Scope"
      // "KPIs (3-7 quantitative, measurable weekly)" -> "KPIs"
      // "Acceptance Criteria for promotion draft → active" -> "Acceptance Criteria"
      const cleaned = m[1]
        .replace(/\s*\(.*\)\s*$/, '')
        .replace(/\s+for\s+promotion.*$/, '')
        .trim();
      sections.push(cleaned);
    }
  }

  return { file, frontmatter, sections };
}

interface Violation {
  file: string;
  rule: string;
  detail: string;
}

const violations: Violation[] = [];
const agentIds = new Map<string, string>();

if (!existsSync(AGENTS_DIR)) {
  console.log('✓ lint-agents: agents/ directory not present. Skipping.');
  process.exit(0);
}

const agentFiles = readdirSync(AGENTS_DIR)
  .filter((f) => f.endsWith('.md') && !SKIP_FILES.has(f))
  .sort();

if (agentFiles.length === 0) {
  console.log('✓ lint-agents: no agent specs authored yet. Skipping.');
  process.exit(0);
}

const specs: AgentSpec[] = agentFiles.map(parseAgentFile);

for (const spec of specs) {
  // 1. Required frontmatter fields
  for (const key of REQUIRED_FRONTMATTER) {
    if (!(key in spec.frontmatter)) {
      violations.push({
        file: spec.file,
        rule: 'frontmatter.required',
        detail: `Missing required field: ${key}`,
      });
    }
  }

  // 2. agent_id unique
  const agentId = spec.frontmatter.agent_id;
  if (agentId) {
    if (agentIds.has(agentId)) {
      violations.push({
        file: spec.file,
        rule: 'agent_id.unique',
        detail: `Duplicate agent_id "${agentId}" (also in ${agentIds.get(agentId)})`,
      });
    } else {
      agentIds.set(agentId, spec.file);
    }
  }

  // 3. division valid
  const division = spec.frontmatter.division;
  if (division && !VALID_DIVISIONS.has(division)) {
    violations.push({
      file: spec.file,
      rule: 'division.valid',
      detail: `"${division}" not in canonical 13 divisions`,
    });
  }

  // 4. reports_to resolves (we'll do a final pass after collecting all IDs)
  //    (deferred)

  // 5. status valid
  const status = spec.frontmatter.status;
  if (status && !VALID_STATUSES.has(status)) {
    violations.push({
      file: spec.file,
      rule: 'status.valid',
      detail: `"${status}" not in {draft, active, deprecated}`,
    });
  }

  // 6. version is semver
  const version = spec.frontmatter.version;
  if (version && !SEMVER_RE.test(version)) {
    violations.push({
      file: spec.file,
      rule: 'version.semver',
      detail: `"${version}" is not a valid semver string`,
    });
  }

  // 7. Required sections in order
  let lastIndex = -1;
  for (const required of REQUIRED_SECTIONS) {
    const idx = spec.sections.indexOf(required);
    if (idx === -1) {
      violations.push({
        file: spec.file,
        rule: 'sections.required',
        detail: `Missing required section: ## ${required}`,
      });
    } else {
      if (idx < lastIndex) {
        violations.push({
          file: spec.file,
          rule: 'sections.order',
          detail: `Section "${required}" appears out of canonical order`,
        });
      }
      lastIndex = idx;
    }
  }

  // 8. Escalates block has concrete rule
  const escalatesSection = extractSection(spec.file, 'Escalates');
  if (
    escalatesSection &&
    !/Spend threshold\s*:/i.test(escalatesSection) &&
    !/Reversibility\s*:/i.test(escalatesSection)
  ) {
    violations.push({
      file: spec.file,
      rule: 'escalates.concrete',
      detail: 'Escalates block must contain Spend threshold OR Reversibility rule',
    });
  }

  // 9. KPIs has 3-7 bullets
  const kpisSection = extractSection(spec.file, 'KPIs');
  if (kpisSection) {
    const bullets = kpisSection.split('\n').filter((l) => l.trim().startsWith('- ')).length;
    if (bullets < 3 || bullets > 7) {
      violations.push({
        file: spec.file,
        rule: 'kpis.count',
        detail: `KPIs has ${bullets} bullets; required 3-7`,
      });
    }
  }

  // 10. Acceptance Criteria has ≥4 checkboxes
  const acSection = extractSection(spec.file, 'Acceptance Criteria');
  if (acSection) {
    const boxes = (acSection.match(/- \[ \]/g) ?? []).length;
    if (boxes < 4) {
      violations.push({
        file: spec.file,
        rule: 'acceptance.checkboxes',
        detail: `Acceptance Criteria has ${boxes} checkboxes; required ≥4`,
      });
    }
  }
}

// Deferred pass: reports_to resolution
for (const spec of specs) {
  const reportsTo = spec.frontmatter.reports_to;
  if (!reportsTo) continue;
  if (reportsTo === 'human:steward') continue;
  if (!agentIds.has(reportsTo)) {
    violations.push({
      file: spec.file,
      rule: 'reports_to.resolves',
      detail: `reports_to "${reportsTo}" does not match any registered agent_id`,
    });
  }
}

function extractSection(file: string, name: string): string | null {
  const content = readFileSync(join(AGENTS_DIR, file), 'utf-8');
  const lines = content.split('\n');
  let inSection = false;
  const buf: string[] = [];
  // Match the bare section name OR with parenthetical suffix.
  const headerRe = new RegExp(
    `^##\\s+${name.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}(\\s*\\(.*\\))?\\s*$`,
  );
  for (const line of lines) {
    if (headerRe.test(line.trim())) {
      inSection = true;
      continue;
    }
    if (inSection && line.trim().startsWith('## ')) break;
    if (inSection) buf.push(line);
  }
  return buf.length > 0 ? buf.join('\n') : null;
}

// Report
if (violations.length === 0) {
  console.log(`✓ lint-agents: ${agentFiles.length} agent specs validated against schema.`);
  process.exit(0);
}

console.error(`\n✗ lint-agents: ${violations.length} violation(s):\n`);
for (const v of violations) {
  console.error(`  [${v.rule}] ${v.file}: ${v.detail}`);
}
process.exit(1);
