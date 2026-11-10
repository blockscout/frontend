// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { MultichainContext } from 'src/features/multichain/context';
import * as clusterChains from 'src/features/multichain/mocks/chains';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';
import { getCssText } from 'vitest/utils/cssText';

import ClustersEntity, * as ClustersEntityParts from './ClustersEntity';

const NAME = 'this-is-a-very-long-cluster-name';
const CONSTANT_TRUNCATION_HEAD = 4;

const getLink = () => screen.getByRole('link');
const queryCopy = () => screen.queryByRole('button', { name: 'copy' });
const queryProfileImage = (name: string) => document.querySelector(`img[alt="${ name } profile"]`);

describe('ClustersEntity', () => {
  afterEach(cleanup);

  it('renders the profile image, the linked name with a trailing slash and the copy button', () => {
    render(<ClustersEntity clusterName={ NAME }/>);

    expect(getLink()).toHaveProperty('href', `http://localhost:3000/name-services/clusters/${ NAME }`);
    expect(screen.getByText(`${ NAME }/`)).toBeTruthy();
    expect(queryProfileImage(NAME)?.getAttribute('src')).toBe(`https://cdn.clusters.xyz/profile-image/${ NAME }`);
    expect(queryCopy()).not.toBeNull();
  });

  it('shows a name with a subdomain as is', () => {
    render(<ClustersEntity clusterName="test/subdomain"/>);

    expect(screen.getByText('test/subdomain')).toBeTruthy();
    expect(getLink()).toHaveProperty('href', 'http://localhost:3000/name-services/clusters/test%2Fsubdomain');
  });

  it('truncates the name at the tail by default', () => {
    render(<ClustersEntity clusterName={ NAME }/>);

    expect(getCssText(screen.getByText(`${ NAME }/`))).toContain('text-overflow:ellipsis');
  });

  it('lets the caller choose the truncation', () => {
    render(<ClustersEntity clusterName={ NAME } truncation="constant"/>);

    expect(screen.queryByText(`${ NAME }/`)).toBeNull();
    expect(screen.getByText(NAME.slice(0, CONSTANT_TRUNCATION_HEAD), { exact: false })).toBeTruthy();
  });

  it('sizes the profile image by the variant', () => {
    render(<ClustersEntity clusterName={ NAME } variant="heading"/>);

    expect(getCssText(queryProfileImage(NAME) as Element)).toContain('width:30px');
  });

  it('noIcon', () => {
    render(<ClustersEntity clusterName={ NAME } noIcon/>);

    expect(queryProfileImage(NAME)).toBeNull();
  });

  it('noCopy', () => {
    render(<ClustersEntity clusterName={ NAME } noCopy/>);

    expect(queryCopy()).toBeNull();
  });

  it('noLink', () => {
    render(<ClustersEntity clusterName={ NAME } noLink/>);

    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText(`${ NAME }/`)).toBeTruthy();
  });

  it('lets an explicit href win over the resolved one', () => {
    render(<ClustersEntity clusterName={ NAME } href="/custom"/>);

    expect(getLink()).toHaveProperty('href', 'http://localhost:3000/custom');
  });

  it('keeps the current-chain route inside a multichain context', () => {
    render(
      <MultichainContext.Provider value={{ chain: clusterChains.chainA }}>
        <ClustersEntity clusterName={ NAME }/>
      </MultichainContext.Provider>,
    );

    expect(getLink()).toHaveProperty('href', `http://localhost:3000/name-services/clusters/${ NAME }`);
  });

  it('renders empty content without a root and a name', () => {
    const { container } = render(<ClustersEntityParts.Content className="part-content"/>);

    expect(container.querySelector('.part-content')?.textContent).toBe('');
  });

  it('renders the icon without a root from its own name', () => {
    render(<ClustersEntityParts.Icon clusterName="solo"/>);

    expect(queryProfileImage('solo')?.getAttribute('src')).toBe('https://cdn.clusters.xyz/profile-image/solo');
  });

  it('applies style props on the entity and its icon', () => {
    const { container } = render(
      <ClustersEntityParts.Container clusterName={ NAME } className="part-container" ml={ 1 }>
        <ClustersEntityParts.Icon className="part-icon" ml={ 2 }/>
      </ClustersEntityParts.Container>,
    );

    expect(getCssText(container.querySelector('.part-container') as Element)).toContain('margin-left');
    expect(getCssText(container.querySelector('.part-icon') as Element)).toContain('margin-left');
  });
});
