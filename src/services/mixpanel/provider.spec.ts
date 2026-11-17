import mixpanel from 'mixpanel-browser';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const PROJECT_TOKEN = 'test-token';
const CALL_TIME_MS = 1_752_600_000_000;
const CALL_TIME_S = 1_752_600_000;

async function initProvider(envs: Array<[ string, string ]>, debug = false) {
  return withEnvs(envs, async() => {
    const { mixpanelProvider } = await import('./provider');
    await mixpanelProvider.init({ debug });
    return mixpanelProvider;
  });
}

describe('mixpanel provider', () => {
  beforeEach(() => {
    vi.spyOn(mixpanel, 'init').mockImplementation(() => undefined);
    vi.spyOn(mixpanel, 'track').mockImplementation(() => undefined);
    vi.spyOn(mixpanel, 'identify').mockImplementation(() => undefined);
    // the real `init` is what creates the `people` slot
    Object.defineProperty(mixpanel, 'people', { configurable: true, value: { set: vi.fn(), set_once: vi.fn() } });
  });

  afterEach(() => {
    Reflect.deleteProperty(mixpanel, 'people');
  });

  it('should initialize the SDK with the app defaults merged with the config overrides', async() => {
    await initProvider([
      [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', PROJECT_TOKEN ],
      [ 'NEXT_PUBLIC_MIXPANEL_CONFIG_OVERRIDES', '{"persistence":"cookie"}' ],
    ], true);

    expect(mixpanel.init).toHaveBeenCalledWith(PROJECT_TOKEN, {
      debug: true,
      persistence: 'cookie',
      api_host: 'https://api-eu.mixpanel.com',
    });
  });

  it('should reject when the project token is not configured', async() => {
    await expect(initProvider([])).rejects.toThrow();
    expect(mixpanel.init).not.toHaveBeenCalled();
  });

  it('should backdate a replayed event with its original call time in epoch seconds', async() => {
    const provider = await initProvider([ [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', PROJECT_TOKEN ] ]);

    provider.track('Button click', { Content: 'burger menu' }, { timestamp: CALL_TIME_MS });

    expect(mixpanel.track).toHaveBeenCalledWith('Button click', { time: CALL_TIME_S, Content: 'burger menu' }, undefined);
  });

  it('should keep a caller-provided time property on replay', async() => {
    const provider = await initProvider([ [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', PROJECT_TOKEN ] ]);

    provider.track('Button click', { time: 1_600_000_000 }, { timestamp: CALL_TIME_MS });

    expect(mixpanel.track).toHaveBeenCalledWith('Button click', { time: 1_600_000_000 }, undefined);
  });

  it('should send an event immediately when asked to', async() => {
    const provider = await initProvider([ [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', PROJECT_TOKEN ] ]);

    provider.track('Account access', { Action: 'Logged out' }, { sendImmediately: true });

    expect(mixpanel.track).toHaveBeenCalledWith('Account access', { Action: 'Logged out' }, { send_immediately: true });
  });

  it('should write profile props passed with identify through the people set and set-once slots', async() => {
    const provider = await initProvider([ [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', PROJECT_TOKEN ] ]);

    provider.identify('user-uuid', { set: { 'Device Type': 'Desktop' }, setOnce: { 'First Time Join': '2026-01-01T00:00:00.000Z' } });

    expect(mixpanel.identify).toHaveBeenCalledWith('user-uuid');
    expect(mixpanel.people.set).toHaveBeenCalledWith({ 'Device Type': 'Desktop' });
    expect(mixpanel.people.set_once).toHaveBeenCalledWith({ 'First Time Join': '2026-01-01T00:00:00.000Z' });
  });

  it('should not touch the people profile when identify carries no profile props', async() => {
    const provider = await initProvider([ [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', PROJECT_TOKEN ] ]);

    provider.identify('user-uuid');

    expect(mixpanel.identify).toHaveBeenCalledWith('user-uuid');
    expect(mixpanel.people.set).not.toHaveBeenCalled();
    expect(mixpanel.people.set_once).not.toHaveBeenCalled();
  });
});
