import type { NextApiRequest, NextApiResponse } from 'next';

import fetchFactory from 'lib/api/fetch';
import getUrlWithNetwork from 'lib/api/getUrlWithNetwork';

export default async function csrfHandler(_req: NextApiRequest, res: NextApiResponse) {
  const url = getUrlWithNetwork(_req, `api/account/v1/get_csrf`);
  const fetch = fetchFactory(_req);
  const response = await fetch(url);

  if (response.status === 200) {
    const token = response.headers.get('x-bs-account-csrf');
    res.status(200).json({ token });
    return;
  }

  res.status(500).json({ statusText: response.statusText, status: response.status });
}
