// SPDX-License-Identifier: LicenseRef-Blockscout

const { favicons } = require('favicons');
const fs = require('fs/promises');
const path = require('path');

generateFavicons();

const isKeptImage = (name) => name === 'apple-touch-icon-180x180.png' || name === 'android-chrome-192x192.png' ||
  (!name.startsWith('apple-touch-icon') && !name.startsWith('android-chrome'));

async function writeOutput(result, outputDir) {
  await fs.mkdir(outputDir, { recursive: true });

  for (const image of result.images) {
    if (isKeptImage(image.name)) {
      await fs.writeFile(path.join(outputDir, image.name), image.contents);
    }

    // marketing assets reuse the 192px android icon under a stable name
    if (image.name === 'android-chrome-192x192.png') {
      await fs.writeFile(path.join(outputDir, 'logo-icon.png'), image.contents);
    }
  }

  for (const file of result.files) {
    if (file.name !== 'manifest.webmanifest') {
      await fs.writeFile(path.join(outputDir, file.name), file.contents);
    }
  }
}

async function generateFavicons() {
  console.log('Generating favicons...');
  const masterUrl = process.env.MASTER_URL;
  try {
    if (!masterUrl) {
      throw new Error('FAVICON_MASTER_URL or NEXT_PUBLIC_NETWORK_ICON must be set');
    }

    const response = await fetch(masterUrl);
    const buffer = await response.arrayBuffer();
    const source = Buffer.from(buffer);

    const configuration = {
      path: '/output',
      appName: 'Blockscout',
      icons: {
        android: true,
        appleIcon: {
          background: 'transparent',
        },
        appleStartup: false,
        favicons: true,
        windows: false,
        yandex: false,
      },
    };

    try {
      const result = await favicons(source, configuration);
      await writeOutput(result, path.resolve(process.cwd(), 'output'));

      console.log('Favicons generated successfully!');
    } catch (faviconError) {
      console.error('Error generating favicons:', faviconError);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error in favicon generation process:', error);
    process.exit(1);
  }
}
