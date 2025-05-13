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

    printDeprecationWarning(appEnvs);
    await checkPlaceholdersCongruity(appEnvs);
    checkDeprecatedEnvs(appEnvs);
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
      'NEXT_PUBLIC_MARKETPLACE_CATEGORIES_URL',
      'NEXT_PUBLIC_MARKETPLACE_SECURITY_REPORTS_URL',
      'NEXT_PUBLIC_MARKETPLACE_GRAPH_LINKS_URL',
      'NEXT_PUBLIC_FOOTER_LINKS',
    ];

    for await (const envName of envsWithJsonConfig) {
      if (appEnvs[envName]) {
        appEnvs[envName] = await getExternalJsonContent(envName) || '[]';
      }
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

function printDeprecationWarning(envsMap: Record<string, string>) {
  if (envsMap.NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY && envsMap.NEXT_PUBLIC_RE_CAPTCHA_V3_APP_SITE_KEY) {
    // eslint-disable-next-line max-len
    console.warn('❗ The NEXT_PUBLIC_RE_CAPTCHA_V3_APP_SITE_KEY variable is now deprecated and will be removed in the next release. Please migrate to the NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY variable.');
  }

  if (
    (envsMap.NEXT_PUBLIC_SENTRY_DSN || envsMap.SENTRY_CSP_REPORT_URI || envsMap.NEXT_PUBLIC_SENTRY_ENABLE_TRACING) &&
    envsMap.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN
  ) {
    // eslint-disable-next-line max-len
    console.warn('❗ The Sentry monitoring is now deprecated and will be removed in the next release. Please migrate to the Rollbar error monitoring.');
  }

  if (
    envsMap.NEXT_PUBLIC_ROLLUP_PARENT_CHAIN_NAME ||
    envsMap.NEXT_PUBLIC_ROLLUP_L1_BASE_URL
  ) {
    // eslint-disable-next-line max-len
    console.warn('❗ The NEXT_PUBLIC_ROLLUP_L1_BASE_URL and NEXT_PUBLIC_ROLLUP_PARENT_CHAIN_NAME variables are now deprecated and will be removed in the next release. Please migrate to the NEXT_PUBLIC_ROLLUP_PARENT_CHAIN variable.');
  }

  if (
    envsMap.NEXT_PUBLIC_HOMEPAGE_PLATE_TEXT_COLOR ||
    envsMap.NEXT_PUBLIC_HOMEPAGE_PLATE_BACKGROUND
  ) {
    // eslint-disable-next-line max-len
    console.warn('❗ The NEXT_PUBLIC_HOMEPAGE_PLATE_TEXT_COLOR and NEXT_PUBLIC_HOMEPAGE_PLATE_BACKGROUND variables are now deprecated and will be removed in the next release. Please migrate to the NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG variable.');
  }

  if (
    envsMap.NEXT_PUBLIC_AUTH0_CLIENT_ID ||
    envsMap.NEXT_PUBLIC_AUTH_URL ||
    envsMap.NEXT_PUBLIC_LOGOUT_URL
  ) {
    // eslint-disable-next-line max-len
    console.warn('❗ The NEXT_PUBLIC_AUTH0_CLIENT_ID, NEXT_PUBLIC_AUTH_URL and NEXT_PUBLIC_LOGOUT_URL variables are now deprecated and will be removed in the next release.');
  }
}

function checkDeprecatedEnvs(envsMap: Record<string, string>) {
  !silent && console.log(`🌀 Checking deprecated environment variables...`);

  if (!envsMap.NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY && envsMap.NEXT_PUBLIC_RE_CAPTCHA_V3_APP_SITE_KEY) {
    // eslint-disable-next-line max-len
    console.log('🚨 The NEXT_PUBLIC_RE_CAPTCHA_V3_APP_SITE_KEY variable is no longer supported. Please pass NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY or remove it completely.');
    throw new Error();
  }

  if (
    (envsMap.NEXT_PUBLIC_SENTRY_DSN || envsMap.SENTRY_CSP_REPORT_URI || envsMap.NEXT_PUBLIC_SENTRY_ENABLE_TRACING) &&
    !envsMap.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN
  ) {
    // eslint-disable-next-line max-len
    console.log('🚨 The Sentry error monitoring is no longer supported. Please migrate to the Rollbar error monitoring.');
    throw new Error();
  }

  !silent && console.log('👍 All good!\n');
}
