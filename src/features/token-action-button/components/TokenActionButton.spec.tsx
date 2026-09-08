// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import React from 'react';

import { afterEach, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';

afterEach(cleanup);

const BUTTON_TEXT = 'Buy on Arc Portal';
const CONFIGURED_URL = 'https://portal.arc.io/swap';

const envs: Array<[ string, string ]> = [
  [ 'NEXT_PUBLIC_TOKEN_ACTION_BUTTON_CONFIG', `{"text":"${ BUTTON_TEXT }","url":"${ CONFIGURED_URL }"}` ],
];

const envsWithMalformedUrl: Array<[ string, string ]> = [
  [ 'NEXT_PUBLIC_TOKEN_ACTION_BUTTON_CONFIG', `{"text":"${ BUTTON_TEXT }","url":"not a url"}` ],
];

it('renders nothing when the button is not configured', async() => {
  const { 'default': TokenActionButton } = await import('./TokenActionButton');

  render(<TokenActionButton tokenType="ERC-20"/>);

  expect(screen.queryByText(BUTTON_TEXT)).toBeNull();
});

it('renders nothing when the configured url is malformed', async() => {
  await withEnvs(envsWithMalformedUrl, async() => {
    const { 'default': TokenActionButton } = await import('./TokenActionButton');

    render(<TokenActionButton tokenType="ERC-20"/>);

    expect(screen.queryByText(BUTTON_TEXT)).toBeNull();
  });
});

it('renders nothing for a token that is not ERC-20', async() => {
  await withEnvs(envs, async() => {
    const { 'default': TokenActionButton } = await import('./TokenActionButton');

    render(<TokenActionButton tokenType="ERC-721"/>);

    expect(screen.queryByText(BUTTON_TEXT)).toBeNull();
  });
});

it('renders while the token type is still unknown', async() => {
  await withEnvs(envs, async() => {
    const { 'default': TokenActionButton } = await import('./TokenActionButton');

    render(<TokenActionButton tokenType={ undefined } isLoading/>);

    expect(screen.queryByText(BUTTON_TEXT)).not.toBeNull();
  });
});

it('opens the configured url in a new tab, with utm params appended', async() => {
  await withEnvs(envs, async() => {
    const { 'default': TokenActionButton } = await import('./TokenActionButton');

    render(<TokenActionButton tokenType="ERC-20"/>);

    const link = screen.getByRole('link', { name: BUTTON_TEXT });
    expect(link.getAttribute('href')).toBe(`${ CONFIGURED_URL }?utm_source=blockscout&utm_medium=token`);
    expect(link.getAttribute('target')).toBe('_blank');
  });
});
