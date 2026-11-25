// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import { STORAGE_KEY } from './consts';
import { SERVICES_NAMES } from './services';

const ENVS: Array<[ string, string ]> = [ [ 'NEXT_PUBLIC_USERCENTRICS_CONFIG', '{"rulesetId":"test-ruleset"}' ] ];

function emitUserConsent(isGiven: boolean): void {
  const services = Object.fromEntries(SERVICES_NAMES.map((name, index) => [
    `service-${ index }`,
    { name, consent: { given: isGiven, type: 'EXPLICIT' } },
  ]));
  window.dispatchEvent(new CustomEvent('UC_CONSENT', { detail: { consent: { fromUserAction: true }, services } }));
}

function storedConsentValues(): Array<boolean> {
  return Object.values(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, boolean>);
}

async function withConsentHook(run: () => void): Promise<void> {
  await withEnvs(ENVS, async() => {
    const { renderHook } = await import('vitest/lib');
    const { 'default': useUpdateUsercentricsConsent } = await import('./useUpdateUsercentricsConsent');
    const { unmount } = renderHook(() => useUpdateUsercentricsConsent());
    run();
    unmount();
  });
}

describe('useUpdateUsercentricsConsent', () => {
  const reload = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('location', { ...window.location, reload });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    reload.mockReset();
    window.localStorage.clear();
  });

  it('accepting all on the first visit stores the consent without reloading the page', async() => {
    await withConsentHook(() => emitUserConsent(true));

    expect(storedConsentValues()).toEqual(Array(SERVICES_NAMES.length).fill(true));
    expect(reload).not.toHaveBeenCalled();
  });

  it('denying all on the first visit stores the consent and reloads the page', async() => {
    await withConsentHook(() => emitUserConsent(false));

    expect(storedConsentValues()).toEqual(Array(SERVICES_NAMES.length).fill(false));
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('accepting all after an earlier denial reloads the page', async() => {
    await withConsentHook(() => emitUserConsent(false));
    reload.mockReset();

    await withConsentHook(() => emitUserConsent(true));

    expect(storedConsentValues()).toEqual(Array(SERVICES_NAMES.length).fill(true));
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('repeating the stored choice does not reload the page', async() => {
    await withConsentHook(() => emitUserConsent(false));
    reload.mockReset();

    await withConsentHook(() => emitUserConsent(false));

    expect(reload).not.toHaveBeenCalled();
  });
});
