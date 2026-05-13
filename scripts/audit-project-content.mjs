#!/usr/bin/env node
/**
 * Audit project content quality in data/projects.json
 * Checks: one_liner length, highlights count/length, use_cases count,
 * editors_note word count, docs_url/install_url/deploy_url presence
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(__dirname, '../data/projects.json'), 'utf-8'));
const projects = data.projects;

const issues = [];
const summary = {
  total: projects.length,
  oneLinerTooShort: 0,
  oneLinerTooLong: 0,
  highlightsCount: 0,
  highlightsTooShort: 0,
  highlightsTooLong: 0,
  useCasesCount: 0,
  editorsNoteTooShort: 0,
  editorsNoteTooLong: 0,
  missingDocsUrl: 0,
  missingInstallUrl: 0,
  missingDeployUrl: 0,
  genericWords: 0,
};

const genericWords = ['powerful', 'comprehensive', 'feature-rich', 'revolutionary', 'cutting-edge', 'game-changing'];

for (const p of projects) {
  // one_liner
  const ol = p.one_liner || '';
  if (ol.length < 60) { summary.oneLinerTooShort++; issues.push(`${p.name}: one_liner too short (${ol.length} chars)`); }
  if (ol.length > 120) { summary.oneLinerTooLong++; issues.push(`${p.name}: one_liner too long (${ol.length} chars)`); }

  // highlights
  const hls = p.highlights || [];
  if (hls.length !== 3) { summary.highlightsCount++; issues.push(`${p.name}: highlights count is ${hls.length}, expected 3`); }
  for (const h of hls) {
    if (h.length < 30) { summary.highlightsTooShort++; issues.push(`${p.name}: highlight too short (${h.length} chars): "${h.slice(0, 40)}..."`); }
    if (h.length > 80) { summary.highlightsTooLong++; issues.push(`${p.name}: highlight too long (${h.length} chars): "${h.slice(0, 40)}..."`); }
    for (const gw of genericWords) {
      if (h.toLowerCase().includes(gw)) {
        summary.genericWords++;
        issues.push(`${p.name}: highlight contains generic word "${gw}": "${h.slice(0, 50)}..."`);
      }
    }
  }

  // use_cases
  const ucs = p.use_cases || [];
  if (ucs.length < 2) { summary.useCasesCount++; issues.push(`${p.name}: only ${ucs.length} use cases, need 2-3`); }
  if (ucs.length > 3) { issues.push(`${p.name}: ${ucs.length} use cases, max 3`); }

  // editors_note
  const en = p.editors_note || '';
  const wordCount = en.split(/\s+/).length;
  if (wordCount < 50) { summary.editorsNoteTooShort++; issues.push(`${p.name}: editors_note too short (${wordCount} words)`); }
  if (wordCount > 150) { summary.editorsNoteTooLong++; issues.push(`${p.name}: editors_note too long (${wordCount} words)`); }

  // links
  if (!p.docs_url) summary.missingDocsUrl++;
  if (!p.install_url) summary.missingInstallUrl++;
  if (!p.deploy_url && (p.tags.includes('self-hosted') || p.tags.includes('docker'))) summary.missingDeployUrl++;
}

// Print report
console.log(`\n=== Project Content Audit Report ===\n`);
console.log(`Total projects: ${summary.total}`);
console.log(`\n--- Content Quality ---`);
console.log(`one_liner too short (<60): ${summary.oneLinerTooShort}`);
console.log(`one_liner too long (>120): ${summary.oneLinerTooLong}`);
console.log(`highlights count ≠ 3: ${summary.highlightsCount}`);
console.log(`highlights too short (<30): ${summary.highlightsTooShort}`);
console.log(`highlights too long (>80): ${summary.highlightsTooLong}`);
console.log(`use_cases < 2: ${summary.useCasesCount}`);
console.log(`editors_note < 50 words: ${summary.editorsNoteTooShort}`);
console.log(`editors_note > 150 words: ${summary.editorsNoteTooLong}`);
console.log(`generic words in highlights: ${summary.genericWords}`);
console.log(`\n--- Link Coverage ---`);
console.log(`missing docs_url: ${summary.missingDocsUrl}`);
console.log(`missing install_url: ${summary.missingInstallUrl}`);
console.log(`missing deploy_url (self-hosted/docker): ${summary.missingDeployUrl}`);

if (issues.length > 0) {
  console.log(`\n--- Issues (${issues.length}) ---`);
  for (const i of issues) console.log(`  ❌ ${i}`);
} else {
  console.log(`\n✅ No issues found!`);
}

// Write report to file
writeFileSync(
  join(__dirname, 'audit-report.json'),
  JSON.stringify({ summary, issues }, null, 2),
  'utf-8'
);
console.log(`\nReport saved to scripts/audit-report.json`);
