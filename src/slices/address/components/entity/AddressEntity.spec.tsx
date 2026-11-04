// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { AddressFormat } from 'src/slices/address/types/config';

import * as addressParamMock from 'src/slices/address/mocks/address-param';
import * as implementationsMock from 'src/slices/address/mocks/implementations';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';
import type { EntityChain } from 'src/shared/entities/resolve-entity-link';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from 'vitest/lib';
import { getCssText } from 'vitest/utils/cssText';
import withEnvs from 'vitest/utils/mockEnvs';

import AddressEntity, * as AddressEntityParts from './AddressEntity';
import AddressEntityWithTokenFilter from './AddressEntityWithTokenFilter';

const HASH = addressParamMock.hash;

const externalChain: EntityChain = {
  id: '8453',
  name: 'Base',
  logo: 'https://example.com/base.png',
  explorer_url: 'https://basescan.org',
  route_templates: { address: '/account/{hash}' },
};

const getLink = () => screen.getByRole('link');
const queryCopy = () => screen.queryByRole('button', { name: 'copy' });
const getSpriteName = () => document.querySelector('use:not([href="#copy"])')?.getAttribute('href');
const queryShield = () => document.querySelector('img:not([alt^="Identicon"])');
const queryIdenticon = () => document.querySelector('img[alt^="Identicon"]');

// jsdom does not preserve :hover when the lazy tooltip remounts its trigger, so the trigger is entered twice.
const findStyled = (container: HTMLElement, cssFragment: string) => {
  return Array.from(container.querySelectorAll('*')).filter((element) => getCssText(element).includes(cssFragment));
};

const openTooltip = async(getTrigger: () => Element) => {
  const initialTrigger = getTrigger();
  fireEvent.pointerEnter(initialTrigger, { pointerType: 'mouse' });
  await waitFor(() => expect(initialTrigger.isConnected).toBe(false));
  fireEvent.pointerEnter(getTrigger(), { pointerType: 'mouse' });
};

