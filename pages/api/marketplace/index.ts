import type { NextApiRequest, NextApiResponse } from 'next';

import config from 'configs/marketplace/eth-goerli.json';
import { httpLogger } from 'lib/api/logger';

export default async function marketplaceIndexHandler(_req: NextApiRequest, res: NextApiResponse) {
  httpLogger(_req, res);

  res.status(200).json(config);
}
