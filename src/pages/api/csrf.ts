// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextApiRequest, NextApiResponse } from 'next';

import buildUrl from 'src/server/utils/buildUrl';
import fetchFactory from 'src/server/utils/fetchProxy';
import { httpLogger } from 'src/server/utils/logger';

import isNeedProxy from 'src/api/utils/is-need-proxy';

export default async function csrfHandler(_req: NextApiRequest, res: NextApiResponse) {
  if (!isNeedProxy()) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  httpLogger(_req, res);

  const url = buildUrl('core:csrf');
  const response = await fetchFactory(_req)(url);

  if (response.status === 200) {
    const token = response.headers.get('x-bs-account-csrf');
    res.status(200).json({ token });
    return;
  }

  const responseError = { statusText: response.statusText, status: response.status };
  httpLogger.logger.error({ err: responseError, url: _req.url });

  res.status(500).json(responseError);
}
