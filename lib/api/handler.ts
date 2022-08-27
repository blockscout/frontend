import type { NextApiRequest, NextApiResponse } from 'next';

import fetch from 'lib/api/fetch';
import * as cookies from 'lib/cookies';

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';

export default function handler<TRes>(getUrl: (_req: NextApiRequest) => string, allowedMethods: Array<Methods>) {
  return async(_req: NextApiRequest, res: NextApiResponse<TRes>) => {
    if (_req.method && allowedMethods.includes(_req.method as Methods)) {
      const isBodyDisallowed = _req.method === 'GET' || _req.method === 'HEAD';
      const networkType = _req.cookies[cookies.NAMES.NETWORK_TYPE];
      const networkSubType = _req.cookies[cookies.NAMES.NETWORK_SUB_TYPE];

      if (!networkType || !networkSubType) {
        // eslint-disable-next-line no-console
        console.error(`Incorrect network: NETWORK_TYPE=${ networkType } NETWORK_SUB_TYPE=${ networkSubType }`);
      }

      const url = `/${ networkType }/${ networkSubType }/api${ getUrl(_req) }`;
      const response = await fetch(url, {
        method: _req.method,
        body: isBodyDisallowed ? undefined : _req.body,
      });

      // FIXME: add error handlers
      if (response.status !== 200) {
        // eslint-disable-next-line no-console
        console.error(response.statusText);
        res.status(500).end('Unknown error');
        return;
      }

      const data = await response.json() as TRes;
      res.status(200).json(data);
    } else {
      res.setHeader('Allow', allowedMethods);
      res.status(405).end(`Method ${ _req.method } Not Allowed`);
    }
  };
}
