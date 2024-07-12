import { pick, pickBy } from 'es-toolkit';
import type { NextApiRequest, NextApiResponse } from 'next';

import fetchFactory from 'nextjs/utils/fetchProxy';

import appConfig from 'configs/app';

const handler = async(nextReq: NextApiRequest, nextRes: NextApiResponse) => {
  if (!nextReq.url) {
    nextRes.status(500).json({ error: 'no url provided' });
    return;
  }

  const url = new URL(
    nextReq.url.replace(/^\/node-api\/proxy/, ''),
    nextReq.headers['x-endpoint']?.toString() || appConfig.api.endpoint,
  );
  const apiRes = await fetchFactory(nextReq)(
    url.toString(),
    pickBy(pick(nextReq, [ 'body', 'method' ]), Boolean),
  );

  // proxy some headers from API
  nextRes.setHeader('x-request-id', apiRes.headers.get('x-request-id') || '');
  nextRes.setHeader('set-cookie', apiRes.headers.get('set-cookie') || '');

  nextRes.status(apiRes.status).send(apiRes.body);
};

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};
