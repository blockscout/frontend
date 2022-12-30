import _pick from 'lodash/pick';
import _pickBy from 'lodash/pickBy';
import type { NextApiRequest, NextApiResponse } from 'next';

import appConfig from 'configs/app/config';
import fetchFactory from 'lib/api/nodeFetch';

const handler = async(_req: NextApiRequest, res: NextApiResponse) => {
  if (!_req.url) {
    res.status(500).json({ error: 'no url provided' });
    return;
  }

  const url = new URL(
    _req.url.replace(/^\/node-api\/proxy/, ''),
    _req.headers['x-endpoint']?.toString() || appConfig.api.endpoint,
  );
  const response = await fetchFactory(_req)(
    url.toString(),
    _pickBy(_pick(_req, [ 'body', 'method' ]), Boolean),
  );

  res.status(response.status).send(response.body);
};

export default handler;
