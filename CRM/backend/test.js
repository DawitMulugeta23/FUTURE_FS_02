console.log('Current directory:', __dirname);
console.log('Trying to find server.js...');

const fs = require('fs');
const path = require('path');

const possiblePaths = [
  path.join(__dirname, 'server.js'),
  path.join(__dirname, 'src', 'server.js'),
  path.join(__dirname, 'backend', 'server.js'),
];

possiblePaths.forEach(p => {
  console.log(`Checking: ${p} - ${fs.existsSync(p) ? '✅ FOUND' : '❌ Not found'}`);
});