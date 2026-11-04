// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import TxEntity, * as TxEntityParts from 'src/slices/tx/components/entity/TxEntity';

import { MultichainContext } from 'src/features/multichain/context';
import * as clusterChains from 'src/features/multichain/mocks/chains';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';
import { getCssText } from 'vitest/utils/cssText';
import withEnvs from 'vitest/utils/mockEnvs';

import { defineEntity } from './define-entity';
import { keysOf } from './entity-props';
import type { EntityChain } from './resolve-entity-link';

const HASH = '0x376db52955d5bce114d0ccea2dcf22289b4eae1b86bcae5a59bb5fdbfef48899';

const externalChain: EntityChain = {
  id: '8453',
  name: 'Base',
  logo: 'https://example.com/base.png',
  explorer_url: 'https://basescan.org',
  route_templates: { tx: '/transaction/{hash}' },
};

const getLink = () => screen.getByRole('link');
const queryCopy = () => screen.queryByRole('button', { name: 'copy' });

describe('defineEntity', () => {
  afterEach(cleanup);

  describe('default component', () => {
    it('renders icon, link, truncated text and copy button for the hash', () => {
      render(<TxEntity hash={ HASH }/>);

      expect(getLink()).toHaveProperty('href', `http://localhost:3000/tx/${ HASH }`);
      expect(screen.getByText(HASH.slice(0, 4), { exact: false })).toBeTruthy();
      expect(queryCopy()).not.toBeNull();
      expect(document.querySelector('use')?.getAttribute('href')).toBe('#transactions');
    });

    it('shows the given text instead of the hash', () => {
      render(<TxEntity hash={ HASH } text="Pending" truncation="none"/>);

      expect(screen.getByText('Pending')).toBeTruthy();
    });

    it('forwards the link target', () => {
      render(<TxEntity hash={ HASH } link={{ target: '_blank' }}/>);

      expect(getLink().getAttribute('target')).toBe('_blank');
    });

    it('lets an explicit href win over the resolved one', () => {
      render(<TxEntity hash={ HASH } href="/custom"/>);

      expect(getLink()).toHaveProperty('href', 'http://localhost:3000/custom');
    });

    it('renders an element returned by the icon function in place of a sprite', () => {
      const Entity = defineEntity<{ hash: string }>({
        name: 'ElementIconEntity',
        data: keysOf<{ hash: string }>()([ 'hash' ]),
        route: ({ hash }) => ({ pathname: '/tx/[hash]', query: { hash } }),
        hintPrefix: 'Test on ',
        icon: () => <span data-testid="custom-icon"/>,
        text: ({ hash }) => hash,
        copyText: false,
      }).Entity;

      render(<Entity hash={ HASH }/>);

      expect(screen.getByTestId('custom-icon')).toBeTruthy();
      expect(document.querySelector('use')).toBeNull();
    });

    it('renders an image from the props returned by the icon function', () => {
      const Entity = defineEntity<{ hash: string }>({
        name: 'ImageIconEntity',
        data: keysOf<{ hash: string }>()([ 'hash' ]),
        route: ({ hash }) => ({ pathname: '/tx/[hash]', query: { hash } }),
        hintPrefix: 'Test on ',
        icon: () => ({ src: 'https://example.com/logo.png', alt: 'logo' }),
        text: ({ hash }) => hash,
        copyText: false,
      }).Entity;

      render(<Entity hash={ HASH }/>);

      expect(document.querySelector('img[alt="logo"]')?.getAttribute('src')).toBe('https://example.com/logo.png');
      expect(document.querySelector('use')).toBeNull();
    });

    it('lets the icon bag override the icon name and the hint', () => {
      render(<TxEntity hash={ HASH } icon={{ name: 'block' }}/>);

      expect(document.querySelector('use')?.getAttribute('href')).toBe('#block');
    });
  });

  describe('icon defaults', () => {
    const SquareIconEntity = defineEntity<{ hash: string }>({
      name: 'SquareIconEntity',
      data: keysOf<{ hash: string }>()([ 'hash' ]),
      route: ({ hash }) => ({ pathname: '/tx/[hash]', query: { hash } }),
      hintPrefix: 'Test on ',
      icon: 'block',
      text: ({ hash }) => hash,
      copyText: ({ hash }) => hash,
      defaults: { icon: { borderRadius: 'none' } },
    });

    const getIconCss = () => getCssText(document.querySelector('svg') as Element);

    it('reach an icon part rendered without a root, as in the search bar suggestions', () => {
      render(<SquareIconEntity.Icon hash={ HASH }/>);

      expect(getIconCss()).toContain('border-radius:var(--chakra-radii-none)');
    });

    it('give way to the icon part\'s own value', () => {
      render(<SquareIconEntity.Icon hash={ HASH } borderRadius="full"/>);

      expect(getIconCss()).toContain('border-radius:var(--chakra-radii-full)');
    });
  });

  describe('caller flags win over the factory defaults', () => {
    const Entity = defineEntity<{ hash: string }>({
      name: 'TestEntity',
      data: keysOf<{ hash: string }>()([ 'hash' ]),
      route: ({ hash }) => ({ pathname: '/tx/[hash]', query: { hash } }),
      hintPrefix: 'Test on ',
      icon: 'block',
      text: ({ hash }) => hash,
      copyText: ({ hash }) => hash,
      defaults: { truncation: 'none', noIcon: true, noCopy: true, noLink: true, noTooltip: true },
    }).Entity;

    it('applies the defaults when the caller passes nothing', () => {
      render(<Entity hash={ HASH }/>);

      expect(screen.getByText(HASH)).toBeTruthy();
      expect(screen.queryByRole('link')).toBeNull();
      expect(queryCopy()).toBeNull();
      expect(document.querySelector('use')).toBeNull();
    });

    it('truncation', () => {
      render(<Entity hash={ HASH } truncation="constant"/>);

      expect(screen.queryByText(HASH)).toBeNull();
      expect(screen.getByText(HASH.slice(0, 4), { exact: false })).toBeTruthy();
    });

    it('truncation with a symbol count', () => {
      render(<Entity hash={ HASH } truncation={{ type: 'constant', maxSymbols: 6 }}/>);

      expect(screen.getByText(`${ HASH.slice(0, 4) }...${ HASH.slice(-2) }`)).toBeTruthy();
    });

    it('constant_long keeps its fixed symbol count', () => {
      render(<Entity hash={ HASH } truncation="constant_long"/>);

      expect(screen.getByText(`${ HASH.slice(0, 12) }...${ HASH.slice(-4) }`)).toBeTruthy();
    });

    it('noIcon', () => {
      render(<Entity hash={ HASH } noIcon={ false }/>);

      expect(document.querySelector('use')?.getAttribute('href')).toBe('#block');
    });

    it('noCopy', () => {
      render(<Entity hash={ HASH } noCopy={ false }/>);

      expect(queryCopy()).not.toBeNull();
    });

    it('noLink', () => {
      render(<Entity hash={ HASH } noLink={ false }/>);

      expect(getLink()).toHaveProperty('href', `http://localhost:3000/tx/${ HASH }`);
    });

    it('noTooltip', () => {
      render(<Entity hash={ HASH } noTooltip={ false } noCopy={ false }/>);

      expect(queryCopy()).not.toBeNull();
    });
  });

  describe('style props reach the DOM', () => {
    it('on the entity', () => {
      const { container } = render(<TxEntity hash={ HASH } className="entity-root" ml={ 2 }/>);

      const root = container.querySelector('.entity-root');
      expect(root).not.toBeNull();
      expect(getCssText(root as Element)).toContain('margin-left');
    });

    it('on each exported part', () => {
      const { container } = render(
        <TxEntityParts.Container hash={ HASH } className="part-container" ml={ 1 }>
          <TxEntityParts.Icon className="part-icon" ml={ 2 }/>
          <TxEntityParts.Link className="part-link" ml={ 3 }>
            <TxEntityParts.Content className="part-content" ml={ 4 }/>
          </TxEntityParts.Link>
          <TxEntityParts.Copy className="part-copy" ml={ 5 }/>
        </TxEntityParts.Container>,
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
    it('supplies data once at the container', () => {
      render(
        <TxEntityParts.Container hash={ HASH }>
          <TxEntityParts.Link><TxEntityParts.Content truncation="none"/></TxEntityParts.Link>
        </TxEntityParts.Container>,
      );

      expect(getLink()).toHaveProperty('href', `http://localhost:3000/tx/${ HASH }`);
      expect(screen.getByText(HASH)).toBeTruthy();
    });

    it('lets a part override the data it displays', () => {
      const other = '0xaaaa';
      render(
        <TxEntityParts.Container hash={ HASH }>
          <TxEntityParts.Link hash={ other }><TxEntityParts.Content hash={ other } truncation="none"/></TxEntityParts.Link>
        </TxEntityParts.Container>,
      );

      expect(getLink()).toHaveProperty('href', `http://localhost:3000/tx/${ other }`);
      expect(screen.getByText(other)).toBeTruthy();
    });

    it('renders a link without a root from its own data', () => {
      render(<TxEntityParts.Link hash={ HASH }>x</TxEntityParts.Link>);

      expect(getLink()).toHaveProperty('href', `http://localhost:3000/tx/${ HASH }`);
    });

    it('lets a part use its own chain instead of the container chain', () => {
      const otherChain: EntityChain = { ...externalChain, id: '10', name: 'Optimism', logo: 'https://example.com/op.png' };
      render(
        <TxEntityParts.Container hash={ HASH } chain={ externalChain }>
          <TxEntityParts.Icon chain={ otherChain }/>
        </TxEntityParts.Container>,
      );

      expect(document.querySelector('img')?.getAttribute('src')).toBe(otherChain.logo);
    });

    it('renders an icon without a root with the chain shield from its own chain', () => {
      render(<TxEntityParts.Icon chain={ externalChain }/>);

      expect(document.querySelector('img')?.getAttribute('src')).toBe(externalChain.logo);
    });
  });

  describe('link resolution', () => {
    it('links to the current chain outside a multichain context', () => {
      render(<TxEntity hash={ HASH }/>);

      expect(getLink()).toHaveProperty('href', `http://localhost:3000/tx/${ HASH }`);
    });

    it('links to the chain-scoped route inside a multichain context', () => {
      render(
        <MultichainContext.Provider value={{ chain: clusterChains.chainA }}>
          <TxEntity hash={ HASH }/>
        </MultichainContext.Provider>,
      );

      expect(getLink()).toHaveProperty('href', `http://localhost:3000/chain/op-mainnet/tx/${ HASH }`);
      expect(document.querySelector('img')).toBeNull();
    });

    it('links to the explorer of an external chain with its shield and hint', () => {
      render(<TxEntity hash={ HASH } chain={ externalChain }/>);

      const link = getLink();
      expect(link).toHaveProperty('href', `https://basescan.org/transaction/${ HASH }`);
      expect(link.getAttribute('target')).toBe('_blank');
      expect(document.querySelector('img')?.getAttribute('src')).toBe(externalChain.logo);
    });

    it('drops the link when the external chain has no explorer', () => {
      render(<TxEntity hash={ HASH } chain={{ id: '8453', name: 'Base' }} truncation="none"/>);

      expect(screen.queryByRole('link')).toBeNull();
      expect(screen.getByText(HASH)).toBeTruthy();
    });

    it('links to the page of a chain from the multichain config', async() => {
      await withEnvs(ENVS_MAP.multichain, async() => {
        window.__multichainConfig = { chains: [ clusterChains.chainA, clusterChains.chainB ] };
        const { render, screen } = await import('vitest/lib');
        const { 'default': Entity } = await import('src/slices/tx/components/entity/TxEntity');

        render(<Entity hash={ HASH } chain={{ id: clusterChains.chainB.id, name: 'B' }}/>);

        expect(screen.getByRole('link')).toHaveProperty('href', `http://localhost:3000/chain/op-testnet/tx/${ HASH }`);
        expect(document.querySelector('img')?.getAttribute('src')).toBe(clusterChains.chainB.logo);
      });
      window.__multichainConfig = undefined;
    });
  });
});
