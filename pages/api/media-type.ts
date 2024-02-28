import type { NextApiRequest, NextApiResponse } from 'next';
import nodeFetch from 'node-fetch';

import { httpLogger } from 'nextjs/utils/logger';

import getQueryParamString from 'lib/router/getQueryParamString';

export default async function mediaTypeHandler(req: NextApiRequest, res: NextApiResponse) {
  httpLogger(req, res);

  try {
    const url = getQueryParamString(req.query.url);
    const response = await nodeFetch(url, { method: 'HEAD' });

    if (response.status !== 200) {
      throw new Error();
    }

    const contentType = response.headers.get('content-type');
    const mediaType = (() => {
      if (contentType?.startsWith('video')) {
        return 'video';
      }

      if (contentType?.startsWith('text/html')) {
        return 'html';
      }

      return 'image';
    })();
    res.status(200).json({ type: mediaType });
  } catch (error) {
    res.status(200).json({ type: undefined });
  }
}
