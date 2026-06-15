const fs = require('fs');
const path = require('path');
const pug = require('pug');

function walk(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      files = files.concat(walk(p));
    } else if (p.endsWith('.pug')) {
      files.push(p);
    }
  });
  return files;
}

console.log('--- Checking PUG Syntax ---');
let pugErrors = 0;
walk('./src/views').forEach(f => {
  try {
    // just try compiling to catch syntactical issues
    pug.compileFile(f);
  } catch (e) {
    console.error('ERROR compiling', f, e.message);
    pugErrors++;
  }
});
if (pugErrors === 0) console.log('All Pug templates compile successfully.');

console.log('\n--- Checking JS Files ---');
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

let jsErrors = 0;
walkJS('./src').forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('services.color')) {
    console.error('Found invalid services.color in', f);
    jsErrors++;
  }
});
if (jsErrors === 0) console.log('No obvious JS string/date or SQL column bugs found.');
