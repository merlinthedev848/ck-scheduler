const fs = require('fs');
const path = require('path');

function walkJS(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      files = files.concat(walkJS(p));
    } else if (p.endsWith('.js')) {
      files.push(p);
    }
  });
  return files;
}

const renderRegex = /res\.render\(['"`](.*?)['"`]/g;
const redirectRegex = /res\.redirect\(['"`](.*?)['"`]/g;

console.log('--- Checking Controller Views ---');
let missingViews = 0;
walkJS('./src/controllers').forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = renderRegex.exec(content)) !== null) {
    const viewPath = path.join(__dirname, 'src/views', match[1] + '.pug');
    if (!fs.existsSync(viewPath)) {
      console.error(`ERROR: Missing view ${match[1]} referenced in ${f}`);
      missingViews++;
    }
  }
});

if (missingViews === 0) console.log('All referenced views exist.');
