// SPDX-License-Identifier: LicenseRef-Blockscout

import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { DownloadOptions } from './download';
import { downloadAssets } from './download';

const PNG = Buffer.from([ 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d ]);
const SVG = '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
const VAULT_SEAL_STATUS = '{"type":"shamir","sealed":false,"initialized":true}';

type Responder = (url: string, attempt: number) => Response;

let assetsDir: string;
let sourceDir: string;

const fetchWith = (responder: Responder): typeof globalThis.fetch => {
  const attempts = new Map<string, number>();
  const fetchDouble: typeof globalThis.fetch = async(input, init) => {
    const url = input instanceof URL ? input.href : String(input);
    const attempt = (attempts.get(url) ?? 0) + 1;
    attempts.set(url, attempt);
    const response = responder(url, attempt);
    const location = response.headers.get('location');
    return location !== null && init?.redirect !== 'manual' ? fetchDouble(location, init) : response;
  };
  return fetchDouble;
};

const routes = (table: ReadonlyArray<[ string, () => Response ]> = []): typeof globalThis.fetch => fetchWith((url) => {
  const respond = table.find(([ route ]) => route === url)?.[1];
  return respond ? respond() : new Response('not found', { status: 404 });
});

const run = async(envs: DownloadOptions['envs'], fetch: typeof globalThis.fetch = routes()) => {
  const lines: Array<string> = [];
  const report = await downloadAssets({ envs, assetsDir, fetch, retryDelay: 0, log: (line) => lines.push(line) });
  const failureLine = lines.find((line) => line.includes('[-]'));
  return { ...report, lines, failureLine, files: (await readdir(assetsDir)).sort() };
};

beforeEach(async() => {
  assetsDir = await mkdtemp(join(tmpdir(), 'assets-downloader-out-'));
  sourceDir = await mkdtemp(join(tmpdir(), 'assets-downloader-src-'));
});

afterEach(async() => {
  await rm(assetsDir, { recursive: true, force: true });
  await rm(sourceDir, { recursive: true, force: true });
});

