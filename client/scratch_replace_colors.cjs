const fs = require('fs');
const path = 'f:/F-Projects/AutoMend/client/src/pages/Home.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/#000101/gi, 'var(--color-bg)');
content = content.replace(/#172531/gi, 'var(--color-surface)');
content = content.replace(/#FFFFFF/gi, 'var(--color-text-main)');
content = content.replace(/#F3BD68/gi, 'var(--color-primary)');
content = content.replace(/#C7843B/gi, 'var(--color-primary)');
content = content.replace(/#A0BABA/gi, 'var(--color-text-muted)');
content = content.replace(/#6A808F/gi, 'var(--color-text-muted)');
content = content.replace(/#4D6473/gi, 'var(--color-accent)');

// Update gradients and rgbas in Home
content = content.replace(/rgba\(243,\s*189,\s*104,/gi, 'rgba(217,137,106,');
content = content.replace(/rgba\(199,\s*132,\s*59,/gi, 'rgba(217,137,106,'); 
content = content.replace(/rgba\(0,\s*1,\s*1,/gi, 'rgba(22,24,29,');
content = content.replace(/rgba\(23,\s*37,\s*49,/gi, 'rgba(34,37,44,');

// Adjust hero gradient overlay so it doesn't get too dark
content = content.replace(/background: 'linear-gradient\\(to bottom, rgba\\(22,24,29,0\\.65\\) 0%, rgba\\(34,37,44,0\\.85\\) 50%, rgba\\(22,24,29,0\\.95\\) 100%\\)'/g, "background: 'var(--color-bg)', opacity: 0.8");

fs.writeFileSync(path, content);
console.log('Replaced colors in Home.jsx');
