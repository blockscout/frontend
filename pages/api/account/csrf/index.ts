import type { NextApiRequest, NextApiResponse } from 'next';

import fetchFactory from 'lib/api/fetch';
import getUrlWithNetwork from 'lib/api/getUrlWithNetwork';
import { httpLogger } from 'lib/api/logger';

export default async function csrfHandler(_req: NextApiRequest, res: NextApiResponse) {
  httpLogger(_req, res);

  const url = getUrlWithNetwork(_req, `api/account/v1/get_csrf`);
  const fetch = fetchFactory(_req);
  const response = await fetch(url);

  if (response.status === 200) {
    const token = response.headers.get('x-bs-account-csrf');
    res.status(200).json({ token });
    return;
  }

  const responseError = { statusText: response.statusText, status: response.status };
  httpLogger.logger.error({ err: responseError, url: _req.url });

  res.status(500).json(responseError);
}
