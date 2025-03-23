// This script generates PNG icons from the SVG source file
// Install dependencies: npm install sharp fs-extra

const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const sizes = [16, 48, 128];
const srcFile = path.join(__dirname, '../icons/icon.svg');
const outputDir = path.join(__dirname, '../icons');

async function generateIcons() {
  console.log('Generating icons from:', srcFile);
  
  // Ensure the output directory exists
  await fs.ensureDir(outputDir);
  
  // Read the SVG file
  const svgBuffer = await fs.readFile(srcFile);
  
  // Generate PNG files for each size
  for (const size of sizes) {
    const outputFile = path.join(outputDir, `icon${size}.png`);
    
    console.log(`Creating ${size}x${size} icon at: ${outputFile}`);
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputFile);
  }
  
  console.log('Icon generation complete!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
}); 