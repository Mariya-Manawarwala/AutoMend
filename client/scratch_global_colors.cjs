const fs = require('fs');
const path = require('path');

const dirs = [
  'f:/F-Projects/AutoMend/client/src/pages',
  'f:/F-Projects/AutoMend/client/src/components',
  'f:/F-Projects/AutoMend/client/src/features',
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  let newContent = content
    .replace(/#000101/gi, 'var(--color-bg)')
    .replace(/#172531/gi, 'var(--color-surface)')
    .replace(/#FFFFFF/gi, 'var(--color-text-main)')
    .replace(/#F3BD68/gi, 'var(--color-primary)')
    .replace(/#C7843B/gi, 'var(--color-primary)')
    .replace(/#A0BABA/gi, 'var(--color-text-muted)')
    .replace(/#6A808F/gi, 'var(--color-text-muted)')
    .replace(/#4D6473/gi, 'var(--color-accent)')
    .replace(/rgba\(243,\s*189,\s*104,/gi, 'rgba(217,137,106,')
    .replace(/rgba\(199,\s*132,\s*59,/gi, 'rgba(217,137,106,')
    .replace(/rgba\(0,\s*1,\s*1,/gi, 'rgba(22,24,29,')
    .replace(/rgba\(23,\s*37,\s*49,/gi, 'rgba(34,37,44,');

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log('Updated: ' + filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      replaceInFile(fullPath);
    }
  }
}

dirs.forEach(walkDir);
console.log('Global color replacement complete.');
