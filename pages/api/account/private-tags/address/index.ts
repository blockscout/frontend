import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch';

import getDefaultHeaders from 'pages/api-helpers/getDefaultHeaders';
import getUrl from 'pages/api-helpers/getUrl';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const url = getUrl('/account/v1/user/tags/address');

  switch (_req.method) {
    case 'GET': {
      const response = await fetch(url, {
        method: 'GET',
        headers: getDefaultHeaders(),
      })
      const data = await response.json();

      res.status(200).json(data)
      break;
    }

    case 'POST': {
      const response = await fetch(url, {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: _req.body,
      })
      const data = await response.json();

      res.status(200).json(data)
      break;
    }

    default: {
      res.setHeader('Allow', [ 'GET', 'POST' ])
      res.status(405).end(`Method ${ _req.method } Not Allowed`)
    }
  }
}