describe('AddressEntity', () => {
  afterEach(cleanup);

  describe('address prop', () => {
    it('renders a bare hash string the same as the address object', () => {
      const fromString = render(<AddressEntity address={ HASH } truncation="none"/>);
      const stringMarkup = fromString.container.innerHTML;
      fromString.unmount();

      const fromObject = render(<AddressEntity address={{ hash: HASH }} truncation="none"/>);

      expect(stringMarkup).toBe(fromObject.container.innerHTML);
      expect(getLink()).toHaveProperty('href', `http://localhost:3000/address/${ HASH }`);
      expect(screen.getByText(HASH)).toBeTruthy();
      expect(queryCopy()).not.toBeNull();
    });

    describe('with the bech32 address format', () => {
      const renderBech32 = async(build: (parts: typeof AddressEntityParts) => React.ReactElement, addressFormat: AddressFormat = 'bech32') => {
        await withEnvs(ENVS_MAP.addressBech32Format, async() => {
          const { render } = await import('vitest/lib');
          const { SettingsContext } = await import('src/shell/top-bar/settings/context');
          const element = build(await import('./AddressEntity'));
          const settings = {
            addressFormat,
            toggleAddressFormat: () => {},
            timeFormat: 'relative' as const,
            toggleTimeFormat: () => {},
            isLocalTime: true,
            toggleIsLocalTime: () => {},
          };

          render(<SettingsContext.Provider value={ settings }>{ element }</SettingsContext.Provider>);
        });
      };

      it('shows and copies the bech32 form of the hash', async() => {
        await renderBech32(({ 'default': Entity }) => <Entity address={ HASH } truncation="none"/>);

        expect(screen.getByText(/^tom1/)).toBeTruthy();
        expect(screen.queryByText(HASH)).toBeNull();
      });

      it('keeps the base16 hash while the base16 format is selected', async() => {
        await renderBech32(({ 'default': Entity }) => <Entity address={ HASH } truncation="none"/>, 'base16');

        expect(screen.getByText(HASH)).toBeTruthy();
      });

      it('keeps the base16 hash when noAltHash is set', async() => {
        await renderBech32(({ 'default': Entity }) => <Entity address={ HASH } truncation="none" noAltHash/>);

        expect(screen.getByText(HASH)).toBeTruthy();
      });

      it('shows a part-level address as given', async() => {
        await renderBech32(({ Container, Content }) => (
          <Container address={ HASH }>
            <Content address={ HASH } truncation="none"/>
          </Container>
        ));

        expect(screen.getByText(HASH)).toBeTruthy();
      });

      it('renders a container without an address', async() => {
        await renderBech32(({ Container }) => <Container>x</Container>);

        expect(screen.getByText('x')).toBeTruthy();
      });
    });

    it('shows the filecoin robust address instead of the hash', () => {
      render(<AddressEntity address={ addressParamMock.filecoin } truncation="none"/>);

      expect(screen.getByText(addressParamMock.filecoin.filecoin?.robust as string)).toBeTruthy();
      expect(screen.queryByText(HASH)).toBeNull();
    });
  });

  describe('caller flags', () => {
    it('noIcon', () => {
      render(<AddressEntity address={ addressParamMock.contract } noIcon/>);

      expect(getSpriteName()).toBeUndefined();
      expect(queryIdenticon()).toBeNull();
    });

    it('noCopy', () => {
      render(<AddressEntity address={ HASH } noCopy/>);

      expect(queryCopy()).toBeNull();
    });

    it('noLink', () => {
      render(<AddressEntity address={ HASH } noLink truncation="none"/>);

      expect(screen.queryByRole('link')).toBeNull();
      expect(screen.getByText(HASH)).toBeTruthy();
    });

    it('truncation', () => {
      render(<AddressEntity address={ HASH } truncation="constant"/>);

      expect(screen.queryByText(HASH)).toBeNull();
      expect(screen.getByText(HASH.slice(0, 4), { exact: false })).toBeTruthy();
    });
  });

  describe('icon', () => {
    it('draws the verified-contract sprite in green', () => {
      render(<AddressEntity address={{ ...addressParamMock.contract, implementations: [] }}/>);

      expect(getSpriteName()).toBe('#contracts/verified');
      expect(getCssText(document.querySelector('svg') as Element)).toContain('green');
    });

    it('draws the regular-contract sprite for an unverified contract', () => {
      render(<AddressEntity address={{ ...addressParamMock.contract, is_verified: false, implementations: [] }}/>);

      expect(getSpriteName()).toBe('#contracts/regular');
    });

    it('draws the proxy sprite in green when the proxy and all its implementations are verified', () => {
      render(<AddressEntity address={ addressParamMock.contract }/>);

      expect(getSpriteName()).toBe('#contracts/proxy');
      expect(getCssText(document.querySelector('svg') as Element)).toContain('green');
    });

    it('draws the proxy sprite without green when an implementation is unnamed', () => {
      render(<AddressEntity address={{ ...addressParamMock.contract, implementations: implementationsMock.multiple }}/>);

      expect(getSpriteName()).toBe('#contracts/proxy');
      expect(getCssText(document.querySelector('svg') as Element)).not.toContain('green');
    });

    it('draws the proxy sprite without green when the proxy itself is unverified', () => {
      render(<AddressEntity address={{ ...addressParamMock.contract, is_verified: false }}/>);

      expect(getCssText(document.querySelector('svg') as Element)).not.toContain('green');
    });

    it('describes an unverified proxy in the hint', async() => {
      render(<AddressEntity address={{ ...addressParamMock.contract, is_verified: false }}/>);

      await openTooltip(() => document.querySelector('svg')?.parentElement as Element);

      expect(await screen.findByText('Proxy contract')).toBeTruthy();
    });

    it('describes a delegated EOA with verified code in the hint', async() => {
      render(<AddressEntity address={ addressParamMock.delegated }/>);

      await openTooltip(() => queryIdenticon()?.parentElement?.parentElement as Element);

      expect(await screen.findByText('EOA + verified code')).toBeTruthy();
    });

    it('describes a delegated EOA with unverified code in the hint', async() => {
      render(<AddressEntity address={{ ...addressParamMock.delegated, is_verified: false }}/>);

      await openTooltip(() => queryIdenticon()?.parentElement?.parentElement as Element);

      expect(await screen.findByText('EOA + code')).toBeTruthy();
    });

    it('shows the hint from the icon options on a plain address', async() => {
      render(<AddressEntity address={ HASH } icon={{ hint: 'Custom hint' }}/>);

      await openTooltip(() => queryIdenticon()?.parentElement?.parentElement as Element);

      expect(await screen.findByText('Custom hint')).toBeTruthy();
    });

    it('takes the box size from the icon options', () => {
      const { container } = render(<AddressEntity address={ addressParamMock.contract } icon={{ boxSize: '24px' }}/>);

      expect(findStyled(container, 'width:24px')).not.toHaveLength(0);
    });

    it('sizes the loading skeleton like the icon', () => {
      const { container } = render(<AddressEntity address={ HASH } isLoading/>);

      expect(findStyled(container, 'width:20px')).not.toHaveLength(0);
    });

    it('sizes the loading skeleton from the icon options', () => {
      const { container } = render(<AddressEntity address={ HASH } isLoading icon={{ boxSize: '24px' }}/>);

      expect(findStyled(container, 'width:24px')).not.toHaveLength(0);
    });

    it('takes the right margin from the icon options', () => {
      const { container } = render(<AddressEntity address={ HASH } icon={{ marginRight: '5px' }}/>);

      expect(findStyled(container, 'margin-right:5px')).not.toHaveLength(0);
    });

    it('takes the right margin from the mr shorthand', () => {
      const { container } = render(<AddressEntity address={ HASH } icon={{ mr: '6px' }}/>);

      expect(findStyled(container, 'margin-right:6px')).not.toHaveLength(0);
    });

    it('widens the right margin for the shield', () => {
      const { container } = render(<AddressEntity address={ HASH } chain={ externalChain }/>);

      expect(findStyled(container, 'margin-right:18px')).not.toHaveLength(0);
    });

    it('takes the shield margin from the icon options', () => {
      const { container } = render(<AddressEntity address={ HASH } chain={ externalChain } icon={{ marginRightShield: '7px' }}/>);

      expect(findStyled(container, 'margin-right:7px')).not.toHaveLength(0);
    });

    it('draws the Safe sprite for a safe contract', () => {
      render(<AddressEntity address={ addressParamMock.contract } isSafeAddress/>);

      expect(getSpriteName()).toBe('#brands/safe');
    });

    it('lets the icon part unset the safe flag of the container', () => {
      render(
        <AddressEntityParts.Container address={ addressParamMock.contract } isSafeAddress>
          <AddressEntityParts.Icon isSafeAddress={ false }/>
        </AddressEntityParts.Container>,
      );

      expect(getSpriteName()).toBe('#contracts/proxy');
    });

    it('accepts a zero right margin from the icon options', () => {
      const { container } = render(<AddressEntity address={ HASH } icon={{ marginRight: 0 }}/>);

      expect(findStyled(container, 'margin-right:0')).not.toHaveLength(0);
      expect(findStyled(container, 'margin-right:8px')).toHaveLength(0);
    });

    it('draws the identicon and no sprite for a delegated EOA', async() => {
      render(<AddressEntity address={ addressParamMock.delegated }/>);

      await waitFor(() => expect(queryIdenticon()).not.toBeNull());
      expect(getSpriteName()).toBeUndefined();
    });

    it('appends the hint postfix to the contract hint', async() => {
      render(
        <AddressEntity
          address={{ ...addressParamMock.contract, implementations: [] }}
          icon={{ shield: { name: 'brands/ton' }, hintPostfix: ' on TON' }}
        />,
      );

      await openTooltip(() => document.querySelector('svg')?.parentElement as Element);

      expect(await screen.findByText('Verified contract on TON')).toBeTruthy();
    });

    it('names the chain in the identicon hint when a chain is given', async() => {
      render(<AddressEntity address={ HASH } chain={ externalChain }/>);

      await openTooltip(() => queryIdenticon()?.parentElement?.parentElement as Element);

      expect(await screen.findByText('Address on Base (Chain ID: 8453)')).toBeTruthy();
    });

    it('sizes the identicon from the icon options', () => {
      const { container } = render(<AddressEntity address={ HASH } icon={{ size: 30 }}/>);

      expect(findStyled(container, 'width:30px')).not.toHaveLength(0);
    });

    it('sizes the identicon by the heading variant', () => {
      const { container } = render(<AddressEntity address={ HASH } variant="heading"/>);

      expect(findStyled(container, 'width:30px')).not.toHaveLength(0);
    });

    it('replaces the identicon with the icon given in the options', () => {
      render(<AddressEntity address={ HASH } icon={{ name: 'block' }}/>);

      expect(getSpriteName()).toBe('#block');
    });
  });

  describe('content', () => {
    it('shows the name of a named address instead of the hash', () => {
      render(<AddressEntity address={ addressParamMock.withName }/>);

      expect(screen.getByText(addressParamMock.withName.name as string)).toBeTruthy();
      expect(screen.queryByText(HASH, { exact: false })).toBeNull();
    });

    it('shows the implementation name of a proxy contract', () => {
      render(<AddressEntity address={ addressParamMock.contract }/>);

      expect(screen.getByText('HomeBridge')).toBeTruthy();
    });

    it('shows the proxy name when the implementations are unnamed', () => {
      render(<AddressEntity address={{ ...addressParamMock.contract, implementations: implementationsMock.multiple }}/>);

      expect(screen.getByText('EternalStorageProxy')).toBeTruthy();
    });

    it('shows the hash of a proxy contract without any name', () => {
      render(
        <AddressEntity
          address={{ ...addressParamMock.contract, name: null, implementations: [ { address_hash: '0x1', name: null } ] }}
          truncation="none"
        />,
      );

      expect(screen.getByText(HASH)).toBeTruthy();
    });
  });

  describe('link', () => {
    it('links to the explorer of an external chain with its shield', () => {
      render(<AddressEntity address={ HASH } chain={ externalChain }/>);

      expect(getLink()).toHaveProperty('href', `https://basescan.org/account/${ HASH }`);
      expect(getLink().getAttribute('target')).toBe('_blank');
      expect(queryShield()?.getAttribute('src')).toBe(externalChain.logo);
    });

    it('lets an explicit href win over the resolved one', () => {
      render(<AddressEntity address={ HASH } href="/custom"/>);

      expect(getLink()).toHaveProperty('href', 'http://localhost:3000/custom');
    });

    it('hides the shield when the icon options disable it', () => {
      render(<AddressEntity address={ HASH } chain={ externalChain } icon={{ shield: false }}/>);

      expect(queryShield()).toBeNull();
    });
  });

  describe('style props reach the DOM', () => {
    it('on the entity', () => {
      const { container } = render(<AddressEntity address={ HASH } className="entity-root" ml={ 2 }/>);

      expect(getCssText(container.querySelector('.entity-root') as Element)).toContain('margin-left');
    });

    it('on each exported part', () => {
      const { container } = render(
        <AddressEntityParts.Container address={ HASH } className="part-container" ml={ 1 }>
          <AddressEntityParts.Icon className="part-icon" ml={ 2 } name="block"/>
          <AddressEntityParts.Link className="part-link" ml={ 3 }>
            <AddressEntityParts.Content className="part-content" ml={ 4 }/>
          </AddressEntityParts.Link>
          <AddressEntityParts.Copy className="part-copy" ml={ 5 }/>
        </AddressEntityParts.Container>,
      );

      const parts = [ 'part-container', 'part-icon', 'part-link', 'part-content', 'part-copy' ];
      const withMargin = parts.filter((name) => {
        const element = container.querySelector(`.${ name }`);
        return element !== null && getCssText(element).includes('margin-left');
      });

      expect(withMargin).toEqual(parts);
    });

    it('on the content of a named address', () => {
      const { container } = render(
        <AddressEntityParts.Container address={ addressParamMock.withName }>
          <AddressEntityParts.Content className="part-content" ml={ 4 }/>
        </AddressEntityParts.Container>,
      );

      expect(getCssText(container.querySelector('.part-content') as Element)).toContain('margin-left');
    });
  });

  describe('sub-part composition', () => {
    it('supplies the address once at the container', () => {
      const { container } = render(
        <AddressEntityParts.Container address={ addressParamMock.contract }>
          <AddressEntityParts.Icon/>
          <AddressEntityParts.Link><AddressEntityParts.Content/></AddressEntityParts.Link>
          <AddressEntityParts.Copy/>
        </AddressEntityParts.Container>,
      );

      expect(getLink()).toHaveProperty('href', `http://localhost:3000/address/${ HASH }`);
      expect(getSpriteName()).toBe('#contracts/proxy');
      expect(screen.getByText('HomeBridge')).toBeTruthy();
      expect(queryCopy()).not.toBeNull();
      expect(container.querySelector('.address-entity')).not.toBeNull();
    });

    it('lets a part override the address it displays', () => {
      const other = '0xaaaa';
      render(
        <AddressEntityParts.Container address={ HASH }>
          <AddressEntityParts.Link address={ other }><AddressEntityParts.Content address={ other } truncation="none"/></AddressEntityParts.Link>
        </AddressEntityParts.Container>,
      );

      expect(getLink()).toHaveProperty('href', `http://localhost:3000/address/${ other }`);
      expect(screen.getByText(other)).toBeTruthy();
    });

    it('renders an icon without a root from its own address', () => {
      render(<AddressEntityParts.Icon address={{ ...addressParamMock.contract, implementations: [] }}/>);

      expect(getSpriteName()).toBe('#contracts/verified');
    });

    it('lets a part use its own chain instead of the container chain', () => {
      const otherChain: EntityChain = { ...externalChain, id: '10', name: 'Optimism', logo: 'https://example.com/op.png' };
      render(
        <AddressEntityParts.Container address={ HASH } chain={ externalChain }>
          <AddressEntityParts.Icon chain={ otherChain }/>
        </AddressEntityParts.Container>,
      );

      expect(queryShield()?.getAttribute('src')).toBe(otherChain.logo);
    });
  });

  describe('token filter', () => {
    it('opens the advanced-filter link from the content tooltip of an untruncated value', async() => {
      render(<AddressEntityWithTokenFilter address={{ hash: HASH }} tokenHash="0xabc" tokenSymbol="USDT"/>);

      await openTooltip(() => getLink().querySelector('span') as Element);

      const filterLink = await screen.findByRole('link', { name: /view all token transfers/i });
      expect(filterLink.getAttribute('href')).toContain('/advanced-filter?');
      expect(filterLink.getAttribute('href')).toContain('token_contract_symbols_to_include=USDT');
    });
  });
});
