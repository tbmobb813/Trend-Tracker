#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const NODE_MODULES = path.join(ROOT, 'node_modules');
const BACKUP_DIR = path.join(ROOT, '.import_meta_backups');

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      // skip .git and .cache to be fast
      if (ent.name === '.git' || ent.name === '.cache') continue;
      walk(full, cb);
    } else if (ent.isFile()) {
      cb(full);
    }
  }
}

function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function processFile(file) {
  if (!file.endsWith('.js') && !file.endsWith('.mjs') && !file.endsWith('.cjs')) return;
  let content;
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch (e) {
    return;
  }
  if (!content.includes('import.meta.resolve') && !content.includes('import.meta')) return;

  const orig = content;
  // 1) Replace ${import.meta.resolve("./x")} or import.meta.resolve('./x') with "./x"
  let replaced = content.replace(/\$?\{?import\.meta\.resolve\((['\"])(.+?)\1\)\}?/g, '"$2"');
  // 2) Replace import.meta.url with an empty string literal to avoid runtime import.meta syntax errors
  replaced = replaced.replace(/import\.meta\.url/g, '""');
  // 3) Replace any remaining bare `import.meta` with an empty object to avoid the `import.meta` syntax error
  replaced = replaced.replace(/import\.meta/g, '({})');

  if (replaced !== orig) {
    // backup original
    const rel = path.relative(ROOT, file);
    const backupPath = path.join(BACKUP_DIR, rel + '.bak');
    const backupDir = path.dirname(backupPath);
    fs.mkdirSync(backupDir, { recursive: true });
    fs.writeFileSync(backupPath, orig, 'utf8');
    fs.writeFileSync(file, replaced, 'utf8');
    console.log('Patched:', rel);
  }
}

function main() {
  if (!fs.existsSync(NODE_MODULES)) {
    console.error('node_modules not found; run npm install first.');
    process.exit(1);
  }
  ensureBackupDir();
  walk(NODE_MODULES, processFile);
  console.log('Done scanning node_modules for import.meta.resolve and import.meta occurrences.');
}

main();
