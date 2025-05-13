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
    nextReq.headers['x-endpoint']?.toString() || appConfig.apis.general.endpoint,
  );
  const apiRes = await fetchFactory(nextReq)(
    url.toString(),
    pickBy(pick(nextReq, [ 'body', 'method' ]), Boolean),
  );

  // proxy some headers from API
  const requestId = apiRes.headers.get('x-request-id');
  requestId && nextRes.setHeader('x-request-id', requestId);

  const setCookie = apiRes.headers.raw()['set-cookie'];
  setCookie?.forEach((value) => {
    nextRes.appendHeader('set-cookie', value);
  });
  nextRes.setHeader('content-type', apiRes.headers.get('content-type') || '');

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
