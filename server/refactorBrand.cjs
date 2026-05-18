const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'client', 'src');

const replacements = {
  // Replace old gold tokens with brand tokens
  'bg-gold': 'bg-brand',
  'text-gold': 'text-brand',
  'border-gold': 'border-brand',
  'accent-gold': 'accent-brand',
  'hover:text-gold-hover': 'hover:text-brand-hover',
  'hover:border-gold': 'hover:border-brand',
  'hover:bg-gold-hover': 'hover:bg-brand-hover',
  'hover:text-gold': 'hover:text-brand',
  'group-hover:text-gold': 'group-hover:text-brand',
  'focus:border-gold': 'focus:border-brand',
  // Some gradients or unique colors that need switching
  'bg-[image:var(--background-image-gradient-luxury)]': 'bg-brand-dark', // default hero bg to solid brand dark for now
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

console.log(`Brand Refactor complete. Modified ${modifiedCount} files.`);
