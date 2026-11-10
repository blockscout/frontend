// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { MultichainContext } from 'src/features/multichain/context';
import * as clusterChains from 'src/features/multichain/mocks/chains';
import * as domainMock from 'src/features/name-services/domains/mocks/domain';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';
import { getCssText } from 'vitest/utils/cssText';

import EnsEntity, * as EnsEntityParts from './EnsEntity';

const DOMAIN = 'kitty.kitty.kitty.cat.eth';
const CONSTANT_TRUNCATION_HEAD = 4;
const protocol = domainMock.protocolA;

const getLink = () => screen.getByRole('link');
const queryCopy = () => screen.queryByRole('button', { name: 'copy' });
const queryEnsIcon = () => document.querySelector('use[href="#ENS"]');
const queryProtocolIcon = () => document.querySelector(`img[alt="${ protocol.title } protocol icon"]`);

describe('EnsEntity', () => {
  afterEach(cleanup);

  it('renders the ENS icon, the linked domain and the copy button', () => {
    render(<EnsEntity domain={ DOMAIN }/>);

    expect(getLink()).toHaveProperty('href', `http://localhost:3000/name-services/domains/${ DOMAIN }`);
    expect(screen.getByText(DOMAIN)).toBeTruthy();
    expect(queryEnsIcon()).not.toBeNull();
    expect(queryCopy()).not.toBeNull();
  });

  it('adds the protocol id to the route', () => {
    render(<EnsEntity domain={ DOMAIN } protocol={ protocol }/>);

    expect(getLink()).toHaveProperty('href', `http://localhost:3000/name-services/domains/${ DOMAIN }?protocol_id=${ protocol.id }`);
  });

  it('truncates the domain at the tail by default', () => {
    render(<EnsEntity domain={ DOMAIN }/>);

    expect(getCssText(screen.getByText(DOMAIN))).toContain('text-overflow:ellipsis');
  });

  it('lets the caller choose the truncation', () => {
    render(<EnsEntity domain={ DOMAIN } truncation="constant"/>);

    expect(screen.queryByText(DOMAIN)).toBeNull();
    expect(screen.getByText(DOMAIN.slice(0, CONSTANT_TRUNCATION_HEAD), { exact: false })).toBeTruthy();
  });

  it('draws the protocol icon in place of the ENS icon', () => {
    render(<EnsEntity domain={ DOMAIN } protocol={ protocol }/>);

    expect(queryProtocolIcon()?.getAttribute('src')).toBe(protocol.icon_url);
    expect(queryEnsIcon()).toBeNull();
  });

  it('sizes the protocol icon by the variant', () => {
    render(<EnsEntity domain={ DOMAIN } protocol={ protocol } variant="heading"/>);

    expect(getCssText(queryProtocolIcon() as Element)).toContain('width:30px');
  });

  it('noIcon', () => {
    const { unmount } = render(<EnsEntity domain={ DOMAIN } noIcon/>);
    expect(queryEnsIcon()).toBeNull();
    unmount();

    render(<EnsEntity domain={ DOMAIN } protocol={ protocol } noIcon/>);
    expect(queryProtocolIcon()).toBeNull();
  });

  it('noCopy', () => {
    render(<EnsEntity domain={ DOMAIN } noCopy/>);

    expect(queryCopy()).toBeNull();
  });

  it('noLink', () => {
    render(<EnsEntity domain={ DOMAIN } noLink/>);

    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText(DOMAIN)).toBeTruthy();
  });

  it('keeps the current-chain route inside a multichain context', () => {
    render(
      <MultichainContext.Provider value={{ chain: clusterChains.chainA }}>
        <EnsEntity domain={ DOMAIN }/>
      </MultichainContext.Provider>,
    );

    expect(getLink()).toHaveProperty('href', `http://localhost:3000/name-services/domains/${ DOMAIN }`);
  });

  it('renders the protocol icon without a root from its own protocol', () => {
    render(<EnsEntityParts.Icon protocol={ protocol }/>);

    expect(queryProtocolIcon()?.getAttribute('src')).toBe(protocol.icon_url);
  });

  it('applies style props on the entity and its icon', () => {
    const { container } = render(
      <EnsEntityParts.Container domain={ DOMAIN } protocol={ protocol } className="part-container" ml={ 1 }>
        <EnsEntityParts.Icon className="part-icon" ml={ 2 }/>
      </EnsEntityParts.Container>,
    );

    expect(getCssText(container.querySelector('.part-container') as Element)).toContain('margin-left');
    expect(getCssText(container.querySelector('.part-icon') as Element)).toContain('margin-left');
  });
});
