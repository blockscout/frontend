// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import mixpanel from 'mixpanel-browser';
import React from 'react';

import * as adminRs from '@blockscout/admin-rs-types';

import * as mocks from 'src/features/account/mocks/verified-addresses';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, screen, waitFor } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';

const PAYMENT_TX = '0x' + 'a'.repeat(64);
const APPLICATIONS_URL = 'https://localhost:3006/api/v1/chains/1/token-info-submissions';
const PAYMENT_TX_URL = `${ APPLICATIONS_URL }/2/payment-tx`;

const paymentTxResponse = { ...mocks.TOKEN_INFO_APPLICATION.IN_PROCESS, paymentTx: PAYMENT_TX };

function jsonResponse(body: unknown, status = 200): { status: number; headers: Record<string, string>; body: string } {
  return { status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

async function renderForm(application: adminRs.TokenInfoSubmission | undefined, onSubmit = vi.fn()): Promise<ReturnType<typeof vi.fn>> {
  await withEnvs([ ...ENVS_MAP.verifiedAddresses, [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', 'test-mixpanel' ] ], async() => {
    const { init } = await import('src/shared/analytics/queue');
    const { getEnabledProviders } = await import('src/shared/analytics/providers');
    await init(getEnabledProviders().map((provider) => ({ provider, options: { debug: false } })), () => {});
    const { render } = await import('vitest/lib');
    const { Toaster } = await import('src/toolkit/chakra/toaster');
    const { 'default': TokenInfoForm } = await import('./TokenInfoForm');
    render(
      <>
        <TokenInfoForm
          address={ application?.tokenAddress ?? mocks.VERIFIED_ADDRESS.ITEM_1.contractAddress }
          tokenName="Test Token (TT)"
          application={ application }
          onSubmit={ onSubmit }
        />
        <Toaster/>
      </>,
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

function fillRequiredFields(): void {
  const values: Array<[ RegExp, string ]> = [
    [ /Requester name/, 'Tom' ],
    [ /Requester email/, 'tom@example.com' ],
    [ /Official project email address/, 'token@example.com' ],
    [ /Official project website/, 'https://example.com' ],
    [ /Link to icon URL/, 'https://example.com/icon.png' ],
    [ /Project description/, 'description' ],
  ];
  for (const [ label, value ] of values) {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  }
}

beforeEach(() => {
  vi.spyOn(mixpanel, 'init').mockImplementation(() => undefined);
  vi.spyOn(mixpanel, 'track').mockImplementation(() => undefined);
});

afterEach(cleanup);

describe('TokenInfoForm, application IN_PROCESS', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse((request) => {
      if (request.url.endsWith('/token-info-submissions/selectors')) {
        return jsonResponse(mocks.TOKEN_INFO_FORM_CONFIG);
      }
      if (request.url === PAYMENT_TX_URL) {
        return jsonResponse(paymentTxResponse);
      }
      return { status: 404, body: '{}' };
    });
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

  it('keeps the button loading until the payment tx hash is sent', async() => {
    let release: () => void = () => {};
    const pending = new Promise<void>((resolve) => {
      release = resolve;
    });
    fetchMock.mockResponse(async(request) => {
      if (request.url.endsWith('/token-info-submissions/selectors')) {
        return jsonResponse(mocks.TOKEN_INFO_FORM_CONFIG);
      }
      await pending;
      return jsonResponse(paymentTxResponse);
    });
    const onSubmit = await renderForm(mocks.TOKEN_INFO_APPLICATION.IN_PROCESS);

    fireEvent.change(paymentTxInput(), { target: { value: PAYMENT_TX } });
    fireEvent.click(submitButton());

    await waitFor(() => expect(submitButton().disabled).toBe(true));
    expect(onSubmit).not.toHaveBeenCalled();

    release();

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(paymentTxResponse));
    await waitFor(() => expect(submitButton().disabled).toBe(false));
  });

  it('shows the API error and lets the user retry when the payment tx hash is rejected', async() => {
    fetchMock.mockResponse((request) => {
      if (request.url.endsWith('/token-info-submissions/selectors')) {
        return jsonResponse(mocks.TOKEN_INFO_FORM_CONFIG);
      }
      return jsonResponse({ message: 'Payment transaction is already set' }, 400);
    });
    const onSubmit = await renderForm(mocks.TOKEN_INFO_APPLICATION.IN_PROCESS);

    fireEvent.change(paymentTxInput(), { target: { value: PAYMENT_TX } });
    fireEvent.click(submitButton());

    await screen.findByText('Payment transaction is already set');
    expect(onSubmit).not.toHaveBeenCalled();
    expect(submitButton().disabled).toBe(false);
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

describe('TokenInfoForm, new application', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse((request) => {
      if (request.url.endsWith('/token-info-submissions/selectors')) {
        return jsonResponse(mocks.TOKEN_INFO_FORM_CONFIG);
      }
      if (request.url === APPLICATIONS_URL) {
        return jsonResponse(mocks.TOKEN_INFO_APPLICATION.IN_PROCESS);
      }
      return { status: 404, body: '{}' };
    });
  });

  it('creates the application and logs the submit event', async() => {
    const onSubmit = await renderForm(undefined);

    expect(submitButton().textContent).toBe('Send request');
    expect(mixpanel.track).toHaveBeenCalledWith('Verify token', { Action: 'Form opened' }, undefined);
    expect(mixpanel.track).not.toHaveBeenCalledWith('Verify token', { Action: 'Submit' }, undefined);

    fillRequiredFields();
    fireEvent.click(submitButton());

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(mocks.TOKEN_INFO_APPLICATION.IN_PROCESS));
    const [ request ] = requestsTo(APPLICATIONS_URL);
    expect(request.method).toBe('POST');
    expect(mixpanel.track).toHaveBeenCalledWith('Verify token', { Action: 'Submit' }, undefined);
  });

  it('shows the API error and does not log the submit event when the application is rejected', async() => {
    fetchMock.mockResponse((request) => {
      if (request.url.endsWith('/token-info-submissions/selectors')) {
        return jsonResponse(mocks.TOKEN_INFO_FORM_CONFIG);
      }
      return jsonResponse({ message: 'Address is not verified' }, 400);
    });
    const onSubmit = await renderForm(undefined);

    fillRequiredFields();
    fireEvent.click(submitButton());

    await screen.findByText('Address is not verified');
    expect(onSubmit).not.toHaveBeenCalled();
    expect(mixpanel.track).not.toHaveBeenCalledWith('Verify token', { Action: 'Submit' }, undefined);
  });
});

describe('TokenInfoForm, application UPDATE_REQUIRED', () => {
  const application = { ...mocks.TOKEN_INFO_APPLICATION.APPROVED, status: adminRs.TokenInfoSubmissionStatus.UPDATE_REQUIRED };
  const updatedResponse = { ...application, status: adminRs.TokenInfoSubmissionStatus.IN_PROCESS };

  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse((request) => {
      if (request.url.endsWith('/token-info-submissions/selectors')) {
        return jsonResponse(mocks.TOKEN_INFO_FORM_CONFIG);
      }
      if (request.url === `${ APPLICATIONS_URL }/${ application.id }`) {
        return jsonResponse(updatedResponse);
      }
      return { status: 404, body: '{}' };
    });
  });

  it('updates the existing application in place without logging the submit event', async() => {
    const onSubmit = await renderForm(application);

    fireEvent.click(submitButton());

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(updatedResponse));
    const [ request ] = requestsTo(`${ APPLICATIONS_URL }/${ application.id }`);
    expect(request.method).toBe('PUT');
    expect(requestsTo(APPLICATIONS_URL)).toHaveLength(0);
    expect(mixpanel.track).not.toHaveBeenCalledWith('Verify token', { Action: 'Submit' }, undefined);
  });
});
