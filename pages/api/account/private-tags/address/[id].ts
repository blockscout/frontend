import type { NextApiRequest, NextApiResponse } from 'next'

import fetch from 'api/utils/fetch';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { id } = _req.query;
  const url = `/account/v1/user/tags/address/${ id }`;

  switch (_req.method) {
    case 'DELETE': {
      await fetch(url, { method: 'DELETE' })
      res.status(200);
      break;
    }

    default: {
      res.setHeader('Allow', [ 'DELETE' ])
      res.status(405).end(`Method ${ _req.method } Not Allowed`)
    }
  }
}
