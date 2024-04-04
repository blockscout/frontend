import * as promClient from 'prom-client';

const metrics = (() => {
  // eslint-disable-next-line no-restricted-properties
  if (process.env.PROMETHEUS_METRICS_ENABLED !== 'true') {
    return;
  }

  promClient.register.clear();

  const requestCounter = new promClient.Counter({
    name: 'request_counter',
    help: 'Number of incoming requests',
    labelNames: [ 'route', 'bot' ] as const,
  });

  return { requestCounter };
})();

export default metrics;
