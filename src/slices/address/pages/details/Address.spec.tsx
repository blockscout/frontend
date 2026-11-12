// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import * as addressMock from 'src/slices/address/mocks/address';
import * as addressParamMock from 'src/slices/address/mocks/address-param';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, screen } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';
import { buildRouterMock } from 'vitest/utils/mockRouter';

const SCAM_ALERT_TEXT = 'This address has been flagged as a potential scam.';
const ADDRESS_PATH = `/api/v2/addresses/${ addressParamMock.hash }`;
const ENS_LOOKUP_PATH = '/api/v1/addresses:lookup';

// .env.vitest turns both name services on; an empty host turns one off again
const NO_ENS_ENVS: Array<[ string, string ]> = [ [ 'NEXT_PUBLIC_NAME_SERVICE_API_HOST', '' ] ];
const NO_CLUSTERS_ENVS: Array<[ string, string ]> = [ [ 'NEXT_PUBLIC_CLUSTERS_API_HOST', '' ] ];

// every test re-imports the whole address page (withEnvs resets modules), which took >5s on a CI runner
const TEST_TIMEOUT = 20_000;

const scamAddress: schemas['AddressResponse'] = { ...addressMock.eoa, is_scam: true };

const metadataEnvs: Array<[ string, string ]> = [
  [ 'NEXT_PUBLIC_METADATA_SERVICE_API_HOST', 'https://localhost:3007' ],
];

function jsonResponse(body: unknown): { headers: Record<string, string>; body: string } {
  return { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

function mockAddress(address: schemas['AddressResponse']): void {
  fetchMock.mockResponse((request) => {
    const { pathname } = new URL(request.url);

    if (pathname === ADDRESS_PATH) {
      return jsonResponse(address);
    }

    if (pathname.endsWith('/metadata')) {
      return jsonResponse({ addresses: {} });
    }

    if (pathname.endsWith('/addresses:submit')) {
      return jsonResponse({});
    }

    return { status: 404, body: '{}' };
  });
}

async function renderAddressPage(): Promise<void> {
  const { render, wrapper: TestApp } = await import('vitest/lib');
  const { 'default': Address } = await import('./Address');
  const router = buildRouterMock('/address/[hash]', `/address/${ addressParamMock.hash }`);
  render(<TestApp router={ router }><Address/></TestApp>);
}

function requestedPaths(): Array<string> {
  return fetchMock.mock.calls.map(([ input ]) => new URL(input instanceof Request ? input.url : String(input)).pathname);
}

beforeEach(() => {
  fetchMock.resetMocks();
});

afterEach(() => {
  cleanup();
});

describe('address scam flag', () => {
  it('warns that the address is flagged as a scam', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs([], async() => {
      mockAddress(scamAddress);
      await renderAddressPage();

      expect(await screen.findByText(SCAM_ALERT_TEXT)).toBeTruthy();
    });
  });

  it('warns that the address is flagged as a scam when the metadata service is on', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs(metadataEnvs, async() => {
      mockAddress(scamAddress);
      await renderAddressPage();

      expect(await screen.findByText(SCAM_ALERT_TEXT)).toBeTruthy();
    });
  });

  it('shows no scam warning for an address that is not flagged', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs([], async() => {
      mockAddress(addressMock.eoa);
      await renderAddressPage();

      // the hash is on screen from the first render (inside the loading skeleton), so it does not
      // prove the address query settled; the title does — the placeholder is a contract,
      // so the page reads "Contract details" until the EOA response replaces it
      expect(await screen.findByText('Address details')).toBeTruthy();
      expect(screen.queryByText(SCAM_ALERT_TEXT)).toBeNull();
    });
  });
});

describe('ens domains lookup', () => {
  it('looks the address up in the name service when ENS is on', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs(ENVS_MAP.nameService, async() => {
      mockAddress(addressMock.eoa);
      await renderAddressPage();

      expect(await screen.findByText('Address details')).toBeTruthy();
      expect(requestedPaths()).toContain(ENS_LOOKUP_PATH);
    });
  });

  it('skips the lookup when only clusters are on', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs([ ...ENVS_MAP.clusters, ...NO_ENS_ENVS ], async() => {
      mockAddress(addressMock.eoa);
      await renderAddressPage();

      expect(await screen.findByText('Address details')).toBeTruthy();
      expect(requestedPaths()).not.toContain(ENS_LOOKUP_PATH);
    });
  });

  it('skips the lookup when no name service is on', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs([ ...NO_ENS_ENVS, ...NO_CLUSTERS_ENVS ], async() => {
      mockAddress(addressMock.eoa);
      await renderAddressPage();

      expect(await screen.findByText('Address details')).toBeTruthy();
      expect(requestedPaths()).not.toContain(ENS_LOOKUP_PATH);
    });
  });
});
