import type { NextApiRequest, NextApiResponse } from 'next'

import fetch from 'api/utils/fetch';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { id } = _req.query;
  const url = `/account/v1/user/tags/transaction/${ id }`;

  switch (_req.method) {
    case 'DELETE': {
      const response = await fetch(url, { method: 'DELETE' });
      // FIXME: add error handlers
      if (response.status !== 200) {
        // eslint-disable-next-line no-console
        console.log(response.statusText);
      }
      res.status(200).end();
      break;
    }

    default: {
      res.setHeader('Allow', [ 'DELETE' ])
      res.status(405).end(`Method ${ _req.method } Not Allowed`)
    }
  }
}
