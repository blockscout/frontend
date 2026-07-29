// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextApiRequest, NextApiResponse } from 'next';

import { registry } from 'src/server/monitoring/metrics';

export default async function metricsHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!registry) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  res.setHeader('Content-type', registry.contentType);
  res.send(await registry.metrics());
}
