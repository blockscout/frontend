import { afterEach, describe, expect, it, vi } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const sdk = vi.hoisted(() => ({
  init: vi.fn(),
  track: vi.fn(),
}));
vi.mock('mixpanel-browser', () => ({ 'default': sdk }));

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
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize the SDK with the app defaults merged with the config overrides', async() => {
    await initProvider([
      [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', PROJECT_TOKEN ],
      [ 'NEXT_PUBLIC_MIXPANEL_CONFIG_OVERRIDES', '{"persistence":"cookie"}' ],
    ], true);

    expect(sdk.init).toHaveBeenCalledWith(PROJECT_TOKEN, {
      debug: true,
      persistence: 'cookie',
      api_host: 'https://api-eu.mixpanel.com',
    });
  });

  it('should reject when the project token is not configured', async() => {
    await expect(initProvider([])).rejects.toThrow();
    expect(sdk.init).not.toHaveBeenCalled();
  });

  it('should backdate a replayed event with its original call time in epoch seconds', async() => {
    const provider = await initProvider([ [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', PROJECT_TOKEN ] ]);

    provider.track('Button click', { Content: 'burger menu' }, { timestamp: CALL_TIME_MS });

    expect(sdk.track).toHaveBeenCalledWith('Button click', { time: CALL_TIME_S, Content: 'burger menu' }, undefined);
  });

  it('should keep a caller-provided time property on replay', async() => {
    const provider = await initProvider([ [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', PROJECT_TOKEN ] ]);

    provider.track('Button click', { time: 1_600_000_000 }, { timestamp: CALL_TIME_MS });

    expect(sdk.track).toHaveBeenCalledWith('Button click', { time: 1_600_000_000 }, undefined);
  });

  it('should send an event immediately when asked to', async() => {
    const provider = await initProvider([ [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', PROJECT_TOKEN ] ]);

    provider.track('Account access', { Action: 'Logged out' }, { sendImmediately: true });

    expect(sdk.track).toHaveBeenCalledWith('Account access', { Action: 'Logged out' }, { send_immediately: true });
  });
});
