const fs = require('fs');
const path = require('path');

const expectedPath = path.join(__dirname, '..', 'dist', 'index.js');
if (fs.existsSync(expectedPath)) {
  console.log('CommonJS output verified at dist/index.js');
} else {
  console.error('Expected output not found at dist/index.js');
  process.exit(1);
}
