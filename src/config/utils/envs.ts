// SPDX-License-Identifier: LicenseRef-Blockscout

import { isBrowser } from 'src/toolkit/utils/isBrowser';
import * as regexp from 'src/toolkit/utils/regexp';

export const replaceQuotes = (value: string | undefined) => value?.replaceAll('\'', '"');

type EnvRead = { readonly value: string | undefined; readonly isFromTestStorage: boolean };

const readEnv = (envName: string): EnvRead => {
  // eslint-disable-next-line no-restricted-properties
  const envs = (isBrowser() ? window.__envs : process.env) ?? {};

  if (isBrowser() && envs.NEXT_PUBLIC_APP_INSTANCE === 'pw') {
    const storageValue = localStorage.getItem(envName);

    if (typeof storageValue === 'string') {
      return { value: storageValue, isFromTestStorage: true };
    }
  }

  return { value: envs[envName], isFromTestStorage: false };
};

export const getEnvValue = (envName: string): string | undefined => {
  const { value, isFromTestStorage } = readEnv(envName);
  return isFromTestStorage ? value : replaceQuotes(value);
};

export const getRawEnvValue = (envName: string): string | undefined => readEnv(envName).value;

export const parseEnvJson = <DataType>(env: string | undefined): DataType | null => {
  try {
    return JSON.parse(env || 'null') as DataType | null;
  } catch (error) {
    return null;
  }
};

// HTML is rendered as set: the quote rewrite of getEnvValue would turn an apostrophe or a single-quoted
// attribute value into a double quote.
export const getEnvHtmlValue = (envName: string): string | undefined => getRawEnvValue(envName);

// A JSON list of HTML items is parsed as set first, since the quote rewrite breaks an item with an apostrophe
// or a single-quoted attribute; the rewritten form keeps the `['a','b']` syntax working. Anything else is one item.
export const parseEnvHtmlList = (value: string | undefined): Array<string> => {
  if (!value) {
    return [];
  }

  const parsed = parseEnvJson<unknown>(value) ?? parseEnvJson<unknown>(replaceQuotes(value));

  return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [ value ];
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

  // deploy/tools/assets-downloader saves the file under this same name; a URL whose path has no
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
