import { afterEach, describe, expect, it, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const sdk = vi.hoisted(() => ({
  init: vi.fn(),
  capture: vi.fn(),
  identify: vi.fn(),
  setPersonProperties: vi.fn(),
}));
vi.mock('posthog-js', () => ({ 'default': sdk }));

const API_KEY = 'phc_test';
const CALL_TIME_MS = 1_752_600_000_000;
const NO_TRACK_OPTIONS = {};

async function initProvider(envs: Array<[ string, string ]>, debug = false) {
  return withEnvs(envs, async() => {
    const { posthogProvider } = await import('./provider');
    await posthogProvider.init({ debug });
    return posthogProvider;
  });
}

describe('posthog provider', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize the SDK with the app defaults', async() => {
    await initProvider([ [ 'NEXT_PUBLIC_POSTHOG_API_KEY', API_KEY ] ], true);

    expect(sdk.init).toHaveBeenCalledWith(API_KEY, {
      api_host: 'https://eu.i.posthog.com',
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      disable_session_recording: true,
      advanced_disable_flags: true,
      persistence: 'localStorage',
      debug: true,
    });
  });

  it('should let the config overrides win over the app defaults', async() => {
    await initProvider([
      [ 'NEXT_PUBLIC_POSTHOG_API_KEY', API_KEY ],
      [ 'NEXT_PUBLIC_POSTHOG_CONFIG_OVERRIDES', '{"disable_session_recording":false,"api_host":"https://us.i.posthog.com"}' ],
    ]);

    expect(sdk.init).toHaveBeenCalledWith(API_KEY, expect.objectContaining({
      disable_session_recording: false,
      api_host: 'https://us.i.posthog.com',
      autocapture: false,
    }));
  });

  it('should reject when the API key is not configured', async() => {
    await expect(initProvider([])).rejects.toThrow();
    expect(sdk.init).not.toHaveBeenCalled();
  });

  it('should send a page view as the native $pageview event with its properties unchanged', async() => {
    const provider = await initProvider([ [ 'NEXT_PUBLIC_POSTHOG_API_KEY', API_KEY ] ]);
    const properties = { 'Page type': 'Homepage', Tab: 'Not applicable', 'Color mode': 'light', 'Color theme': 'light' };

    provider.track('Page view', properties, NO_TRACK_OPTIONS);

    expect(sdk.capture).toHaveBeenCalledWith('$pageview', properties, undefined);
  });

  it('should send any other event under its own name', async() => {
    const provider = await initProvider([ [ 'NEXT_PUBLIC_POSTHOG_API_KEY', API_KEY ] ]);

    provider.track('Button click', { Content: 'burger menu' }, NO_TRACK_OPTIONS);

    expect(sdk.capture).toHaveBeenCalledWith('Button click', { Content: 'burger menu' }, undefined);
  });

  it('should backdate a replayed event with its original call time', async() => {
    const provider = await initProvider([ [ 'NEXT_PUBLIC_POSTHOG_API_KEY', API_KEY ] ]);

    provider.track('Button click', { Content: 'burger menu' }, { timestamp: CALL_TIME_MS });

    expect(sdk.capture).toHaveBeenCalledWith('Button click', { Content: 'burger menu' }, { timestamp: new Date(CALL_TIME_MS) });
  });

  it('should send an event immediately when asked to', async() => {
    const provider = await initProvider([ [ 'NEXT_PUBLIC_POSTHOG_API_KEY', API_KEY ] ]);

    provider.track('Account access', { Action: 'Logged out' }, { sendImmediately: true, timestamp: CALL_TIME_MS });

    expect(sdk.capture).toHaveBeenCalledWith(
      'Account access',
      { Action: 'Logged out' },
      { send_instantly: true, timestamp: new Date(CALL_TIME_MS) },
    );
  });

  it('should write person properties through the set and set-once slots', async() => {
    const provider = await initProvider([ [ 'NEXT_PUBLIC_POSTHOG_API_KEY', API_KEY ] ]);

    provider.peopleSet({ 'Device Type': 'Desktop' });
    provider.peopleSetOnce({ 'First Time Join': '2026-01-01T00:00:00.000Z' });

    expect(sdk.setPersonProperties).toHaveBeenNthCalledWith(1, { 'Device Type': 'Desktop' });
    expect(sdk.setPersonProperties).toHaveBeenNthCalledWith(2, undefined, { 'First Time Join': '2026-01-01T00:00:00.000Z' });
  });

  it('should identify the user only when the distinct id is known', async() => {
    const provider = await initProvider([ [ 'NEXT_PUBLIC_POSTHOG_API_KEY', API_KEY ] ]);

    provider.identify(undefined);
    provider.identify('user-uuid');

    expect(sdk.identify).toHaveBeenCalledTimes(1);
    expect(sdk.identify).toHaveBeenCalledWith('user-uuid');
  });
});
