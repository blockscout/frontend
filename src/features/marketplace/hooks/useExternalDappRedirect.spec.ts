// @vitest-environment jsdom

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from 'vitest/lib';

import { useExternalDappRedirect } from './useExternalDappRedirect';

const DAPP_URL = 'https://app.uniswap.org/?utm_source=Blockscout';

const replace = vi.fn();

beforeEach(() => {
  vi.stubGlobal('location', { ...window.location, replace });
});

afterEach(() => {
  vi.unstubAllGlobals();
  replace.mockReset();
});

describe('useExternalDappRedirect', () => {
  it('sends the user to the dapp URL when the dapp is external', () => {
    renderHook(() => useExternalDappRedirect(DAPP_URL, true));

    expect(replace).toHaveBeenCalledWith(DAPP_URL);
  });

  it('keeps the user on the page when the dapp is embedded', () => {
    renderHook(() => useExternalDappRedirect(DAPP_URL, false));

    expect(replace).not.toHaveBeenCalled();
  });

  it('waits for the dapp URL before redirecting', () => {
    const { rerender } = renderHook(({ url }) => useExternalDappRedirect(url, true), { initialProps: { url: undefined as string | undefined } });
    expect(replace).not.toHaveBeenCalled();

    rerender({ url: DAPP_URL });
    expect(replace).toHaveBeenCalledWith(DAPP_URL);
  });
});
