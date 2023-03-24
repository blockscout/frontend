import type { NextApiRequest, NextApiResponse } from 'next';

import config from 'configs/marketplace/eth-goerli.json';
import { httpLogger } from 'lib/api/logger';

export default async function marketplaceAppIdHandler(_req: NextApiRequest, res: NextApiResponse) {
  httpLogger(_req, res);

  const id = _req.query.id;
  const app = config.find(app => app.id === id);

  if (!app) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(200).json(app);
}
