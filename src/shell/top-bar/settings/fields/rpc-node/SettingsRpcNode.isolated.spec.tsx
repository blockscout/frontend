// @vitest-environment jsdom

import Cookies from 'js-cookie';
import React from 'react';

import * as cookies from 'src/shared/storage/cookies';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from 'vitest/lib';

import SettingsRpcNode from './SettingsRpcNode';

const analyticsMock = vi.hoisted(() => ({
  logEvent: vi.fn(),
  EventTypes: { RPC_NODE: 'RPC node' },
}));

vi.mock('src/shared/analytics', () => analyticsMock);

const CUSTOM_URL = 'https://rpc.example.com/eth';
const IMMEDIATE = { sendImmediately: true };

function typeUrl(value: string): void {
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value } });
  fireEvent.blur(input);
}

function button(name: string | RegExp): HTMLButtonElement {
  return screen.getByRole('button', { name }) as HTMLButtonElement;
}

function setSavedNode(url: string, isInUse: boolean): void {
  Cookies.set(cookies.NAMES.CUSTOM_RPC_URL, url);
  if (isInUse) {
    Cookies.set(cookies.NAMES.CUSTOM_RPC_IN_USE, 'true');
  }
}

describe('SettingsRpcNode', () => {
  const reload = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('location', { ...window.location, reload });
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({ jsonrpc: '2.0', id: 1, result: '0x1' }));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    reload.mockReset();
    analyticsMock.logEvent.mockReset();
    Cookies.remove(cookies.NAMES.CUSTOM_RPC_URL);
    Cookies.remove(cookies.NAMES.CUSTOM_RPC_IN_USE);
  });

  it('with no saved URL shows an empty field, no plug and no status', () => {
    render(<SettingsRpcNode/>);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('');
    expect(input.getAttribute('spellcheck')).toBe('false');
    expect(button('Save').disabled).toBe(true);
    expect(screen.queryByRole('button', { name: /RPC node$/ })).toBeNull();
    expect(screen.queryByText(/Using/)).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('flags a non-https value as invalid and keeps Save disabled', async() => {
    render(<SettingsRpcNode/>);

    typeUrl('http://rpc.example.com');

    await waitFor(() => expect(screen.getByText('Invalid format')).toBeTruthy());
    await waitFor(() => expect(button('Save').disabled).toBe(true));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('saves a valid URL as the node in use and reloads', async() => {
    render(<SettingsRpcNode/>);

    typeUrl(CUSTOM_URL);
    await waitFor(() => expect(button('Save').disabled).toBe(false));
    fireEvent.click(button('Save'));

    await waitFor(() => expect(reload).toHaveBeenCalledTimes(1));
    expect(Cookies.get(cookies.NAMES.CUSTOM_RPC_URL)).toBe(CUSTOM_URL);
    expect(Cookies.get(cookies.NAMES.CUSTOM_RPC_IN_USE)).toBe('true');
    expect(analyticsMock.logEvent).toHaveBeenCalledWith('RPC node', { Action: 'Set' }, IMMEDIATE);
  });

  it('clearing the field and saving forgets the node and reloads', async() => {
    setSavedNode(CUSTOM_URL, true);
    render(<SettingsRpcNode/>);

    expect(button('Save').disabled).toBe(true);
    typeUrl('');
    await waitFor(() => expect(button('Save').disabled).toBe(false));
    fireEvent.click(button('Save'));

    await waitFor(() => expect(reload).toHaveBeenCalledTimes(1));
    expect(Cookies.get(cookies.NAMES.CUSTOM_RPC_URL)).toBeUndefined();
    expect(Cookies.get(cookies.NAMES.CUSTOM_RPC_IN_USE)).toBeUndefined();
    expect(analyticsMock.logEvent).toHaveBeenCalledWith('RPC node', { Action: 'Reset' }, IMMEDIATE);
  });

  it('pings the saved node in use and shows the outcome', async() => {
    setSavedNode(CUSTOM_URL, true);
    render(<SettingsRpcNode/>);

    await waitFor(() => expect(screen.getByText('Connected')).toBeTruthy());
    expect(screen.getByText('Using your custom node')).toBeTruthy();
    expect(fetchMock.mock.calls[0][0]).toBe(CUSTOM_URL);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('keeps a dead node in use and reports it as not responding', async() => {
    fetchMock.mockReject(new TypeError('Failed to fetch'));
    setSavedNode(CUSTOM_URL, true);
    render(<SettingsRpcNode/>);

    await waitFor(() => expect(screen.getByText('Not responding')).toBeTruthy());
    expect(screen.getByText('Using your custom node')).toBeTruthy();
    expect(screen.getByText(/isn't responding/)).toBeTruthy();
    expect(Cookies.get(cookies.NAMES.CUSTOM_RPC_IN_USE)).toBe('true');
  });

  it('warns on a chain mismatch under a connected tag', async() => {
    fetchMock.mockResponse(JSON.stringify({ jsonrpc: '2.0', id: 1, result: '0x89' }));
    setSavedNode(CUSTOM_URL, true);
    render(<SettingsRpcNode/>);

    await waitFor(() => expect(screen.getByText(/different network/)).toBeTruthy());
    expect(screen.getByText('Connected')).toBeTruthy();
  });

  it('disconnects a node in use without forgetting the URL', async() => {
    setSavedNode(CUSTOM_URL, true);
    render(<SettingsRpcNode/>);

    await waitFor(() => expect(screen.getByText('Connected')).toBeTruthy());
    fireEvent.click(button('Disconnect custom RPC node'));

    expect(Cookies.get(cookies.NAMES.CUSTOM_RPC_URL)).toBe(CUSTOM_URL);
    expect(Cookies.get(cookies.NAMES.CUSTOM_RPC_IN_USE)).toBeUndefined();
    expect(analyticsMock.logEvent).toHaveBeenCalledWith('RPC node', { Action: 'Disconnect' }, IMMEDIATE);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('shows a saved but unused node as disconnected without pinging it, and reconnects on click', async() => {
    setSavedNode(CUSTOM_URL, false);
    render(<SettingsRpcNode/>);

    expect(screen.getByText('Disconnected')).toBeTruthy();
    expect(screen.getByText('Using the default node')).toBeTruthy();
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe(CUSTOM_URL);
    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.click(button('Connect custom RPC node'));

    expect(Cookies.get(cookies.NAMES.CUSTOM_RPC_IN_USE)).toBe('true');
    expect(analyticsMock.logEvent).toHaveBeenCalledWith('RPC node', { Action: 'Connect' }, IMMEDIATE);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('disables the plug while the field holds an unsaved value', async() => {
    setSavedNode(CUSTOM_URL, false);
    render(<SettingsRpcNode/>);

    typeUrl(`${ CUSTOM_URL }2`);

    await waitFor(() => expect(button('Connect custom RPC node').disabled).toBe(true));
    expect(button('Save').disabled).toBe(false);
  });
});
