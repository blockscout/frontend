// SPDX-License-Identifier: LicenseRef-Blockscout

import type { GetServerSidePropsContext } from 'next';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const realBrowser = vi.hoisted(() => ({
  isLikelyHumanBrowser: vi.fn(() => true),
  isKnownBotRequest: vi.fn(() => false),
}));
vi.mock('../utils/checkRealBrowser', () => realBrowser);

const UUID_PATTERN = /^[0-9a-f-]{36}$/;

interface ContextOptions {
  readonly cookie?: string;
  readonly headers?: Record<string, string>;
}

function makeContext({ cookie, headers = {} }: ContextOptions = {}) {
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
  const fetchMock = vi.fn(() => Promise.resolve(new Response()));

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('DISABLE_TRACKING', 'false');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.clearAllMocks();
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
    const { context, setHeader } = makeContext({ headers: { 'x-app-profile': 'private' } });

    const result = await runBase([], context);

    expect(setHeader).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toMatchObject({ props: { uuid: undefined } });
  });

  it('pings the pageview monitor with the visitor uuid for a real browser', async() => {
    const { context } = makeContext({ cookie: 'uuid=existing-uuid', headers: { host: 'eth.blockscout.com' } });

    await runBase([], context);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [ url, init ] = fetchMock.mock.calls[0] as unknown as [ string, RequestInit ];
    expect(url).toBe('https://monitor.blockscout.com/count');
    expect(JSON.parse(String(init.body))).toMatchObject({ hostname: 'eth.blockscout.com', uuid: 'existing-uuid' });
  });

  it('skips the pageview ping for a bot', async() => {
    realBrowser.isKnownBotRequest.mockReturnValueOnce(true);
    const { context } = makeContext({ cookie: 'uuid=existing-uuid' });

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
