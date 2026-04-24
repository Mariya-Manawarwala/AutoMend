const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'client', 'src', 'pages');

const replacements = {
  // New replacements based on search results
  'hover:bg-amber-600': 'hover:bg-gold-hover',
  'bg-amber-600': 'bg-gold',
  'text-amber-100': 'text-text-primary',
  'text-gray-900': 'text-[#0E0E0E]',
  'border-gray-700/50': 'border-soft',
  'hover:bg-gray-700/60': 'hover:bg-soft',
  'bg-gray-700/30': 'bg-soft',
  'bg-gray-700': 'bg-soft',
  'bg-gray-800': 'bg-secondary',
  'bg-gray-900': 'bg-primary',
  'border-gray-600': 'border-soft',
  'text-gray-200': 'text-text-primary',
  'placeholder-gray-500': 'placeholder-text-muted',
  'from-gray-900': 'from-primary',
  'via-gray-800': 'via-secondary',
  'to-gray-900': 'to-primary'
};

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else {
      if (file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walkDir(directoryPath);
let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  for (const [oldStr, newStr] of Object.entries(replacements)) {
    content = content.split(oldStr).join(newStr);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Refactor pass 2 complete. Modified ${modifiedCount} files.`);
