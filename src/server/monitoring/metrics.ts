// SPDX-License-Identifier: LicenseRef-Blockscout

import * as promClient from 'prom-client';

const createStore = () => {
  const registry = new promClient.Registry();

  promClient.collectDefaultMetrics({ prefix: 'frontend_', register: registry });

  const invalidApiSchema = new promClient.Counter({
    name: 'invalid_api_schema',
    help: 'Number of invalid external API schema events',
    labelNames: [ 'resource', 'url' ] as const,
    registers: [ registry ],
  });

  const socialPreviewBotRequests = new promClient.Counter({
    name: 'social_preview_bot_requests_total',
    help: 'Number of incoming requests from social preview bots',
    labelNames: [ 'route', 'bot' ] as const,
    registers: [ registry ],
  });

  const searchEngineBotRequests = new promClient.Counter({
    name: 'search_engine_bot_requests_total',
    help: 'Number of incoming requests from search engine bots',
    labelNames: [ 'route', 'bot' ] as const,
    registers: [ registry ],
  });

  const apiRequestDuration = new promClient.Histogram({
    name: 'api_request_duration_seconds',
    help: 'Duration of requests to API in seconds',
    labelNames: [ 'route', 'code' ],
    buckets: [ 0.2, 0.5, 1, 3, 10 ],
    registers: [ registry ],
  });

  return {
    registry,
    metrics: { invalidApiSchema, socialPreviewBotRequests, searchEngineBotRequests, apiRequestDuration },
  };
};

// Next.js compiles API routes and page rendering into separate server bundles, so this module is
// instantiated more than once inside a single server process. Every instance has to end up with the
// same metric objects: metrics created by one instance and not reachable from the instance behind
// /api/metrics record samples that are never exported. globalThis is the only thing the instances
// share, so the store is cached there and built at most once per process.
const globalStore = globalThis as typeof globalThis & {
  __blockscoutMetricsStore?: ReturnType<typeof createStore>;
};

const store = (() => {
  if (process.env.PROMETHEUS_METRICS_ENABLED !== 'true') {
    return;
  }

  globalStore.__blockscoutMetricsStore = globalStore.__blockscoutMetricsStore ?? createStore();

  return globalStore.__blockscoutMetricsStore;
})();

export const registry = store?.registry;

export default store?.metrics;
