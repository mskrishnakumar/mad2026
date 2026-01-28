import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

async function generateIcons() {
  const inputImage = join(rootDir, 'public/images/logo-hands.jpg');
  const outputDir = join(rootDir, 'public/icons');

  // Ensure output directory exists
  await mkdir(outputDir, { recursive: true });

  const sizes = [192, 512];

  for (const size of sizes) {
    await sharp(inputImage)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(join(outputDir, `icon-${size}x${size}.png`));

    console.log(`Generated icon-${size}x${size}.png`);
  }

  // Generate Apple touch icon (180x180)
  await sharp(inputImage)
    .resize(180, 180, {
      fit: 'cover',
      position: 'center'
    })
    .png()
    .toFile(join(outputDir, 'apple-touch-icon.png'));

  console.log('Generated apple-touch-icon.png');

  // Generate favicon (32x32)
  await sharp(inputImage)
    .resize(32, 32, {
      fit: 'cover',
      position: 'center'
    })
    .png()
    .toFile(join(outputDir, 'favicon-32x32.png'));

  console.log('Generated favicon-32x32.png');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
