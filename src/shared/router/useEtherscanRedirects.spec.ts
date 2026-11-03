// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, renderHook } from 'vitest/lib';
import { routerStandIn } from 'vitest/utils/routerStandIn';

import useEtherscanRedirects from './useEtherscanRedirects';

const HASH = '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859';

function mountAt(pathname: string, segmentHash: string, query: Record<string, string> = { hash: HASH }) {
  window.location.hash = segmentHash;
  routerStandIn.reset({ pathname, query });
  renderHook(() => useEtherscanRedirects(), { wrapper: routerStandIn.wrapper });
}

describe('useEtherscanRedirects', () => {
  afterEach(() => {
    cleanup();
    window.history.replaceState(null, '', '/');
  });

  it('turns an etherscan tx anchor into the matching tab', () => {
    mountAt('/tx/[hash]', '#eventlog');

    expect(routerStandIn.replace).toHaveBeenCalledTimes(1);
    expect(routerStandIn.replace).toHaveBeenCalledWith({ pathname: '/tx/[hash]', query: { hash: HASH, tab: 'logs' } });
  });

  it('turns an etherscan address anchor into the matching tab', () => {
    mountAt('/address/[hash]', '#writeContract');

    expect(routerStandIn.replace).toHaveBeenCalledWith({ pathname: '/address/[hash]', query: { hash: HASH, tab: 'write_contract' } });
  });

  it('turns the etherscan token balances anchor into the holders tab', () => {
    mountAt('/token/[hash]', '#balances');

    expect(routerStandIn.replace).toHaveBeenCalledWith({ pathname: '/token/[hash]', query: { hash: HASH, tab: 'holders' } });
  });

  it('turns the etherscan contracts stats anchor into the contracts section', () => {
    mountAt('/stats', '#section-contracts-data', {});

    expect(routerStandIn.replace).toHaveBeenCalledWith({ pathname: '/stats', hash: 'contracts' });
  });

  it.each([
    [ '/tx/[hash]', '#something-else', { hash: HASH } ],
    [ '/stats', '#eventlog', {} ],
    [ '/blocks', '#eventlog', {} ],
  ])('leaves an anchor it does not know alone (%s %s)', (pathname, segmentHash, query) => {
    mountAt(pathname, segmentHash, query);

    expect(routerStandIn.replace).not.toHaveBeenCalled();
  });

  it('does nothing without an anchor', () => {
    mountAt('/tx/[hash]', '');

    expect(routerStandIn.replace).not.toHaveBeenCalled();
  });
});
