/**
 * generate-version.cjs
 * 
 * Creates a version.json file in public/ with the current build timestamp.
 * The live site polls this file to detect new deployments and auto-reload.
 */
const fs = require('fs');
const path = require('path');

const version = {
  buildTime: new Date().toISOString(),
  hash: Date.now().toString(36)
};

const outPath = path.join(__dirname, '..', 'public', 'version.json');
fs.writeFileSync(outPath, JSON.stringify(version, null, 2));
console.log(`[version] Generated version.json → hash: ${version.hash}`);
