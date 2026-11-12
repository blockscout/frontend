// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import React from 'react';

import type * as adminRs from '@blockscout/admin-rs-types';

import * as mocks from 'src/features/account/mocks/verified-addresses';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, screen, waitFor } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';

const PAYMENT_TX = '0x' + 'a'.repeat(64);
const PAYMENT_TX_URL = 'https://localhost:3006/api/v1/chains/1/token-info-submissions/2/payment-tx';

const paymentTxResponse = { ...mocks.TOKEN_INFO_APPLICATION.IN_PROCESS, paymentTx: PAYMENT_TX };

async function renderForm(application: adminRs.TokenInfoSubmission, onSubmit = vi.fn()): Promise<ReturnType<typeof vi.fn>> {
  await withEnvs(ENVS_MAP.verifiedAddresses, async() => {
    const { render } = await import('vitest/lib');
    const { 'default': TokenInfoForm } = await import('./TokenInfoForm');
    render(
      <TokenInfoForm
        address={ application.tokenAddress }
        tokenName="Test Token (TT)"
        application={ application }
        onSubmit={ onSubmit }
      />,
    );
    await screen.findByRole('button', { name: /request/ });
  });
  return onSubmit;
}

function submitButton(): HTMLButtonElement {
  return screen.getByRole('button', { name: /request/ }) as HTMLButtonElement;
}

function paymentTxInput(): HTMLInputElement {
  return screen.getByLabelText(/Payment transaction hash/) as HTMLInputElement;
}

function requestsTo(url: string): Array<RequestInit> {
  return fetchMock.mock.calls
    .filter(([ input ]) => input === url)
    .map(([ , init ]) => init as RequestInit);
}

describe('TokenInfoForm, application IN_PROCESS', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse((request) => {
      if (request.url.endsWith('/token-info-submissions/selectors')) {
        return { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(mocks.TOKEN_INFO_FORM_CONFIG) };
      }
      if (request.url === PAYMENT_TX_URL) {
        return { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(paymentTxResponse) };
      }
      return { status: 404, body: '{}' };
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('sets the payment tx hash through the dedicated endpoint', async() => {
    const onSubmit = await renderForm(mocks.TOKEN_INFO_APPLICATION.IN_PROCESS);

    expect(submitButton().textContent).toBe('Update request');
    expect(submitButton().disabled).toBe(false);

    fireEvent.change(paymentTxInput(), { target: { value: PAYMENT_TX } });
    fireEvent.click(submitButton());

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(paymentTxResponse));

    const [ request ] = requestsTo(PAYMENT_TX_URL);
    expect(request.method).toBe('PATCH');
    expect(JSON.parse(request.body as string)).toEqual({ paymentTx: PAYMENT_TX });
    expect(requestsTo('https://localhost:3006/api/v1/chains/1/token-info-submissions/2')).toHaveLength(0);
  });

  it('does not send an invalid payment tx hash', async() => {
    const onSubmit = await renderForm(mocks.TOKEN_INFO_APPLICATION.IN_PROCESS);

    fireEvent.change(paymentTxInput(), { target: { value: '0x123' } });
    fireEvent.click(submitButton());

    await screen.findByText(/Incorrect format/);
    expect(requestsTo(PAYMENT_TX_URL)).toHaveLength(0);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('sends the payment tx hash even when a read-only field no longer validates', async() => {
    const onSubmit = await renderForm(mocks.TOKEN_INFO_APPLICATION.IN_PROCESS);

    fireEvent.error(screen.getByAltText('Image preview'));
    await screen.findByText(/Unable to load image/);

    fireEvent.change(paymentTxInput(), { target: { value: PAYMENT_TX } });
    fireEvent.click(submitButton());

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(paymentTxResponse));
    expect(requestsTo(PAYMENT_TX_URL)).toHaveLength(1);
  });

  it('keeps the form read-only once the payment tx hash is set', async() => {
    await renderForm(paymentTxResponse);

    expect(submitButton().textContent).toBe('Send request');
    expect(submitButton().disabled).toBe(true);
    expect(paymentTxInput().readOnly).toBe(true);
  });
});
