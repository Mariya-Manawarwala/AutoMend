const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'client', 'src', 'pages');

const replacements = {
  '<div className="overflow-x-auto">': '<div className="bg-white border border-border-soft rounded-xl shadow-card overflow-x-auto">',
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
    console.log(`Updated tables in ${file}`);
  }
});

console.log(`Table Refactor complete. Modified ${modifiedCount} files.`);
