const minimist = require('minimist');
const fs = require('fs');
const { generateFile } = require('./generateStep');
const { specFile } = minimist(process.argv.slice(2));

if (!specFile) throw new Error('No --specFile given');

fs.writeFileSync(
  './tests/generated_implementation.js',
  generateFile(fs.readFileSync(specFile, 'utf8')),
  'utf8',
);
