#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SKIP_DIRS = new Set(['node_modules', 'dist', 'test-results', 'playwright-report', 'tta-report', '.auth']);

function parseArgs(argv) {
  const args = { config: null, changed: false, staged: false };
  for (const arg of argv) {
    if (arg.startsWith('--config=')) args.config = arg.slice('--config='.length);
    else if (arg === '--changed') args.changed = true;
    else if (arg === '--staged') args.staged = true;
  }
  return args;
}

function globToRegExp(glob) {
  let re = '^';
  for (let i = 0; i < glob.length; i += 1) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        re += '.*';
        i += 1;
        if (glob[i + 1] === '/') i += 1;
      } else {
        re += '[^/]*';
      }
    } else if ('.+^${}()|[]\\'.includes(c)) {
      re += `\\${c}`;
    } else {
      re += c;
    }
  }
  re += '$';
  return new RegExp(re);
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function matchesGlob(filePath, glob) {
  return globToRegExp(glob).test(toPosix(filePath));
}

function walk(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, results);
    } else {
      results.push(full);
    }
  }
  return results;
}

function getChangedFiles(staged) {
  const cmd = staged
    ? 'git diff --cached --name-only --diff-filter=ACM'
    : 'git diff --name-only --diff-filter=ACM HEAD';
  try {
    return execSync(cmd, { encoding: 'utf-8' })
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);
  } catch (err) {
    console.error(`rule-engine: could not read git diff (${err.message}); falling back to full scan`);
    return null;
  }
}

function loadConfig(configPath) {
  const raw = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(raw);
}

function checkPlacement(rule, files, violations) {
  for (const file of files) {
    if (!matchesGlob(path.basename(file), rule.filePattern)) continue;
    if (!matchesGlob(file, `${rule.mustBeUnder}**/*`)) {
      violations.push({ ruleId: rule.id, file, severity: rule.severity, message: rule.message });
    }
  }
}

function checkNaming(rule, files, violations) {
  const regex = new RegExp(rule.namePattern);
  for (const file of files) {
    if (!matchesGlob(file, rule.appliesTo)) continue;
    if (!regex.test(path.basename(file))) {
      violations.push({ ruleId: rule.id, file, severity: rule.severity, message: rule.message });
    }
  }
}

function checkForbiddenContent(rule, files, violations) {
  const regex = new RegExp(rule.pattern);
  for (const file of files) {
    if (!matchesGlob(file, rule.appliesTo) || !fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf-8');
    if (regex.test(content)) {
      violations.push({ ruleId: rule.id, file, severity: rule.severity, message: rule.message });
    }
  }
}

function checkRequiredContent(rule, files, violations) {
  const regex = new RegExp(rule.pattern);
  for (const file of files) {
    if (!matchesGlob(file, rule.appliesTo) || !fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf-8');
    if (!regex.test(content)) {
      violations.push({ ruleId: rule.id, file, severity: rule.severity, message: rule.message });
    }
  }
}

const CHECKERS = {
  placement: checkPlacement,
  naming: checkNaming,
  forbiddenContent: checkForbiddenContent,
  requiredContent: checkRequiredContent,
};

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.config) {
    console.error('rule-engine: missing --config=<path>');
    process.exit(2);
  }

  const config = loadConfig(args.config);

  let files = null;
  if (args.changed || args.staged) {
    files = getChangedFiles(args.staged);
  }
  if (!files) {
    files = walk('src');
  } else {
    files = files.filter((f) => fs.existsSync(f));
  }
  files = files.filter((f) => f.startsWith('src') && f.endsWith('.ts'));

  const violations = [];
  for (const rule of config.rules) {
    const checker = CHECKERS[rule.type];
    if (!checker) continue;
    checker(rule, files, violations);
  }

  const errors = violations.filter((v) => v.severity !== 'warning');
  const warnings = violations.filter((v) => v.severity === 'warning');

  if (warnings.length) {
    console.warn(`\nrule-engine: ${warnings.length} warning(s)`);
    for (const v of warnings) {
      console.warn(`  [${v.ruleId}] ${v.file} — ${v.message}`);
    }
  }

  if (errors.length) {
    console.error(`\nrule-engine: ${errors.length} error(s) found (${files.length} files checked)\n`);
    for (const v of errors) {
      console.error(`  [${v.ruleId}] ${v.file} — ${v.message}`);
    }
    process.exit(1);
  }

  console.warn(`rule-engine: passed (${files.length} files checked)`);
  process.exit(0);
}

main();
