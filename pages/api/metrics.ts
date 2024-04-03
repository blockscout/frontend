import type { NextApiRequest, NextApiResponse } from 'next';
import * as promClient from 'prom-client';

promClient.collectDefaultMetrics();

export default async function metricsHandler(req: NextApiRequest, res: NextApiResponse) {
  const metrics = await promClient.register.metrics();
  res.setHeader('Content-type', promClient.register.contentType);
  res.send(metrics);
}
