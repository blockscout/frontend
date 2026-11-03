// @vitest-environment jsdom

import { cleanup, renderHook } from '@testing-library/react';
import React from 'react';

import type { RouterContextValue } from 'src/toolkit/router/types';

import { RouterProvider } from 'src/toolkit/router/context';
import { DefaultLink } from 'src/toolkit/router/defaults';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { usePathname } from './usePathname';
import { useRouter } from './useRouter';

const buildWrapper = (value: RouterContextValue) => ({ children }: { children: React.ReactNode }) => (
  <RouterProvider value={ value }>{ children }</RouterProvider>
);

const contextValue: RouterContextValue = {
  Link: DefaultLink,
  router: {
    query: { hash: '0xabc', tab: [ 'txs', 'logs' ], missing: undefined },
    pathname: '/tx/[hash]',
    asPath: '/tx/0xabc?tab=txs&tab=logs',
    push: vi.fn(() => Promise.resolve(true)),
    replace: vi.fn(() => Promise.resolve(true)),
  },
  pathname: '/tx/0xabc',
};

describe('useRouter', () => {
  afterEach(cleanup);

  it('reads the string, array and absent query params the provider carries', () => {
    const { result } = renderHook(() => useRouter(), { wrapper: buildWrapper(contextValue) });

    expect(result.current.query.hash).toBe('0xabc');
    expect(result.current.query.tab).toEqual([ 'txs', 'logs' ]);
    expect(result.current.query.missing).toBeUndefined();
    expect(result.current.query.unknown).toBeUndefined();
    expect(result.current.pathname).toBe('/tx/[hash]');
    expect(result.current.asPath).toBe('/tx/0xabc?tab=txs&tab=logs');
  });

  it('hands push and replace to the provided router with the url and options as given', async() => {
    const { result } = renderHook(() => useRouter(), { wrapper: buildWrapper(contextValue) });

    await expect(result.current.push({ pathname: '/blocks' }, { shallow: true })).resolves.toBe(true);
    await expect(result.current.replace('/txs?page=2', { scroll: false })).resolves.toBe(true);

    expect(contextValue.router.push).toHaveBeenCalledWith({ pathname: '/blocks' }, { shallow: true });
    expect(contextValue.router.replace).toHaveBeenCalledWith('/txs?page=2', { scroll: false });
  });

  it('falls back to an empty, no-op router without a provider', async() => {
    const { result } = renderHook(() => useRouter());

    expect(result.current.query).toEqual({});
    expect(result.current.pathname).toBe('');
    expect(result.current.asPath).toBe('');
    await expect(result.current.push({ pathname: '/blocks' })).resolves.toBe(false);
    await expect(result.current.replace({ pathname: '/blocks' })).resolves.toBe(false);
  });
});

describe('usePathname', () => {
  afterEach(cleanup);

  it('returns the browser pathname the provider carries', () => {
    const { result } = renderHook(() => usePathname(), { wrapper: buildWrapper(contextValue) });

    expect(result.current).toBe('/tx/0xabc');
  });

  it('is null without a provider', () => {
    const { result } = renderHook(() => usePathname());

    expect(result.current).toBeNull();
  });
});
