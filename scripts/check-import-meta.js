#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(full, cb);
    } else {
      cb(full);
    }
  }
}

const roots = ['app', 'components', 'store', 'services', 'constants', 'node_modules'];
const matches = [];

for (const r of roots) {
  const root = path.join(process.cwd(), r);
  if (!fs.existsSync(root)) continue;
  walk(root, (file) => {
    if (!/\.jsx?$|\.tsx?$|\.mjs$|\.js$/.test(file)) return;
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (/import\.meta(\.|\[)/.test(content)) {
        matches.push(file);
      }
    } catch (e) {
      // ignore
    }
  });
}

if (matches.length > 0) {
  console.error('Found import.meta occurrences in files:');
  matches.forEach((m) => console.error('  ' + m));
  process.exitCode = 2;
} else {
  console.log('No import.meta occurrences found (quick scan).');
}
