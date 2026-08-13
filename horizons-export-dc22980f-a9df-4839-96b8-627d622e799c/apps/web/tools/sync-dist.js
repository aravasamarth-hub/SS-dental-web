/**
 * sync-dist.js
 *
 * Copies the built output from apps/web/dist to dist/apps/web in the monorepo root.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '..', 'dist');
const destDir = path.join(__dirname, '..', '..', '..', 'dist', 'apps', 'web');

if (fs.existsSync(srcDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  fs.cpSync(srcDir, destDir, { recursive: true });
  console.log(`Successfully synced build to ${destDir}`);
} else {
  console.error(`Source directory ${srcDir} does not exist.`);
}
