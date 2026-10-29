// @vitest-environment jsdom

import Cookies from 'js-cookie';
import React from 'react';
import { BaseError, HttpRequestError } from 'viem';

import { SettingsModalContextProvider } from 'src/shell/top-bar/settings/modal/context';

import * as cookies from 'src/shared/storage/cookies';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from 'vitest/lib';

import ContractMethodResultPublicClient from './ContractMethodResultPublicClient';

const noop = () => {};

function nodeFailure(): Error {
  return new BaseError('call failed', { cause: new HttpRequestError({ url: 'https://rpc.example.com', status: 503 }) });
}

describe('ContractMethodResultPublicClient', () => {
  afterEach(() => {
    cleanup();
    Cookies.remove(cookies.NAMES.CUSTOM_RPC_URL);
    Cookies.remove(cookies.NAMES.CUSTOM_RPC_IN_USE);
  });

  it('suggests a custom node when the default node fails', () => {
    render(<ContractMethodResultPublicClient data={ nodeFailure() } onSettle={ noop }/>);

    expect(screen.getByText(/The RPC node is not responding/)).toBeTruthy();
    expect(screen.getByText('Try your own RPC node.')).toBeTruthy();
  });

  it('asks to change the URL when the custom node fails', () => {
    Cookies.set(cookies.NAMES.CUSTOM_RPC_URL, 'https://rpc.example.com');
    Cookies.set(cookies.NAMES.CUSTOM_RPC_IN_USE, 'true');

    render(<ContractMethodResultPublicClient data={ nodeFailure() } onSettle={ noop }/>);

    expect(screen.getByText(/Your RPC node is not responding/)).toBeTruthy();
    expect(screen.getByText('Check the RPC node URL and try again.')).toBeTruthy();
  });

  it('opens the settings modal on the RPC node tab from the link', async() => {
    render(
      <SettingsModalContextProvider>
        <ContractMethodResultPublicClient data={ nodeFailure() } onSettle={ noop }/>
      </SettingsModalContextProvider>,
    );

    fireEvent.click(screen.getByText('Try your own RPC node.'));

    await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy());
    expect(screen.getByRole('textbox', { name: 'RPC node URL' })).toBeTruthy();
  });

  it('keeps the short message for a contract error', () => {
    const revert = new BaseError('Execution reverted for an unknown reason.');

    render(<ContractMethodResultPublicClient data={ revert } onSettle={ noop }/>);

    expect(screen.getByText(revert.shortMessage)).toBeTruthy();
    expect(screen.queryByText(/not responding/)).toBeNull();
  });

  it('calls onSettle once rendered', () => {
    const onSettle = vi.fn();

    render(<ContractMethodResultPublicClient data={ undefined } estimatedGas={ BigInt(21000) } onSettle={ onSettle }/>);

    expect(onSettle).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Estimated gas: 21,000/)).toBeTruthy();
  });
});
