// SPDX-License-Identifier: LicenseRef-Blockscout

import type { GetServerSidePropsContext } from 'next';

import { beforeEach, describe, expect, it, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const UUID_PATTERN = /^[0-9a-f-]{36}$/;

const BROWSER_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36';
const CRAWLER_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36 ' +
  '(compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const SLACK_APP_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Slack/4.41.105 Chrome/130.0.0.0 ' +
  'Electron/33.2.0 Safari/537.36 Sonic Slack_SSB/4.41.105';

const BROWSER_HEADERS = {
  'user-agent': BROWSER_USER_AGENT,
  'accept-language': 'en-US,en;q=0.9',
  'sec-fetch-mode': 'navigate',
};

interface ContextOptions {
  readonly cookie?: string;
  readonly headers?: Record<string, string>;
}

function makeContext({ cookie, headers = BROWSER_HEADERS }: ContextOptions = {}) {
  const setHeader = vi.fn();
  const context = {
    req: { headers: { ...(cookie ? { cookie } : {}), ...headers } },
    res: { getHeader: () => undefined, setHeader },
    query: { tab: 'txs' },
  } as unknown as GetServerSidePropsContext;
  return { context, setHeader };
}

async function runBase(envs: Array<[ string, string ]>, context: GetServerSidePropsContext) {
  return withEnvs(envs, async() => {
    const handlers = await import('./handlers');
    return handlers.base(context);
  });
}

describe('base handler', () => {
  beforeEach(() => {
    vi.stubEnv('DISABLE_TRACKING', 'false');
  });

  it('issues a long-lived uuid cookie to a first-time visitor', async() => {
    const { context, setHeader } = makeContext();

    const result = await runBase([ [ 'NEXT_PUBLIC_APP_PROTOCOL', 'https' ] ], context);

    const [ header, value ] = setHeader.mock.calls[0];
    expect(header).toBe('Set-Cookie');
    expect(value).toMatch(/^uuid=[0-9a-f-]{36}; Path=\/; Max-Age=31536000; Secure$/);
    expect(result).toMatchObject({ props: { uuid: expect.stringMatching(UUID_PATTERN) } });
  });

  it('omits the Secure flag when the app is served over http', async() => {
    const { context, setHeader } = makeContext();

    await runBase([ [ 'NEXT_PUBLIC_APP_PROTOCOL', 'http' ] ], context);

    expect(setHeader.mock.calls[0][1]).toMatch(/^uuid=[0-9a-f-]{36}; Path=\/; Max-Age=31536000$/);
  });

  it('keeps the uuid of a returning visitor and sets no cookie', async() => {
    const { context, setHeader } = makeContext({ cookie: 'uuid=existing-uuid; foo=bar' });

    const result = await runBase([], context);

    expect(setHeader).not.toHaveBeenCalled();
    expect(result).toMatchObject({ props: { uuid: 'existing-uuid', cookies: 'uuid=existing-uuid; foo=bar' } });
  });

  it('neither identifies nor pings the pageview monitor in private mode', async() => {
    const { context, setHeader } = makeContext({ headers: { ...BROWSER_HEADERS, 'x-app-profile': 'private' } });

    const result = await runBase([], context);

    expect(setHeader).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toMatchObject({ props: { uuid: undefined } });
  });

  it('pings the pageview monitor with the visitor uuid for a real browser', async() => {
    const { context } = makeContext({ cookie: 'uuid=existing-uuid', headers: { ...BROWSER_HEADERS, host: 'eth.blockscout.com' } });

    await runBase([], context);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [ url, init ] = fetchMock.mock.calls[0];
    expect(url).toBe('https://monitor.blockscout.com/count');
    expect(JSON.parse(String(init?.body))).toMatchObject({ hostname: 'eth.blockscout.com', uuid: 'existing-uuid' });
  });

  it('skips the pageview ping for a crawler', async() => {
    const { context } = makeContext({ cookie: 'uuid=existing-uuid', headers: { ...BROWSER_HEADERS, 'user-agent': CRAWLER_USER_AGENT } });

    await runBase([], context);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('skips the pageview ping for a known bot that otherwise looks like a real browser', async() => {
    const { context } = makeContext({ cookie: 'uuid=existing-uuid', headers: { ...BROWSER_HEADERS, 'user-agent': SLACK_APP_USER_AGENT } });

    await runBase([], context);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('skips the pageview ping for a client that sends a browser user agent without the other headers of a browser', async() => {
    const { context } = makeContext({ cookie: 'uuid=existing-uuid', headers: { 'user-agent': BROWSER_USER_AGENT } });

    await runBase([], context);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('skips the pageview ping when tracking is disabled', async() => {
    vi.stubEnv('DISABLE_TRACKING', 'true');
    const { context } = makeContext({ cookie: 'uuid=existing-uuid' });

    await runBase([], context);

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
