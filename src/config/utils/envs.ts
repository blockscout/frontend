// SPDX-License-Identifier: LicenseRef-Blockscout

import { isBrowser } from 'src/toolkit/utils/isBrowser';
import * as regexp from 'src/toolkit/utils/regexp';

export const replaceQuotes = (value: string | undefined) => value?.replaceAll('\'', '"');

export const getEnvValue = (envName: string) => {
  // eslint-disable-next-line no-restricted-properties
  const envs = (isBrowser() ? window.__envs : process.env) ?? {};

  if (isBrowser() && envs.NEXT_PUBLIC_APP_INSTANCE === 'pw') {
    const storageValue = localStorage.getItem(envName);

    if (typeof storageValue === 'string') {
      return storageValue;
    }
  }

  return replaceQuotes(envs[envName]);
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
  const fileName = name.replace(/^NEXT_PUBLIC_/, '').replace(/_URL$/, '').toLowerCase();
  const url = parseUrl(value);

  if (!url) {
    return parseEnvJson(value) ? `/assets/configs/${ fileName }.json` : undefined;
  }

  // Must mirror get_target_filename() in deploy/scripts/download_assets.sh: a URL whose path has no
  // file extension (e.g. Cloudflare Images "…/<id>/public") is saved under the bare file name.
  const fileExtension = url.pathname.match(regexp.FILE_EXTENSION)?.[1]?.toLowerCase();
  return fileExtension ? `/assets/configs/${ fileName }.${ fileExtension }` : `/assets/configs/${ fileName }`;
};

function parseUrl(value: string): URL | undefined {
  try {
    return new URL(value);
  } catch (error) {
    return;
  }
}
