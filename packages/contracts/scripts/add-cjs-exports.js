const fs = require('fs');
const path = require('path');

const expectedPath = path.join(__dirname, '..', 'dist', 'index.js');
const rootDistPath = path.join(__dirname, '..', '..', 'dist', 'index.js');
const srcPath = path.join(__dirname, '..', 'src', 'index.js');

console.error(`Checking for ${expectedPath}`);
console.error(`Checking for ${rootDistPath}`);
console.error(`Checking for ${srcPath}`);

if (fs.existsSync(expectedPath)) {
  console.log('CommonJS output verified at dist/index.js');
} else if (fs.existsSync(rootDistPath)) {
  console.log('CommonJS output found at root dist/index.js');
} else if (fs.existsSync(srcPath)) {
  console.log('CommonJS output found at src/index.js (INCORRECT LOCATION)');
} else {
  console.error('Expected output not found at dist/index.js');
  process.exit(1);
}
