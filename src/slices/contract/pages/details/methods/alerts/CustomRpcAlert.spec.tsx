// @vitest-environment jsdom

import Cookies from 'js-cookie';
import React from 'react';

import * as cookies from 'src/shared/storage/cookies';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from 'vitest/lib';

import CustomRpcAlert from './CustomRpcAlert';

describe('CustomRpcAlert', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    cleanup();
    Cookies.remove(cookies.NAMES.CUSTOM_RPC_URL);
    Cookies.remove(cookies.NAMES.CUSTOM_RPC_IN_USE);
  });

  it('renders nothing with the default node', () => {
    render(<CustomRpcAlert/>);

    expect(screen.queryByText('Custom RPC')).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('renders nothing while the saved URL is disconnected', () => {
    Cookies.set(cookies.NAMES.CUSTOM_RPC_URL, 'https://rpc.example.com');

    render(<CustomRpcAlert/>);

    expect(screen.queryByText('Custom RPC')).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('pings the node in use and reports the outcome', async() => {
    Cookies.set(cookies.NAMES.CUSTOM_RPC_URL, 'https://rpc.example.com');
    Cookies.set(cookies.NAMES.CUSTOM_RPC_IN_USE, 'true');
    fetchMock.mockResponse(JSON.stringify({ jsonrpc: '2.0', id: 1, result: '0x5' }));

    render(<CustomRpcAlert/>);

    await waitFor(() => expect(screen.getByRole('button', { name: 'Custom RPC: Connected' })).toBeTruthy());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe('https://rpc.example.com');
  });
});
