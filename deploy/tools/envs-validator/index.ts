/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import type { ValidationError } from 'yup';

import { buildExternalAssetFilePath } from '../../../configs/app/utils';
import schema from './schema';

const silent = process.argv.includes('--silent');

run();

async function run() {
  !silent && console.log();
  try {
    const appEnvs = Object.entries(process.env)
      .filter(([ key ]) => key.startsWith('NEXT_PUBLIC_'))
      .reduce((result, [ key, value ]) => {
        result[key] = value || '';
        return result;
      }, {} as Record<string, string>);

    await checkPlaceholdersCongruity(appEnvs);
    await validateEnvs(appEnvs);

  } catch (error) {
    process.exit(1);
  }
}

async function validateEnvs(appEnvs: Record<string, string>) {
  !silent && console.log(`🌀 Validating ENV variables values...`);

  try {
    // replace ENVs with external JSON files content
    const envsWithJsonConfig = [
      'NEXT_PUBLIC_FEATURED_NETWORKS',
      'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL',
      'NEXT_PUBLIC_FOOTER_LINKS',
    ];

    for await (const envName of envsWithJsonConfig) {
      appEnvs[envName] = await(appEnvs[envName] ? getExternalJsonContent(envName) : Promise.resolve()) || '[]';
    }

    await schema.validate(appEnvs, { stripUnknown: false, abortEarly: false });
    !silent && console.log('👍 All good!');
  } catch (_error) {
    if (typeof _error === 'object' && _error !== null && 'errors' in _error) {
      console.log('🚨 ENVs validation failed with the following errors:');
      (_error as ValidationError).errors.forEach((error) => {
        console.log('    ', error);
      });
    } else {
      console.log('🚨 Unexpected error occurred during validation.');
      console.error(_error);
    }

    throw _error;
  }

  !silent && console.log();
}

async function getExternalJsonContent(envName: string): Promise<string | void> {
  return new Promise((resolve, reject) => {
    const fileName = `./public${ buildExternalAssetFilePath(envName, 'https://foo.bar/baz.json') }`;

    fs.readFile(path.resolve(__dirname, fileName), 'utf8', (err, data) => {
      if (err) {
        console.log(`🚨 Unable to read file: ${ fileName }`);
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}

async function checkPlaceholdersCongruity(envsMap: Record<string, string>) {
  try {
    !silent && console.log(`🌀 Checking environment variables and their placeholders congruity...`);

    const runTimeEnvs = await getEnvsPlaceholders(path.resolve(__dirname, '.env.registry'));
    const buildTimeEnvs = await getEnvsPlaceholders(path.resolve(__dirname, '.env'));
    const envs = Object.keys(envsMap).filter((env) => !buildTimeEnvs.includes(env));

    const inconsistencies: Array<string> = [];
    for (const env of envs) {
      const hasPlaceholder = runTimeEnvs.includes(env);
      if (!hasPlaceholder) {
        inconsistencies.push(env);
      }
    }

    if (inconsistencies.length > 0) {
      console.log('🚸 For the following environment variables placeholders were not generated at build-time:');
      inconsistencies.forEach((env) => {
        console.log(`     ${ env }`);
      });
      console.log(`   They are either deprecated or running the app with them may lead to unexpected behavior. 
   Please check the documentation for more details - https://github.com/blockscout/frontend/blob/main/docs/ENVS.md
      `);
      throw new Error();
    }

    !silent && console.log('👍 All good!\n');
  } catch (error) {
    console.log('🚨 Congruity check failed.\n');
    throw error;
  }
}

function getEnvsPlaceholders(filePath: string): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.log(`🚨 Unable to read placeholders file.`);
        reject(err);
        return;
      }

      const lines = data.split('\n');
      const variables = lines.map(line => {
        const variable = line.split('=')[0];
        return variable.trim();
      });

      resolve(variables.filter(Boolean));
    });
  });
}
