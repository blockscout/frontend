import _pick from 'lodash/pick';
import _pickBy from 'lodash/pickBy';
import type { NextApiRequest, NextApiResponse } from 'next';

import fetchFactory from 'lib/api/fetch';

const handler = async(_req: NextApiRequest, res: NextApiResponse) => {
  if (!_req.url) {
    res.status(500).json({ error: 'no url provided' });
    return;
  }

  const response = await fetchFactory(_req)(
    _req.url.replace(/^\/proxy/, ''),
    _pickBy(_pick(_req, [ 'body', 'method' ]), Boolean),
  );

  // don't think that we have to proxy all headers, so pick only necessary ones
  [ 'x-bs-account-csrf' ].forEach((headerName) => {
    const headerValue = response.headers.get(headerName);
    headerValue && res.setHeader(headerName, headerValue);
  });

  res.status(response.status).send(response.body);
};

export default handler;
