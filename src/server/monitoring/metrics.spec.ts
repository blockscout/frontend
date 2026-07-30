// SPDX-License-Identifier: LicenseRef-Blockscout

import { beforeEach, describe, expect, it, vi } from 'vitest';

// Next.js instantiates this module once per server bundle; `vi.resetModules()` stands in for that
// second instantiation, which is the only way the registry sharing can be exercised in a test.
const importFreshModuleInstance = () => {
  vi.resetModules();
  return import('./metrics');
};

describe('server metrics', () => {
  beforeEach(() => {
    vi.stubEnv('PROMETHEUS_METRICS_ENABLED', 'true');
    delete (globalThis as { __blockscoutMetricsStore?: unknown }).__blockscoutMetricsStore;
  });

  it('exposes samples recorded by another module instance', async() => {
    const renderingBundle = await importFreshModuleInstance();
    renderingBundle.default?.socialPreviewBotRequests.inc({ route: '/tx/[hash]', bot: 'twitter' });

    const apiRouteBundle = await importFreshModuleInstance();

    expect(apiRouteBundle.registry).toBe(renderingBundle.registry);
    await expect(apiRouteBundle.registry?.metrics()).resolves.toContain(
      'social_preview_bot_requests_total{route="/tx/[hash]",bot="twitter"} 1',
    );
  });

  it('keeps the default process metrics registered', async() => {
    const { registry } = await importFreshModuleInstance();

    await expect(registry?.metrics()).resolves.toContain('frontend_nodejs_version_info');
  });

  it('records nothing when metrics are disabled', async() => {
    vi.stubEnv('PROMETHEUS_METRICS_ENABLED', 'false');

    const { 'default': metrics, registry } = await importFreshModuleInstance();

    expect(metrics).toBeUndefined();
    expect(registry).toBeUndefined();
  });
});
