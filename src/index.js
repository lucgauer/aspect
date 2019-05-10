const minimist = require('minimist');
const fs = require('fs');
const { generateFile } = require('./generateStep');
const { specFile } = minimist(process.argv.slice(2));
const destinationPath = './tests/generated_implementation.js';

try {
  if (!specFile) throw new Error('No --specFile given');

  fs.writeFileSync(
    destinationPath,
    generateFile(fs.readFileSync(specFile, 'utf8')),
    'utf8',
  );

  console.info(`Success! Implementation for "${specFile}" generated at: "${destinationPath}"`);
} catch (e) {
  console.error(e);
}
