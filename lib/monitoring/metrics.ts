import * as promClient from 'prom-client';

promClient.register.clear();

export const requestCounter = new promClient.Counter({
  name: 'request_counter',
  help: 'Number of incoming requests',
  labelNames: [ 'route', 'is_bot', 'is_social_preview' ] as const,
});
