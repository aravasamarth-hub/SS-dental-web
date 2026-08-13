const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

async function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (/\.(jpe?g|png)$/i.test(item) && !item.includes('-opt') && !item.includes('.tmp')) {
      try {
        const oldSize = stat.size;
        if (oldSize < 20000) continue; // Skip small icons under 20KB

        const image = await Jimp.read(fullPath);
        
        // Resize if excessively large width
        if (image.width > 1400) {
          image.resize({ w: 1400 });
        }

        const ext = path.extname(item).toLowerCase();
        const tempPath = fullPath.replace(/\.(jpe?g|png)$/i, `.opt${ext}`);
        
        await image.write(tempPath, { quality: 75 });
        
        const newSize = fs.statSync(tempPath).size;
        if (newSize < oldSize) {
          fs.unlinkSync(fullPath);
          fs.renameSync(tempPath, fullPath);
          console.log(`Optimized ${item}: ${(oldSize/1024).toFixed(1)}KB -> ${(newSize/1024).toFixed(1)}KB (-${((1 - newSize/oldSize)*100).toFixed(0)}%)`);
        } else {
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
          console.log(`Skipped ${item}: original was smaller`);
        }
      } catch (err) {
        console.error(`Error processing ${item}:`, err.message);
      }
    }
  }
}

console.log('🚀 Starting image optimization...');
processDirectory(publicDir).then(() => console.log('✅ Image optimization complete!'));
