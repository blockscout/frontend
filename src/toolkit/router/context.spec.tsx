// @vitest-environment jsdom

// The toolkit is exercised outside the app provider stack on purpose: `vitest/lib` mounts the Next adapter,
// and the no-provider defaults are what is under test here.

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import type { RouterContextValue, RouterLinkProps } from './types';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Link } from '../chakra/link';
import { Provider as ChakraProvider } from '../chakra/provider';
import { RoutedTabs } from '../components/RoutedTabs/index';
import { RouterProvider } from './context';
import { defaultRouterContextValue } from './defaults';
import { formatUrl } from './format-url';

const renderInChakra = (ui: React.ReactElement) => render(<ChakraProvider>{ ui }</ChakraProvider>);

const InjectedLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(
  function InjectedLink({ href, scroll, shallow, prefetch, children, ...rest }, ref) {
    return (
      <a
        ref={ ref }
        data-testid="injected-link"
        data-scroll={ String(scroll) }
        data-shallow={ String(shallow) }
        data-prefetch={ String(prefetch) }
        href={ formatUrl(href) }
        { ...rest }
      >
        { children }
      </a>
    );
  },
);

const buildContextValue = (overrides: Partial<RouterContextValue> = {}): RouterContextValue => ({
  ...defaultRouterContextValue,
  Link: InjectedLink,
  ...overrides,
});

const TABS = [
  { id: 'first', title: 'First', component: <div>first content</div> },
  { id: 'second', title: 'Second', component: <div>second content</div> },
];

describe('toolkit router context', () => {
  afterEach(cleanup);

  describe('without a provider', () => {
    it('Link renders a plain anchor with the string href', () => {
      renderInChakra(<Link href="/blocks">Blocks</Link>);

      const anchor = screen.getByRole('link', { name: 'Blocks' });
      expect(anchor.tagName).toBe('A');
      expect(anchor.getAttribute('href')).toBe('/blocks');
      expect(screen.queryByTestId('injected-link')).toBeNull();
    });

    it('Link stringifies an object href', () => {
      renderInChakra(
        <Link href={{ pathname: '/txs', query: { tab: 'internal', ids: [ '1', '2' ], skipped: undefined }, hash: 'top' } as never}>
          Txs
        </Link>,
      );

      expect(screen.getByRole('link', { name: 'Txs' }).getAttribute('href')).toBe('/txs?tab=internal&ids=1&ids=2#top');
    });

    it('RoutedTabs mounts over the no-op router and a tab click leaves the URL-driven tab in place', () => {
      renderInChakra(<RoutedTabs tabs={ TABS }/>);

      fireEvent.click(screen.getByRole('tab', { name: 'Second' }));

      expect(screen.getByRole('tab', { name: 'First' }).getAttribute('aria-selected')).toBe('true');
      expect(screen.getByRole('tab', { name: 'Second' }).getAttribute('aria-selected')).toBe('false');
      expect(screen.getByText('first content')).toBeDefined();
    });
  });

  describe('with a provider', () => {
    it('Link renders the injected component and forwards href and navigation props', () => {
      renderInChakra(
        <RouterProvider value={ buildContextValue() }>
          <Link href="/address/0x1" scroll={ false } shallow prefetch>Address</Link>
        </RouterProvider>,
      );

      const anchor = screen.getByTestId('injected-link');
      expect(anchor.getAttribute('href')).toBe('/address/0x1');
      expect(anchor.getAttribute('data-scroll')).toBe('false');
      expect(anchor.getAttribute('data-shallow')).toBe('true');
      expect(anchor.getAttribute('data-prefetch')).toBe('true');
      expect(anchor.textContent).toBe('Address');
    });

    it('Link applies the toolkit defaults for scroll, shallow and prefetch', () => {
      renderInChakra(
        <RouterProvider value={ buildContextValue() }>
          <Link href="/blocks">Blocks</Link>
        </RouterProvider>,
      );

      const anchor = screen.getByTestId('injected-link');
      expect(anchor.getAttribute('data-scroll')).toBe('true');
      expect(anchor.getAttribute('data-shallow')).toBe('false');
      expect(anchor.getAttribute('data-prefetch')).toBe('false');
    });

    it('an external Link bypasses the injected component', () => {
      renderInChakra(
        <RouterProvider value={ buildContextValue() }>
          <Link href="https://example.com" external>Docs</Link>
        </RouterProvider>,
      );

      expect(screen.queryByTestId('injected-link')).toBeNull();
      expect(screen.getByRole('link', { name: /Docs/ }).getAttribute('target')).toBe('_blank');
    });

    it('RoutedTabs pushes a shallow tab change through the injected router', async() => {
      const push = vi.fn(() => Promise.resolve(true));
      const value = buildContextValue({
        router: { query: { hash: '0x1', page: '2' }, pathname: '/address/[hash]', asPath: '/address/0x1?page=2', push, replace: push },
      });

      renderInChakra(
        <RouterProvider value={ value }>
          <RoutedTabs tabs={ TABS } preservedParams={ [ 'page' ] }/>
        </RouterProvider>,
      );

      fireEvent.click(screen.getByRole('tab', { name: 'Second' }));

      await waitFor(() => expect(push).toHaveBeenCalledTimes(1));
      expect(push).toHaveBeenCalledWith(
        { pathname: '/address/[hash]', query: { hash: '0x1', page: '2', tab: 'second' } },
        { shallow: true },
      );
    });
  });
});
