import config from 'configs/app';
import { writeFileSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateProApi } from './generate-pro-api';
import { generateStandard } from './generate-standard';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);
const outputDir = resolvePath(currentDir, '../../../../public');
const outputFile = resolvePath(outputDir, 'llms.txt');

function run(): void {
    try {
        if (config.features.multichain.isEnabled) {
            console.log('⏭️ Skipping llms.txt generation for multichain explorer');
            return;
        }

        const accountFeature = config.features.account;
        const isInProApi = accountFeature.isEnabled && accountFeature.apiKeysButton === false;
        const mode = isInProApi ? 'PRO API' : 'standard';

        console.log(`🌀 Generating llms.txt (${ mode } mode)...`);

        const content = isInProApi ? generateProApi() : generateStandard();
        writeFileSync(outputFile, content);

        console.log('👍 Done!\n');
    } catch (error) {
        console.error('🚨 Error generating llms.txt:', error);
        console.log('\n');
        process.exit(1);
    }
}

run();
