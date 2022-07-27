import type { NextApiRequest, NextApiResponse } from 'next'

import fetch from 'pages/api/utils/fetch';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const url = '/account/v1/user/tags/address';

  switch (_req.method) {
    case 'GET': {
      const response = await fetch(url)
      const data = await response.json();

      res.status(200).json(data)
      break;
    }

    case 'POST': {
      const response = await fetch(url, {
        method: 'POST',
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
