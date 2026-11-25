// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import { STORAGE_KEY } from './consts';
import { CONSENT_RESULT_ALL_ACCEPTED, CONSENT_RESULT_ALL_DENIED, SERVICES } from './services';

const ENVS: Array<[ string, string ]> = [
  [ 'NEXT_PUBLIC_USERCENTRICS_CONFIG', JSON.stringify({ rulesetId: 'test-ruleset' }) ],
];

function dispatchUserChoice(given: boolean) {
  const services = Object.fromEntries(
    Object.values(SERVICES).map(({ name }) => [ name, { name, consent: { given, type: 'EXPLICIT' } } ]),
  );
  window.dispatchEvent(new CustomEvent('UC_CONSENT', { detail: { consent: { fromUserAction: true }, services } }));
}

async function renderOnPage(run: () => void) {
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
    window.localStorage.removeItem(STORAGE_KEY);
    reload.mockReset();
  });

  it('reloads the page to start the services when the user accepts them on a first visit', async() => {
    await renderOnPage(() => dispatchUserChoice(true));

    expect(reload).toHaveBeenCalledTimes(1);
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '')).toEqual(CONSENT_RESULT_ALL_ACCEPTED);
  });

  it('stores a first-visit rejection without reloading, since nothing is running yet', async() => {
    await renderOnPage(() => dispatchUserChoice(false));

    expect(reload).not.toHaveBeenCalled();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '')).toEqual(CONSENT_RESULT_ALL_DENIED);
  });

  it('reloads the page to stop the services when the user withdraws an earlier consent', async() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(CONSENT_RESULT_ALL_ACCEPTED));

    await renderOnPage(() => dispatchUserChoice(false));

    expect(reload).toHaveBeenCalledTimes(1);
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '')).toEqual(CONSENT_RESULT_ALL_DENIED);
  });

  it('does not reload when the user repeats the choice the page already runs with', async() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(CONSENT_RESULT_ALL_ACCEPTED));

    await renderOnPage(() => dispatchUserChoice(true));

    expect(reload).not.toHaveBeenCalled();
  });
});
