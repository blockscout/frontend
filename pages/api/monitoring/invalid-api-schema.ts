import type { NextApiRequest, NextApiResponse } from 'next';
import * as v from 'valibot';

import metrics from 'lib/monitoring/metrics';

const PayloadSchema = v.object({
  resource: v.string(),
  url: v.string(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload = JSON.parse(req.body);
    metrics?.invalidApiSchema.inc(v.parse(PayloadSchema, payload));
  } catch (error) {}
  res.status(200).json({ status: 'ok' });
}
