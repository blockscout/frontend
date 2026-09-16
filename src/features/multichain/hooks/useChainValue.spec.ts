// @vitest-environment jsdom

import { chainA, chainB } from 'src/features/multichain/mocks/chains';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, cleanup } from 'vitest/lib';
import { routerStandIn } from 'vitest/utils/routerStandIn';

const { mockScrollToTop } = vi.hoisted(() => ({
  mockScrollToTop: vi.fn(),
}));

vi.mock('next/router', () => import('vitest/utils/routerStandIn').then((m) => m.nextRouterModule));
vi.mock('react-scroll', () => ({ animateScroll: { scrollToTop: mockScrollToTop } }));
vi.mock('src/features/multichain/chains-config', () => ({
  'default': () => ({ chains: [ chainA, chainB ] }),
}));

import { useChainValue } from './useChainValue';

const ENCODED_CURSOR = encodeURIComponent(JSON.stringify({ block_number: 11, index: 12, items_count: 13 }));

beforeEach(() => {
  mockScrollToTop.mockClear();
  routerStandIn.reset({ pathname: '/address/[hash]', query: { hash: '0x1' } });
});

afterEach(cleanup);

describe('useChainValue', () => {
  describe('derives the value from the URL', () => {
    it('reads chain_id and resolves its config', () => {
      routerStandIn.setQuery({ hash: '0x1', chain_id: chainB.id });

      const { result } = renderHook(() => useChainValue());

      expect(result.current.chainValue).toEqual([ chainB.id ]);
      expect(result.current.chain).toBe(chainB);
    });

    it('falls back to the first configured chain when the URL names none', () => {
      const { result } = renderHook(() => useChainValue());

      expect(result.current.chainValue).toEqual([ chainA.id ]);
      expect(result.current.chain).toBe(chainA);
    });

    it('falls back to the first available chain when chainIds restrict the choice', () => {
      const { result } = renderHook(() => useChainValue({ chainIds: [ chainB.id ] }));

      expect(result.current.chainValue).toEqual([ chainB.id ]);
      expect(result.current.chain).toBe(chainB);
    });

    it('ignores a chain_id that is not configured', () => {
      routerStandIn.setQuery({ hash: '0x1', chain_id: '999' });

      const { result } = renderHook(() => useChainValue());

      expect(result.current.chainValue).toEqual([ chainA.id ]);
    });

    it('selects "all" with no chain config when the all option is allowed and the URL names no chain', () => {
      const { result } = renderHook(() => useChainValue({ withAllOption: true }));

      expect(result.current.chainValue).toEqual([ 'all' ]);
      expect(result.current.chain).toBeUndefined();
    });

    it('follows an external URL change without a handler call', () => {
      const { result } = renderHook(() => useChainValue());

      act(() => {
        routerStandIn.setQuery({ hash: '0x1', chain_id: chainB.id });
      });

      expect(result.current.chainValue).toEqual([ chainB.id ]);
      expect(result.current.chain).toBe(chainB);
    });
  });

  describe('onChainValueChange', () => {
    it('pushes chain_id, strips the page params and keeps the rest of the query', async() => {
      routerStandIn.setQuery({ hash: '0x1', tab: 'txs', filter: 'from', page: '3', next_page_params: ENCODED_CURSOR });
      const { result } = renderHook(() => useChainValue());

      await act(async() => {
        result.current.onChainValueChange({ value: [ chainB.id ] });
      });

      expect(routerStandIn.push).toHaveBeenCalledTimes(1);
      expect(routerStandIn.push).toHaveBeenCalledWith(expect.anything(), undefined, { shallow: true });
      expect(routerStandIn.query).toEqual({ hash: '0x1', tab: 'txs', filter: 'from', chain_id: chainB.id });
      expect(result.current.chainValue).toEqual([ chainB.id ]);
      expect(result.current.chain).toBe(chainB);
    });

    it('scrolls to the top when leaving a deeper page', async() => {
      routerStandIn.setQuery({ hash: '0x1', page: '3', next_page_params: ENCODED_CURSOR });
      const { result } = renderHook(() => useChainValue());

      await act(async() => {
        result.current.onChainValueChange({ value: [ chainB.id ] });
      });

      expect(mockScrollToTop).toHaveBeenCalledTimes(1);
    });

    it('does not scroll when already on the first page', async() => {
      const { result } = renderHook(() => useChainValue());

      await act(async() => {
        result.current.onChainValueChange({ value: [ chainB.id ] });
      });

      expect(mockScrollToTop).not.toHaveBeenCalled();
    });

    it('scrolls to the given element instead of the window', async() => {
      routerStandIn.setQuery({ hash: '0x1', page: '2', next_page_params: ENCODED_CURSOR });
      const scrollIntoView = vi.fn();
      const scrollRef = { current: { scrollIntoView } as unknown as HTMLDivElement };
      const { result } = renderHook(() => useChainValue({ scrollRef }));

      await act(async() => {
        result.current.onChainValueChange({ value: [ chainB.id ] });
      });

      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(mockScrollToTop).not.toHaveBeenCalled();
    });
  });

  describe('referential stability', () => {
    it('keeps the result and handler across a re-render with the same URL', () => {
      const { result, rerender } = renderHook(() => useChainValue());
      const before = result.current;

      rerender();

      expect(result.current).toBe(before);
    });

    it('keeps the handler when the chain changes and reads the latest router from it', async() => {
      const { result } = renderHook(() => useChainValue());
      const handlerBefore = result.current.onChainValueChange;

      await act(async() => {
        routerStandIn.setQuery({ hash: '0x1', tab: 'logs' });
      });
      expect(result.current.onChainValueChange).toBe(handlerBefore);

      await act(async() => {
        handlerBefore({ value: [ chainB.id ] });
      });

      expect(routerStandIn.query).toEqual({ hash: '0x1', tab: 'logs', chain_id: chainB.id });
      expect(result.current.onChainValueChange).toBe(handlerBefore);
    });
  });
});
