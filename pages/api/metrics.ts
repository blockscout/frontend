import type { NextApiRequest, NextApiResponse } from 'next';
import * as promClient from 'prom-client';

// eslint-disable-next-line no-restricted-properties
const isEnabled = process.env.PROMETHEUS_METRICS_ENABLED === 'true';

isEnabled && promClient.collectDefaultMetrics({ prefix: 'frontend_' });

export default async function metricsHandler(req: NextApiRequest, res: NextApiResponse) {
  const metrics = await promClient.register.metrics();
  res.setHeader('Content-type', promClient.register.contentType);
  res.send(metrics);
}
