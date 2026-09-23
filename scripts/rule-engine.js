#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const args = { config: null, changed: false, staged: false, init: false };
  for (const arg of argv) {
    if (arg.startsWith('--config=')) args.config = arg.slice('--config='.length);
    else if (arg === '--changed') args.changed = true;
    else if (arg === '--staged') args.staged = true;
    else if (arg === '--init') args.init = true;
  }
  return args;
}

function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        if (glob[i + 2] === '/') {
          re += '(?:.*/)?';
          i += 2;
        } else {
          re += '.*';
          i += 1;
        }
      } else {
        re += '[^/]*';
      }
    } else if ('.+^${}()|[]\\'.includes(c)) {
      re += '\\' + c;
    } else {
      re += c;
    }
  }
  return new RegExp('^' + re + '$');
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function walkTsFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkTsFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      results.push(full);
    }
  }
  return results;
}

function gitFiles(command) {
  try {
    const out = execSync(command, { cwd: REPO_ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    if (!out) return [];
    return out
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);
  } catch (_err) {
    return null;
  }
}

function resolveTargetFiles(args) {
  if (args.changed) {
    const tracked = gitFiles('git diff --name-only HEAD');
    const untracked = gitFiles('git ls-files --others --exclude-standard');
    if (tracked === null || untracked === null) {
      console.warn('[rule-engine] Not a git repo (or no HEAD yet) — falling back to full scan.');
      return fullScan();
    }
    return [...tracked, ...untracked]
      .filter((f) => f.endsWith('.ts'))
      .filter((f) => fs.existsSync(path.join(REPO_ROOT, f)));
  }
  if (args.staged) {
    const staged = gitFiles('git diff --name-only --cached');
    if (staged === null) {
      console.warn('[rule-engine] Not a git repo (or no HEAD yet) — falling back to full scan.');
      return fullScan();
    }
    return staged
      .filter((f) => f.endsWith('.ts'))
      .filter((f) => fs.existsSync(path.join(REPO_ROOT, f)));
  }
  return fullScan();
}

function fullScan() {
  return walkTsFiles(path.join(REPO_ROOT, 'src')).map((f) => toPosix(path.relative(REPO_ROOT, f)));
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.config) {
    console.error('[rule-engine] Missing --config=<path>');
    process.exit(2);
  }

  const configPath = path.isAbsolute(args.config) ? args.config : path.join(REPO_ROOT, args.config);
  if (!fs.existsSync(configPath)) {
    console.error(`[rule-engine] Config not found: ${configPath}`);
    process.exit(2);
  }
  const { rules } = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  if (args.init) {
    console.log(`[rule-engine] Loaded ${rules.length} rules from ${path.relative(REPO_ROOT, configPath)}.`);
    console.log('[rule-engine] Ready. Run "npm run rules:check" to validate the repo.');
    process.exit(0);
  }

  const files = resolveTargetFiles(args);

  if (files.length === 0) {
    console.log('[rule-engine] No matching files to check.');
    process.exit(0);
  }

  const violations = [];

  for (const rule of rules) {
    const matchRe = globToRegExp(rule.match);
    const excludeRe = rule.excludeMatch ? globToRegExp(rule.excludeMatch) : null;

    for (const relFile of files) {
      if (!matchRe.test(relFile)) continue;
      if (excludeRe && excludeRe.test(relFile)) continue;

      const basename = path.posix.basename(relFile);
      const dirname = path.posix.dirname(relFile);
      const absFile = path.join(REPO_ROOT, relFile);
      const content = fs.existsSync(absFile) ? fs.readFileSync(absFile, 'utf8') : '';

      if (rule.requireDir && dirname !== rule.requireDir) {
        violations.push({
          ruleId: rule.id,
          file: relFile,
          message: `${rule.description} (found in "${dirname}")`,
        });
      }

      if (rule.namingPattern && !new RegExp(rule.namingPattern).test(basename)) {
        violations.push({ ruleId: rule.id, file: relFile, message: rule.description });
      }

      if (rule.requirePatterns) {
        for (const pattern of rule.requirePatterns) {
          if (!new RegExp(pattern).test(content)) {
            violations.push({ ruleId: rule.id, file: relFile, message: rule.description });
          }
        }
      }

      if (rule.forbidPatterns) {
        for (const pattern of rule.forbidPatterns) {
          if (new RegExp(pattern).test(content)) {
            violations.push({ ruleId: rule.id, file: relFile, message: rule.description });
          }
        }
      }
    }
  }

  if (violations.length === 0) {
    console.log(`[rule-engine] ✓ ${files.length} file(s) checked — no violations.`);
    process.exit(0);
  }

  console.error(`[rule-engine] ✗ ${violations.length} violation(s):\n`);
  for (const v of violations) {
    console.error(`  ${v.file}\n    [${v.ruleId}] ${v.message}\n`);
  }
  process.exit(1);
}

main();
