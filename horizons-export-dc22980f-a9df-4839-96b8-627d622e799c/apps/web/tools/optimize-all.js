import fs from 'fs';
import path from 'path';
import { Jimp } from 'jimp';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const servicesDir = path.join(publicDir, 'services');
const srcDir = path.join(rootDir, 'src');

// Map of conversions to track replacements in code
const conversionMap = new Map();

async function optimizeImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const basename = path.basename(filePath);
    
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return;
    }

    const stats = fs.statSync(filePath);
    console.log(`Processing ${path.relative(rootDir, filePath)} (${(stats.size / 1024).toFixed(1)} KB)...`);
    
    const image = await Jimp.read(filePath);
    const width = image.width;
    const height = image.height;

    // 1. Determine destination path and format
    let destPath = filePath;
    let targetMime = image.mime;
    let quality = 75;
    let maxDim = 1000;

    if (basename === '3d-tooth.png') {
      // Keep as PNG due to transparency, but resize
      maxDim = 400;
    } else if (ext === '.png') {
      // Convert all other PNGs to JPG
      const destName = basename.substring(0, basename.length - 4) + '.jpg';
      destPath = path.join(path.dirname(filePath), destName);
      targetMime = 'image/jpeg';
      
      const relativeSrc = '/' + path.relative(publicDir, filePath).replace(/\\/g, '/');
      const relativeDest = '/' + path.relative(publicDir, destPath).replace(/\\/g, '/');
      conversionMap.set(relativeSrc, relativeDest);
    }

    if (filePath.includes('services')) {
      maxDim = 800;
    }

    // 2. Resize if needed
    let needsResize = false;
    let newWidth = width;
    let newHeight = height;

    if (width > maxDim || height > maxDim) {
      needsResize = true;
      if (width > height) {
        newWidth = maxDim;
        newHeight = Math.round((height * maxDim) / width);
      } else {
        newHeight = maxDim;
        newWidth = Math.round((width * maxDim) / height);
      }
    }

    if (needsResize) {
      console.log(`  Resizing from ${width}x${height} to ${newWidth}x${newHeight}`);
      image.resize({ w: newWidth, h: newHeight });
    }

    // 3. Write image with quality settings
    if (targetMime === 'image/jpeg') {
      await image.write(destPath, { quality });
    } else {
      await image.write(destPath);
    }

    const newStats = fs.statSync(destPath);
    console.log(`  Saved to ${path.relative(rootDir, destPath)} (${(newStats.size / 1024).toFixed(1)} KB, Reduced by ${((1 - newStats.size / stats.size) * 100).toFixed(1)}%)`);

    // 4. Delete old PNG file if it was converted to JPG
    if (destPath !== filePath) {
      fs.unlinkSync(filePath);
      console.log(`  Deleted old file: ${path.relative(rootDir, filePath)}`);
    }
  } catch (error) {
    console.error(`  Error processing ${filePath}:`, error);
  }
}

// Recursively find all files in a directory
function getFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

// Replace string occurrences in src files
function updateSourceFiles() {
  console.log('\nUpdating source files with new image paths...');
  const files = getFilesRecursively(srcDir);
  
  // Custom manual replacements that were already there
  conversionMap.set('/services/aligners.png', '/services/aligners.jpg');
  conversionMap.set('/services/braces-hq.png', '/services/braces.jpg');

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext !== '.jsx' && ext !== '.js' && ext !== '.css') {
      continue;
    }

    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    for (const [oldPath, newPath] of conversionMap.entries()) {
      if (content.includes(oldPath)) {
        console.log(`  Replacing ${oldPath} -> ${newPath} in ${path.relative(rootDir, file)}`);
        // Use global replacement
        content = content.split(oldPath).join(newPath);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
    }
  }
}

async function main() {
  console.log('--- STARTING IMAGE OPTIMIZATION ---');
  
  // Process public root images
  const publicFiles = fs.readdirSync(publicDir);
  for (const file of publicFiles) {
    const filePath = path.join(publicDir, file);
    if (fs.statSync(filePath).isFile()) {
      await optimizeImage(filePath);
    }
  }

  // Process services images
  if (fs.existsSync(servicesDir)) {
    const servicesFiles = fs.readdirSync(servicesDir);
    for (const file of servicesFiles) {
      const filePath = path.join(servicesDir, file);
      if (fs.statSync(filePath).isFile()) {
        await optimizeImage(filePath);
      }
    }
  }

  // Update JSX/JS/CSS files
  updateSourceFiles();
  
  console.log('\n--- IMAGE OPTIMIZATION COMPLETED SUCCESSFULLY ---');
}

main().catch(console.error);
