// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as tokenMock from 'src/slices/token/mocks/info';

import { MultichainContext } from 'src/features/multichain/context';
import * as clusterChains from 'src/features/multichain/mocks/chains';

import type { EntityChain } from 'src/shared/entities/resolve-entity-link';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';
import { getCssText } from 'vitest/utils/cssText';

import TokenEntity, * as TokenEntityParts from './TokenEntity';

const token = tokenMock.tokenInfo;
const HASH = token.address_hash;

const externalChain: EntityChain = {
  id: '8453',
  name: 'Base',
  logo: 'https://example.com/base.png',
  explorer_url: 'https://basescan.org',
  route_templates: { token: '/asset/{hash}' },
};

const getLink = () => screen.getByRole('link');
const queryCopy = () => screen.queryByRole('button', { name: 'copy' });
const getTokenLogo = () => document.querySelector(`img[alt="${ token.name } logo"]`);
const queryShield = () => document.querySelector(`img:not([alt="${ token.name } logo"])`);

describe('TokenEntity', () => {
  afterEach(cleanup);

  describe('default component', () => {
    it('renders the logo, the linked name, the symbol and the copy button', () => {
      render(<TokenEntity token={ token }/>);

      expect(getLink()).toHaveProperty('href', `http://localhost:3000/token/${ HASH }`);
      expect(getTokenLogo()?.getAttribute('src')).toBe(token.icon_url);
      expect(screen.getByText(token.name as string)).toBeTruthy();
      expect(screen.getByText(token.symbol as string)).toBeTruthy();
      expect(queryCopy()).not.toBeNull();
    });

    it('truncates the name at the tail by default', () => {
      render(<TokenEntity token={ token }/>);

      expect(getCssText(screen.getByText(token.name as string))).toContain('text-overflow:ellipsis');
    });

    it('lets the caller choose the truncation', () => {
      const name = 'This token is the best token ever';
      render(<TokenEntity token={{ ...token, name }} truncation="constant"/>);

      expect(screen.queryByText(name)).toBeNull();
      expect(screen.getByText(name.slice(0, 4), { exact: false })).toBeTruthy();
    });

    it('rounds the logo of an ERC-20 token and squares the others', () => {
      const { unmount } = render(<TokenEntity token={ token }/>);
      expect(getCssText(getTokenLogo() as Element)).toContain('border-radius:var(--chakra-radii-full)');
      unmount();

      render(<TokenEntity token={{ ...token, type: 'ERC-721' }}/>);
      expect(getCssText(getTokenLogo() as Element)).toContain('border-radius:var(--chakra-radii-base)');
    });

    it('lets the icon options override the logo shape', () => {
      render(<TokenEntity token={ token } icon={{ borderRadius: 'sm' }}/>);

      expect(getCssText(getTokenLogo() as Element)).toContain('border-radius:var(--chakra-radii-sm)');
    });

    it('names an unnamed token', () => {
      render(<TokenEntity token={{ ...token, name: null, symbol: null }}/>);

      expect(screen.getByText('Unnamed token')).toBeTruthy();
    });
  });

  describe('symbol', () => {
    it('hides the symbol with noSymbol', () => {
      render(<TokenEntity token={ token } noSymbol/>);

      expect(screen.queryByText(token.symbol as string)).toBeNull();
    });

    it('joins the symbol into the name with jointSymbol', () => {
      render(<TokenEntity token={ token } jointSymbol/>);

      expect(screen.getByText(`${ token.name } (${ token.symbol })`)).toBeTruthy();
    });

    it('shows only the symbol with onlySymbol', () => {
      render(<TokenEntity token={ token } onlySymbol/>);

      expect(screen.getByText(token.symbol as string)).toBeTruthy();
      expect(screen.queryByText(token.name as string)).toBeNull();
    });

    it('falls back to the name with onlySymbol when the token has no symbol', () => {
      render(<TokenEntity token={{ ...token, symbol: null }} onlySymbol/>);

      expect(screen.getByText(token.name as string)).toBeTruthy();
    });
  });

  describe('caller flags', () => {
    it('noIcon', () => {
      render(<TokenEntity token={ token } noIcon/>);

      expect(getTokenLogo()).toBeNull();
    });

    it('noCopy', () => {
      render(<TokenEntity token={ token } noCopy/>);

      expect(queryCopy()).toBeNull();
    });

    it('noLink', () => {
      render(<TokenEntity token={ token } noLink/>);

      expect(screen.queryByRole('link')).toBeNull();
      expect(screen.getByText(token.name as string)).toBeTruthy();
    });
  });

  describe('link resolution', () => {
    it('links to the chain-scoped route inside a multichain context', () => {
      render(
        <MultichainContext.Provider value={{ chain: clusterChains.chainA }}>
          <TokenEntity token={ token }/>
        </MultichainContext.Provider>,
      );

      expect(getLink()).toHaveProperty('href', `http://localhost:3000/chain/op-mainnet/token/${ HASH }`);
      expect(queryShield()).toBeNull();
    });

    it('links to the explorer of an external chain with its shield', () => {
      render(<TokenEntity token={ token } chain={ externalChain }/>);

      expect(getLink()).toHaveProperty('href', `https://basescan.org/asset/${ HASH }`);
      expect(getLink().getAttribute('target')).toBe('_blank');
      expect(queryShield()?.getAttribute('src')).toBe(externalChain.logo);
    });

    it('lets an explicit href win over the resolved one', () => {
      render(<TokenEntity token={ token } href="/custom"/>);

      expect(getLink()).toHaveProperty('href', 'http://localhost:3000/custom');
    });
  });

  describe('style props reach the DOM', () => {
    it('on the entity', () => {
      const { container } = render(<TokenEntity token={ token } className="entity-root" ml={ 2 }/>);

      expect(getCssText(container.querySelector('.entity-root') as Element)).toContain('margin-left');
    });

    it('on each exported part', () => {
      const { container } = render(
        <TokenEntityParts.Container token={ token } className="part-container" ml={ 1 }>
          <TokenEntityParts.Icon className="part-icon" ml={ 2 }/>
          <TokenEntityParts.Link className="part-link" ml={ 3 }>
            <TokenEntityParts.Content className="part-content" ml={ 4 }/>
          </TokenEntityParts.Link>
          <TokenEntityParts.Copy className="part-copy" ml={ 5 }/>
        </TokenEntityParts.Container>,
      );

      const parts = [ 'part-container', 'part-icon', 'part-link', 'part-content', 'part-copy' ];
      const withMargin = parts.filter((name) => {
        const element = container.querySelector(`.${ name }`);
        return element !== null && getCssText(element).includes('margin-left');
      });

      expect(withMargin).toEqual(parts);
    });
  });

  describe('sub-part composition', () => {
    it('renders an icon without a root from its own token and chain', () => {
      render(<TokenEntityParts.Icon token={ token } chain={ externalChain }/>);

      expect(getTokenLogo()?.getAttribute('src')).toBe(token.icon_url);
      expect(queryShield()?.getAttribute('src')).toBe(externalChain.logo);
    });

    it('shows the placeholder when the token has no logo', () => {
      render(<TokenEntityParts.Icon token={{ ...token, icon_url: null }}/>);

      expect(document.querySelector('use')?.getAttribute('href')).toBe('#token-placeholder');
    });

    it('renders the symbol-only content without a root', () => {
      render(<TokenEntityParts.Content token={ token } onlySymbol/>);

      expect(screen.getByText(token.symbol as string)).toBeTruthy();
    });
  });
});
