/**
 * generate-version.js
 *
 * Creates a version.json file in public/ with a fresh timestamp.
 * The live site polls this file to detect new deployments and auto-reload.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const version = Date.now().toString();
const outputDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(
  path.join(outputDir, 'version.json'),
  JSON.stringify({ version })
);

console.log(`Generated version.json: ${version}`);
