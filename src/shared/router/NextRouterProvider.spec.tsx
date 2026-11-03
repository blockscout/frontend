// @vitest-environment jsdom

import React from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, renderHook } from 'vitest/lib';

import NextRouterProvider from './NextRouterProvider';
import { usePathname } from './usePathname';
import { useRouter } from './useRouter';

const { nextRouter } = vi.hoisted(() => ({
  nextRouter: {
    query: { hash: '0xabc' },
    pathname: '/tx/[hash]',
    asPath: '/tx/0xabc',
    push: vi.fn(() => Promise.resolve(true)),
    replace: vi.fn(() => Promise.resolve(true)),
  },
}));

vi.mock('next/router', () => ({ useRouter: () => nextRouter }));
vi.mock('next/navigation', () => ({ usePathname: () => '/tx/0xabc' }));

const wrapper = ({ children }: { children: React.ReactNode }) => <NextRouterProvider>{ children }</NextRouterProvider>;

describe('NextRouterProvider', () => {
  afterEach(() => {
    cleanup();
    nextRouter.push.mockClear();
    nextRouter.replace.mockClear();
  });

  it('exposes the Next.js router members through the facade', () => {
    const { result } = renderHook(() => ({ router: useRouter(), pathname: usePathname() }), { wrapper });

    expect(result.current.router.query).toEqual({ hash: '0xabc' });
    expect(result.current.router.pathname).toBe('/tx/[hash]');
    expect(result.current.router.asPath).toBe('/tx/0xabc');
    expect(result.current.pathname).toBe('/tx/0xabc');
  });

  it('maps push(url, options) onto the Next.js (url, as, options) signature', async() => {
    const { result } = renderHook(() => useRouter(), { wrapper });

    await expect(result.current.push({ pathname: '/blocks' }, { shallow: true })).resolves.toBe(true);
    await expect(result.current.push('/txs')).resolves.toBe(true);

    expect(nextRouter.push).toHaveBeenNthCalledWith(1, { pathname: '/blocks' }, undefined, { shallow: true });
    expect(nextRouter.push).toHaveBeenNthCalledWith(2, '/txs', undefined, undefined);
  });

  it('maps replace(url, options) the same way', async() => {
    const { result } = renderHook(() => useRouter(), { wrapper });

    await expect(result.current.replace({ pathname: '/stats' }, { scroll: false, shallow: true })).resolves.toBe(true);

    expect(nextRouter.replace).toHaveBeenCalledWith({ pathname: '/stats' }, undefined, { scroll: false, shallow: true });
  });
});
