// SPDX-License-Identifier: LicenseRef-Blockscout

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

import { buildExternalAssetFilePath } from 'src/config/utils/envs';

import { SECOND } from 'src/toolkit/utils/consts';

import type { AssetEnv } from './assets';
import { ASSET_ENVS } from './assets';
import { checkAssetContent } from './content';

const RETRY_ATTEMPTS = 3;
const REQUEST_TIMEOUT = 60 * SECOND;
const RETRYABLE_STATUSES: ReadonlySet<number> = new Set([ 408, 429, 500, 502, 503, 504 ]);

export const DEFAULT_RETRY_DELAY = 3 * SECOND;

export interface DownloadOptions {
  readonly envs: Readonly<Record<string, string | undefined>>;
  readonly assetsDir: string;
  readonly fetch: typeof globalThis.fetch;
  readonly retryDelay: number;
  readonly log: (line: string) => void;
}

export interface DownloadReport {
  readonly saved: ReadonlyArray<string>;
  readonly failed: ReadonlyArray<string>;
}

interface RemoteSource { readonly type: 'url'; readonly url: URL }
interface LocalFileSource { readonly type: 'local-file'; readonly url: URL }
interface RawJsonSource { readonly type: 'raw-json' }
type AssetSource = RemoteSource | LocalFileSource | RawJsonSource;

type ReadResult = { readonly ok: true; readonly content: Buffer } | { readonly ok: false; readonly reason: string };

class NonRetryableError extends Error {}

const parseUrl = (value: string): URL | undefined => {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
};

const resolveSource = (value: string): AssetSource => {
  const url = parseUrl(value);
  if (!url) {
    return { type: 'raw-json' };
  }
  return url.protocol === 'file:' ? { type: 'local-file', url } : { type: 'url', url };
};

const describeSource = (source: AssetSource): string => source.type === 'raw-json' ? 'raw input' : source.url.href;

const isRedirect = (status: number): boolean => status >= 300 && status < 400;

const errorMessage = (error: unknown): string => error instanceof Error ? error.message : String(error);

async function fetchOnce(url: URL, fetch: typeof globalThis.fetch): Promise<Buffer> {
  const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(REQUEST_TIMEOUT) });
  if (isRedirect(response.status)) {
    throw new NonRetryableError(`redirect (HTTP ${ response.status }) to "${ response.headers.get('location') ?? '' }" is not followed`);
  }
  if (!response.ok) {
    const message = `HTTP ${ response.status }`;
    throw RETRYABLE_STATUSES.has(response.status) ? new Error(message) : new NonRetryableError(message);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function fetchWithRetries(url: URL, options: DownloadOptions): Promise<ReadResult> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= RETRY_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      await sleep(options.retryDelay);
    }
    try {
      return { ok: true, content: await fetchOnce(url, options.fetch) };
    } catch (error) {
      if (error instanceof NonRetryableError) {
        return { ok: false, reason: error.message };
      }
      lastError = error;
    }
  }
  return { ok: false, reason: `failed after ${ RETRY_ATTEMPTS } retry attempts (${ errorMessage(lastError) })` };
}

async function readLocalFile(url: URL): Promise<ReadResult> {
  try {
    return { ok: true, content: await readFile(fileURLToPath(url)) };
  } catch (error) {
    return { ok: false, reason: errorMessage(error) };
  }
}

function readContent(source: AssetSource, value: string, options: DownloadOptions): Promise<ReadResult> {
  switch (source.type) {
    case 'url':
      return fetchWithRetries(source.url, options);
    case 'local-file':
      return readLocalFile(source.url);
    case 'raw-json':
      return Promise.resolve({ ok: true, content: Buffer.from(value, 'utf8') });
  }
}

const fileExtensionOf = (fileName: string): string | undefined => extname(fileName).slice(1) || undefined;

async function processAsset(asset: AssetEnv, value: string, options: DownloadOptions): Promise<ReadResult> {
  const normalizedValue = value.replaceAll('\'', '"');
  const source = resolveSource(normalizedValue);
  const assetPath = buildExternalAssetFilePath(asset.envName, normalizedValue);
  if (assetPath === undefined) {
    return { ok: false, reason: 'value is neither a URL nor a JSON document' };
  }
  const fileName = basename(assetPath);

  const result = await readContent(source, normalizedValue, options);
  if (!result.ok) {
    return { ok: false, reason: `unable to read from ${ describeSource(source) }: ${ result.reason }` };
  }

  const check = checkAssetContent(asset.kind, result.content, fileExtensionOf(fileName));
  if (!check.ok) {
    return { ok: false, reason: `rejected content from ${ describeSource(source) }: ${ check.reason }` };
  }

  const destination = join(options.assetsDir, fileName);
  await writeFile(destination, result.content);
  options.log(`   [+] ${ asset.envName }: Successfully saved file from ${ describeSource(source) } to ${ destination }.`);
  return result;
}

export async function downloadAssets(options: DownloadOptions): Promise<DownloadReport> {
  await mkdir(options.assetsDir, { recursive: true });
  const saved: Array<string> = [];
  const failed: Array<string> = [];

  for (const asset of ASSET_ENVS) {
    const value = options.envs[asset.envName];
    if (!value) {
      options.log(`   [.] ${ asset.envName }: Variable is not set. Skipping download.`);
      continue;
    }
    const result = await processAsset(asset, value, options);
    if (result.ok) {
      saved.push(asset.envName);
    } else {
      failed.push(asset.envName);
      options.log(`   [-] ${ asset.envName }: ${ result.reason }`);
    }
  }

  return { saved, failed };
}
