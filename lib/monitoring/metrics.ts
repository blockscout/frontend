import * as promClient from 'prom-client';

const metrics = (() => {
  // eslint-disable-next-line no-restricted-properties
  if (process.env.PROMETHEUS_METRICS_ENABLED !== 'true') {
    return;
  }

  promClient.register.clear();

  const socialPreviewBotRequestCount = new promClient.Counter({
    name: 'social_preview_bot_request_count',
    help: 'Number of incoming requests from social preview bots',
    labelNames: [ 'route', 'bot' ] as const,
  });

  const searchEngineBotRequestCount = new promClient.Counter({
    name: 'search_engine_bot_request_count',
    help: 'Number of incoming requests from search engine bots',
    labelNames: [ 'route', 'bot' ] as const,
  });

  return { socialPreviewBotRequestCount, searchEngineBotRequestCount };
})();

export default metrics;