describe('downloadAssets', () => {
  it('skips unset variables and reports nothing saved', async() => {
    const result = await run({ NEXT_PUBLIC_NETWORK_LOGO: '' });

    expect(result).toMatchObject({ saved: [], failed: [], files: [] });
    expect(result.lines).toContain('   [.] NEXT_PUBLIC_NETWORK_LOGO: Variable is not set. Skipping download.');
  });

  it('saves a fetched asset under the file name the app will request', async() => {
    const fetch = routes([
      [ 'https://example.com/images/Logo.PNG?v=2', () => new Response(PNG) ],
      [ 'https://example.com/config.json', () => new Response('[{"id":"app"}]') ],
    ]);

    const result = await run({
      NEXT_PUBLIC_NETWORK_LOGO: 'https://example.com/images/Logo.PNG?v=2',
      NEXT_PUBLIC_MARKETPLACE_CONFIG_URL: 'https://example.com/config.json',
    }, fetch);

    expect(result.failed).toEqual([]);
    expect(result.saved).toEqual([ 'NEXT_PUBLIC_MARKETPLACE_CONFIG_URL', 'NEXT_PUBLIC_NETWORK_LOGO' ]);
    expect(result.files).toEqual([ 'marketplace_config.json', 'network_logo.png' ]);
    expect(await readFile(join(assetsDir, 'network_logo.png'))).toEqual(PNG);
    expect(result.lines).toContain(
      `   [+] NEXT_PUBLIC_NETWORK_LOGO: Successfully saved file from https://example.com/images/Logo.PNG?v=2 to ${ join(assetsDir, 'network_logo.png') }.`,
    );
  });

  it('saves an image without a file extension under the bare name', async() => {
    const fetch = routes([ [ 'https://imagedelivery.net/abc/390b3c31/public', () => new Response(SVG) ] ]);

    const result = await run({ NEXT_PUBLIC_NETWORK_ICON: 'https://imagedelivery.net/abc/390b3c31/public' }, fetch);

    expect(result.files).toEqual([ 'network_icon' ]);
  });

  it('copies a file:// asset', async() => {
    const filePath = join(sourceDir, 'links.json');
    await writeFile(filePath, '[{"title":"Docs"}]');

    const result = await run({ NEXT_PUBLIC_FOOTER_LINKS: pathToFileURL(filePath).href });

    expect(result.saved).toEqual([ 'NEXT_PUBLIC_FOOTER_LINKS' ]);
    expect(await readFile(join(assetsDir, 'footer_links.json'), 'utf8')).toBe('[{"title":"Docs"}]');
  });

  it('writes a raw JSON value as a json file with double quotes', async() => {
    const result = await run({ NEXT_PUBLIC_FEATURED_NETWORKS: `[{'title':'Astar','url':'https://astar.blockscout.com/'}]` });

    expect(result.files).toEqual([ 'featured_networks.json' ]);
    expect(await readFile(join(assetsDir, 'featured_networks.json'), 'utf8')).toBe('[{"title":"Astar","url":"https://astar.blockscout.com/"}]');
  });

  it('does not save a JSON config whose content is not the expected shape', async() => {
    const fetch = routes([ [ 'http://10.42.4.28:8200/v1/sys/seal-status', () => new Response(VAULT_SEAL_STATUS) ] ]);

    const result = await run({ NEXT_PUBLIC_FEATURED_NETWORKS: 'http://10.42.4.28:8200/v1/sys/seal-status' }, fetch);

    expect(result.failed).toEqual([ 'NEXT_PUBLIC_FEATURED_NETWORKS' ]);
    expect(result.files).toEqual([]);
    expect(result.lines).toContain(
      '   [-] NEXT_PUBLIC_FEATURED_NETWORKS: rejected content from http://10.42.4.28:8200/v1/sys/seal-status: content is not a JSON array',
    );
  });

  it('does not save a file:// asset whose content is not an image', async() => {
    const filePath = join(sourceDir, 'passwd');
    await writeFile(filePath, 'root:x:0:0:root:/root:/bin/sh\n');

    const result = await run({ NEXT_PUBLIC_NETWORK_LOGO: pathToFileURL(filePath).href });

    expect(result.failed).toEqual([ 'NEXT_PUBLIC_NETWORK_LOGO' ]);
    expect(result.files).toEqual([]);
    expect(result.failureLine).toMatch(/^ {3}\[-\] NEXT_PUBLIC_NETWORK_LOGO: rejected content from file:\/\/.*: content is not a supported image/);
  });

  it('fails a missing file:// asset', async() => {
    const result = await run({ NEXT_PUBLIC_FOOTER_LINKS: pathToFileURL(join(sourceDir, 'missing.json')).href });

    expect(result.failed).toEqual([ 'NEXT_PUBLIC_FOOTER_LINKS' ]);
    expect(result.failureLine).toMatch(/^ {3}\[-\] NEXT_PUBLIC_FOOTER_LINKS: unable to read from file:\/\/.*missing\.json: ENOENT/);
  });

  it('fails a raw value that is neither a URL nor JSON', async() => {
    const result = await run({ NEXT_PUBLIC_FEATURED_NETWORKS: 'not a url' });

    expect(result.failed).toEqual([ 'NEXT_PUBLIC_FEATURED_NETWORKS' ]);
    expect(result.lines).toContain('   [-] NEXT_PUBLIC_FEATURED_NETWORKS: value is neither a URL nor a JSON document');
  });

  it.each([ 300, 302, 399 ])('does not follow a redirect (HTTP %i)', async(status) => {
    const fetch = routes([
      [ 'https://example.com/logo.svg', () => new Response(null, { status, headers: { location: 'http://10.43.0.1/' } }) ],
      [ 'http://10.43.0.1/', () => new Response(SVG) ],
    ]);

    const result = await run({ NEXT_PUBLIC_NETWORK_LOGO: 'https://example.com/logo.svg' }, fetch);

    expect(result.failed).toEqual([ 'NEXT_PUBLIC_NETWORK_LOGO' ]);
    expect(result.lines).toContain(
      `   [-] NEXT_PUBLIC_NETWORK_LOGO: unable to read from https://example.com/logo.svg: redirect (HTTP ${ status }) to "http://10.43.0.1/" is not followed`,
    );
  });

  it('retries a transient server error and saves the eventual response', async() => {
    const fetch = fetchWith((url, attempt) => attempt < 3 ? new Response('busy', { status: 503 }) : new Response(SVG));

    const result = await run({ NEXT_PUBLIC_NETWORK_LOGO: 'https://example.com/logo.svg' }, fetch);

    expect(result.saved).toEqual([ 'NEXT_PUBLIC_NETWORK_LOGO' ]);
    expect(result.files).toEqual([ 'network_logo.svg' ]);
  });

  it('succeeds on the last retry attempt', async() => {
    const fetch = fetchWith((url, attempt) => attempt < 4 ? new Response('busy', { status: 503 }) : new Response(SVG));

    const result = await run({ NEXT_PUBLIC_NETWORK_LOGO: 'https://example.com/logo.svg' }, fetch);

    expect(result.saved).toEqual([ 'NEXT_PUBLIC_NETWORK_LOGO' ]);
  });

  it('gives up after the retry budget on a persistent error', async() => {
    let calls = 0;
    const fetch = fetchWith(() => {
      calls++;
      return new Response('busy', { status: 503 });
    });

    const result = await run({ NEXT_PUBLIC_NETWORK_LOGO: 'https://example.com/logo.svg' }, fetch);

    expect(calls).toBe(4);
    expect(result.failed).toEqual([ 'NEXT_PUBLIC_NETWORK_LOGO' ]);
    expect(result.lines).toContain(
      '   [-] NEXT_PUBLIC_NETWORK_LOGO: unable to read from https://example.com/logo.svg: failed after 3 retry attempts (HTTP 503)',
    );
  });

  it.each([ 400, 404 ])('does not retry a client error (HTTP %i)', async(status) => {
    let calls = 0;
    const fetch = fetchWith(() => {
      calls++;
      return new Response('gone', { status });
    });

    const result = await run({ NEXT_PUBLIC_NETWORK_LOGO: 'https://example.com/logo.svg' }, fetch);

    expect(result.failed).toEqual([ 'NEXT_PUBLIC_NETWORK_LOGO' ]);
    expect(calls).toBe(1);
    expect(result.lines).toContain(`   [-] NEXT_PUBLIC_NETWORK_LOGO: unable to read from https://example.com/logo.svg: HTTP ${ status }`);
  });

  it('retries a network error', async() => {
    const fetch = fetchWith((url, attempt) => {
      if (attempt === 1) {
        throw new TypeError('fetch failed');
      }
      return new Response(SVG);
    });

    const result = await run({ NEXT_PUBLIC_NETWORK_LOGO: 'https://example.com/logo.svg' }, fetch);

    expect(result.saved).toEqual([ 'NEXT_PUBLIC_NETWORK_LOGO' ]);
  });

  it('keeps saving the other assets when one fails', async() => {
    const fetch = routes([
      [ 'https://example.com/logo.svg', () => new Response(VAULT_SEAL_STATUS) ],
      [ 'https://example.com/icon.png', () => new Response(PNG) ],
    ]);

    const result = await run({
      NEXT_PUBLIC_NETWORK_LOGO: 'https://example.com/logo.svg',
      NEXT_PUBLIC_NETWORK_ICON: 'https://example.com/icon.png',
    }, fetch);

    expect(result.failed).toEqual([ 'NEXT_PUBLIC_NETWORK_LOGO' ]);
    expect(result.saved).toEqual([ 'NEXT_PUBLIC_NETWORK_ICON' ]);
    expect(result.files).toEqual([ 'network_icon.png' ]);
  });
});
