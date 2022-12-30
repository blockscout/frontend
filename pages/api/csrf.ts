import type { NextApiRequest, NextApiResponse } from 'next';

import buildUrlNode from 'lib/api/buildUrlNode';
import { httpLogger } from 'lib/api/logger';
import fetchFactory from 'lib/api/nodeFetch';

export default async function csrfHandler(_req: NextApiRequest, res: NextApiResponse) {
  httpLogger(_req, res);

  const url = buildUrlNode('csrf');
  const response = await fetchFactory(_req)(url);

  if (response.status === 200) {
    const token = response.headers.get('x-bs-account-csrf');
    res.status(200).json({ token });
    return;
  }

  const responseError = { statusText: response.statusText, status: response.status };
  httpLogger.logger.error({ err: responseError, url: _req.url });

  res.status(500).json(responseError);
}
