import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('./public');

async function optimizeImage(filePath, maxDimension, quality = 82) {
  try {
    if (!fs.existsSync(filePath)) return;
    const image = await Jimp.read(filePath);
    const origWidth = image.width;
    const origHeight = image.height;
    
    let resized = false;
    if (origWidth > maxDimension || origHeight > maxDimension) {
      if (origWidth > origHeight) {
        image.resize({ w: maxDimension });
      } else {
        image.resize({ h: maxDimension });
      }
      resized = true;
    }

    const statBefore = fs.statSync(filePath).size;
    
    // Quality compression
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') {
      const buffer = await image.getBuffer('image/jpeg', { quality });
      fs.writeFileSync(filePath, buffer);
    } else if (ext === '.png') {
      const buffer = await image.getBuffer('image/png');
      fs.writeFileSync(filePath, buffer);
    }

    const statAfter = fs.statSync(filePath).size;
    console.log(`Optimized ${path.basename(filePath)}: ${(statBefore/1024).toFixed(1)}KB -> ${(statAfter/1024).toFixed(1)}KB (Resized: ${resized})`);
  } catch (err) {
    console.warn(`Could not optimize ${filePath}:`, err.message);
  }
}

async function run() {
  console.log('⚡ Starting Image Optimization for Mobile & Desktop Performance...');
  
  // Doctor PNG cutouts (Target <= 700px dimension)
  await optimizeImage(path.join(publicDir, 'dr-naveen-shamnur.png'), 700);
  await optimizeImage(path.join(publicDir, 'dr-sunitha-shamnur.png'), 700);
  await optimizeImage(path.join(publicDir, 'ss-dental-logo-full.png'), 600);
  await optimizeImage(path.join(publicDir, '3d-tooth.png'), 600);

  // Background JPEGs
  await optimizeImage(path.join(publicDir, 'hero-bg.jpg'), 1400, 75);
  await optimizeImage(path.join(publicDir, 'hero-bg-mobile.jpg'), 750, 75);
  await optimizeImage(path.join(publicDir, 'clinic-interior.jpg'), 1000, 80);
  await optimizeImage(path.join(publicDir, 'clinic-map.jpg'), 800, 80);
  await optimizeImage(path.join(publicDir, 'whatsapp-booking-dentist.jpg'), 800, 80);

  // Service images
  const servicesDir = path.join(publicDir, 'services');
  if (fs.existsSync(servicesDir)) {
    const files = fs.readdirSync(servicesDir);
    for (const f of files) {
      if (f.endsWith('.jpg') || f.endsWith('.png')) {
        await optimizeImage(path.join(servicesDir, f), 600, 80);
      }
    }
  }

  console.log('✅ Image optimization complete!');
}

run();
