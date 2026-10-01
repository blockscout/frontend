// SPDX-License-Identifier: LicenseRef-Blockscout

/* eslint-disable no-console -- this is a CLI; console is its output channel */
import { readFile } from 'node:fs/promises';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildExternalAssetFilePath } from 'src/config/utils/envs';

import type { CheckReport, EnvMap } from './checks';
import { ENVS_WITH_JSON_CONFIG, findEnvsWithoutPlaceholder, pickAppEnvs, runChecks } from './checks';
import { parseEnvNames } from './registry';

const distDir = dirname(fileURLToPath(import.meta.url));
const silent = process.argv.includes('--silent');

const log = (message: string): void => {
  if (!silent) {
    console.log(message);
  }
};

main();

async function main(): Promise<void> {
  log('');
  try {
    const envs = pickAppEnvs(process.env);
    const registryNames = parseEnvNames(await readRootFile('.env.registry'));
    const buildTimeNames = parseEnvNames(await readRootFile('.env'));
    // A missing JSON-config file must not pre-empt the placeholder report, so the files are only
    // read once every variable is known to have a placeholder.
    const hasPlaceholderErrors = findEnvsWithoutPlaceholder(envs, registryNames, buildTimeNames).length > 0;
    const jsonConfigs = hasPlaceholderErrors ? {} : await readJsonConfigs(envs);

    const report = runChecks({ envs, registryNames, buildTimeNames, jsonConfigs });
    printReport(report);
    process.exit(report.ok ? 0 : 1);
  } catch (error) {
    console.log('🚨 Unexpected error occurred during validation.');
    console.error(error);
    process.exit(1);
  }
}

function printReport(report: CheckReport): void {
  report.deprecationWarnings.forEach((warning) => console.warn(`❗ ${ warning }`));

  log('🌀 Checking environment variables and their placeholders congruity...');
  if (report.placeholderErrors.length > 0) {
    console.log('🚸 For the following environment variables placeholders were not generated at build-time:');
    report.placeholderErrors.forEach((name) => console.log(`     ${ name }`));
    console.log(`   They are either deprecated or running the app with them may lead to unexpected behavior.
   Please check the documentation for more details - https://github.com/blockscout/frontend/blob/main/docs/ENVS.md
      `);
    console.log('🚨 Congruity check failed.\n');
    return;
  }
  log('👍 All good!\n');

  log('🌀 Validating ENV variables values...');
  if (report.validationErrors.length > 0) {
    console.log('🚨 ENVs validation failed with the following errors:');
    report.validationErrors.forEach((error) => console.log('    ', error));
    return;
  }
  log('👍 All good!\n');
}

async function readRootFile(fileName: string): Promise<string> {
  try {
    return await readFile(resolvePath(distDir, '..', fileName), 'utf8');
  } catch (error) {
    console.log(`🚨 Unable to read file: ${ fileName }`);
    throw error;
  }
}

async function readJsonConfigs(envs: EnvMap): Promise<Record<string, string>> {
  const configs: Record<string, string> = {};
  for (const name of ENVS_WITH_JSON_CONFIG) {
    if (envs[name]) {
      configs[name] = await readRootFile(`./public${ buildExternalAssetFilePath(name, 'https://foo.bar/baz.json') }`);
    }
  }
  return configs;
}
