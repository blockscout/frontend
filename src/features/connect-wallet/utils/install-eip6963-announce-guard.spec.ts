/** @vitest-environment jsdom */

import { describe, expect, it, vi } from 'vitest';

import { installEip6963AnnounceGuard } from './install-eip6963-announce-guard';

const ANNOUNCE_EVENT = 'eip6963:announceProvider';

describe('installEip6963AnnounceGuard', () => {
  it('stops malformed announce events reaching downstream listeners, and lets valid ones through', () => {
    // Guard must be installed first so its listener precedes the downstream one — the same ordering
    // it relies on against wagmi's mipd store in production.
    installEip6963AnnounceGuard();

    const downstream = vi.fn();
    window.addEventListener(ANNOUNCE_EVENT, downstream);

    window.dispatchEvent(new CustomEvent(ANNOUNCE_EVENT, { detail: null }));
    window.dispatchEvent(new CustomEvent(ANNOUNCE_EVENT, { detail: { provider: {} } }));
    window.dispatchEvent(new CustomEvent(ANNOUNCE_EVENT, { detail: { info: null, provider: {} } }));
    expect(downstream).not.toHaveBeenCalled();

    window.dispatchEvent(new CustomEvent(ANNOUNCE_EVENT, {
      detail: { info: { uuid: '1', name: 'MetaMask', icon: '', rdns: 'io.metamask' }, provider: {} },
    }));
    expect(downstream).toHaveBeenCalledTimes(1);

    window.removeEventListener(ANNOUNCE_EVENT, downstream);
  });
});
