import { pick, pickBy } from 'es-toolkit';
import type { NextApiRequest, NextApiResponse } from 'next';

import fetchFactory from 'nextjs/utils/fetchProxy';

import appConfig from 'configs/app';

// Define an allow-list of permitted endpoints
const ALLOWED_ENDPOINTS = [
  appConfig.apis.general.endpoint,
  // Add other allowed endpoints here, e.g.:
  // "https://api.example.com",
];

const handler = async(nextReq: NextApiRequest, nextRes: NextApiResponse) => {
  if (!nextReq.url) {
    nextRes.status(500).json({ error: 'no url provided' });
    return;
  }

  // Validate x-endpoint header against allow-list
  let baseEndpoint = appConfig.apis.general.endpoint;
  const requestedEndpoint = nextReq.headers['x-endpoint']?.toString();
  if (requestedEndpoint && ALLOWED_ENDPOINTS.includes(requestedEndpoint)) {
    baseEndpoint = requestedEndpoint;
  } else if (requestedEndpoint) {
    nextRes.status(400).json({ error: 'Invalid endpoint' });
    return;
  }

  const url = new URL(
    nextReq.url.replace(/^\/node-api\/proxy/, ''),
    baseEndpoint,
  );
  const apiRes = await fetchFactory(nextReq)(
    url.toString(),
    pickBy(pick(nextReq, [ 'body', 'method' ]), Boolean),
  );

  // proxy some headers from API
  const HEADERS_TO_PROXY = [
    'x-request-id',
    'content-type',
    'bypass-429-option',
    'x-ratelimit-limit',
    'x-ratelimit-remaining',
    'x-ratelimit-reset',
  ];

  HEADERS_TO_PROXY.forEach((header) => {
    const value = apiRes.headers.get(header);
    value && nextRes.setHeader(header, value);
  });

  const setCookie = apiRes.headers.raw()['set-cookie'];
  setCookie?.forEach((value) => {
    nextRes.appendHeader('set-cookie', value);
  });

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
