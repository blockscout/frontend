import type { NextApiRequest, NextApiResponse } from 'next';
import nodeFetch from 'node-fetch';

import { httpLogger } from 'lib/api/logger';
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
    const mediaType = contentType?.startsWith('video') ? 'video' : 'image';
    res.status(200).json({ type: mediaType });
  } catch (error) {
    res.status(200).json({ type: undefined });
  }
}
