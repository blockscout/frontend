// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';
import { renderHook } from 'vitest/lib';

vi.mock('helia', () => {
  throw new TypeError('Cannot assign to read only property \'name\' of function \'class InsufficientProvidersError\'');
});

describe('useLoadImageViaIpfs', () => {
  it('rejects the IPFS load instead of failing its importer when the helia stack cannot be evaluated', async() => {
    const { 'default': useLoadImageViaIpfs } = await import('./useLoadImageViaIpfs');
    const { result } = renderHook(() => useLoadImageViaIpfs());

    await expect(result.current('ipfs://bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy')).rejects.toThrow();
  });
});
