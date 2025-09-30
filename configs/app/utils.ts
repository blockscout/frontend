import { DEVNET_EXPLORER_HOST, DEVNET_EXPLORER_URL } from '@fluent.xyz/sdk-core/dist/config/devnet-config';
import { TESTNET_EXPLORER_HOST, TESTNET_EXPLORER_URL } from '@fluent.xyz/sdk-core/dist/config/testnet-config';

import { isBrowser } from 'toolkit/utils/isBrowser';
import * as regexp from 'toolkit/utils/regexp';

export const replaceQuotes = (value: string | undefined) => value?.replaceAll('\'', '"');

export const getEnvValue = (envName: string) => {
  let envs: Record<string, string | undefined> = {};

  if (isBrowser()) {

    const windowEnvs = (window as unknown as { __envs?: Record<string, string | undefined> }).__envs;
    envs = windowEnvs ?? {};

    if (envs.NEXT_PUBLIC_APP_INSTANCE === 'pw') {
      const storageValue = localStorage.getItem(envName);
      if (typeof storageValue === 'string') {
        return storageValue;
      }
    }
  } else {
    // eslint-disable-next-line no-restricted-properties
    envs = process.env as unknown as Record<string, string | undefined>;
  }

  return replaceQuotes(envs[envName]);
};

export const getApiHost = () => {
  const env = getEnvValue('NEXT_PUBLIC_CHAIN');
  const value = env === 'devnet' ? DEVNET_EXPLORER_HOST : TESTNET_EXPLORER_HOST;

  return value;
};

export const getStatsApiHost = () => {
  const env = getEnvValue('NEXT_PUBLIC_CHAIN');
  const value = env === 'devnet' ? DEVNET_EXPLORER_URL : TESTNET_EXPLORER_URL;

  return value + ':8080';
};

export const getVisualizeApiHost = () => {
  const env = getEnvValue('NEXT_PUBLIC_CHAIN');
  const value = env === 'devnet' ? DEVNET_EXPLORER_URL : TESTNET_EXPLORER_URL;

  return value + ':8081';
};

export const parseEnvJson = <DataType>(env: string | undefined): DataType | null => {
  try {
    return JSON.parse(env || 'null') as DataType | null;
  } catch (error) {
    return null;
  }
};

export const getExternalAssetFilePath = (envName: string) => {
  const parsedValue = getEnvValue(envName);

  if (!parsedValue) {
    return;
  }

  return buildExternalAssetFilePath(envName, parsedValue);
};

export const buildExternalAssetFilePath = (name: string, value: string) => {
  try {
    const fileName = name.replace(/^NEXT_PUBLIC_/, '').replace(/_URL$/, '').toLowerCase();

    const fileExtension = getAssetFileExtension(value);
    if (!fileExtension) {
      throw new Error('Cannot get file path');
    }
    return `/assets/configs/${ fileName }.${ fileExtension }`;
  } catch (error) {
    return;
  }
};

function getAssetFileExtension(value: string) {
  try {
    const url = new URL(value);
    return url.pathname.match(regexp.FILE_EXTENSION)?.[1];
  } catch (error) {
    return parseEnvJson(value) ? 'json' : undefined;
  }
}
