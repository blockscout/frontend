// @vitest-environment jsdom

import { useRouter } from 'next/router';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, cleanup } from 'vitest/lib';

import { routerStandIn } from './routerStandIn';

vi.mock('next/router', () => import('./routerStandIn').then((m) => m.nextRouterModule));

beforeEach(() => {
  routerStandIn.reset({ pathname: '/blocks', query: { tab: 'txs' } });
});

afterEach(cleanup);

function renderRouterConsumer() {
  let renderCount = 0;
  const hook = renderHook(() => {
    renderCount++;
    return useRouter();
  });
  return { ...hook, getRenderCount: () => renderCount };
}

it('installs as next/router and exposes the reset location', () => {
  const { result } = renderRouterConsumer();

  expect(result.current.pathname).toBe('/blocks');
  expect(result.current.query).toEqual({ tab: 'txs' });
  expect(result.current.asPath).toBe('/blocks?tab=txs');
  expect(result.current.isReady).toBe(true);
});

describe('push', () => {
  it('replaces the query, re-renders consumers and resolves', async() => {
    const { result, getRenderCount } = renderRouterConsumer();

    let resolved: boolean | undefined;
    await act(async() => {
      resolved = await result.current.push({ pathname: '/blocks', query: { page: '2' } }, undefined, { shallow: true });
    });

    expect(resolved).toBe(true);
    expect(getRenderCount()).toBe(2);
    expect(result.current.query).toEqual({ page: '2' });
    expect(routerStandIn.query).toEqual({ page: '2' });
    expect(routerStandIn.push).toHaveBeenCalledTimes(1);
  });

  it('resolves only after consumers have rendered the new location', async() => {
    const { result } = renderRouterConsumer();
    let queryWhenResolved: unknown;

    await act(async() => {
      await result.current.push({ pathname: '/blocks', query: { page: '3' } });
      queryWhenResolved = result.current.query;
    });

    expect(queryWhenResolved).toEqual({ page: '3' });
  });

  it('accepts a string url and keeps the pathname when the url object omits it', async() => {
    const { result } = renderRouterConsumer();

    await act(async() => {
      await routerStandIn.push('/txs?filter=from&sort=val-desc');
    });
    expect(result.current.pathname).toBe('/txs');
    expect(result.current.query).toEqual({ filter: 'from', sort: 'val-desc' });

    await act(async() => {
      await routerStandIn.push({ query: { page: 2, items: [ 'a', 'b' ], skipped: undefined } });
    });
    expect(result.current.pathname).toBe('/txs');
    expect(result.current.query).toEqual({ page: '2', items: [ 'a', 'b' ] });
  });

  it('resolves even when nothing renders useRouter', async() => {
    await expect(routerStandIn.push({ pathname: '/', query: {} })).resolves.toBe(true);
    expect(routerStandIn.query).toEqual({});
  });
});

describe('setQuery', () => {
  it('re-renders consumers without counting as a push', () => {
    const { result, getRenderCount } = renderRouterConsumer();

    act(() => {
      routerStandIn.setQuery({ tab: 'internal_txs' });
    });

    expect(getRenderCount()).toBe(2);
    expect(result.current.query).toEqual({ tab: 'internal_txs' });
    expect(routerStandIn.push).not.toHaveBeenCalled();
  });
});

describe('router identity', () => {
  it('is stable across unrelated re-renders and changes on navigation', async() => {
    const { result, rerender } = renderRouterConsumer();
    const initial = result.current;

    rerender();
    expect(result.current).toBe(initial);
    expect(result.current.query).toBe(initial.query);

    await act(async() => {
      await result.current.push({ pathname: '/blocks', query: { page: '2' } });
    });
    expect(result.current).not.toBe(initial);
  });
});

describe('reset', () => {
  it('clears push history and re-renders consumers with the new location', async() => {
    const { result } = renderRouterConsumer();
    await act(async() => {
      await result.current.push({ pathname: '/blocks', query: { page: '2' } });
    });

    act(() => {
      routerStandIn.reset();
    });

    expect(routerStandIn.push).not.toHaveBeenCalled();
    expect(result.current.pathname).toBe('/');
    expect(result.current.query).toEqual({});
  });
});

it('re-renders every mounted consumer', async() => {
  const first = renderRouterConsumer();
  const second = renderRouterConsumer();

  await act(async() => {
    await first.result.current.push({ pathname: '/blocks', query: { page: '5' } });
  });

  expect(first.getRenderCount()).toBe(2);
  expect(second.getRenderCount()).toBe(2);
  expect(second.result.current.query).toEqual({ page: '5' });
});
