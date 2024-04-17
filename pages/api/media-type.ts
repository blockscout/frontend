import type { NextApiRequest, NextApiResponse } from 'next';
import nodeFetch from 'node-fetch';

import { httpLogger } from 'nextjs/utils/logger';

import metrics from 'lib/monitoring/metrics';
import getQueryParamString from 'lib/router/getQueryParamString';

export default async function mediaTypeHandler(req: NextApiRequest, res: NextApiResponse) {

  try {
    const url = getQueryParamString(req.query.url);

    const end = metrics?.apiRequestDuration.startTimer();
    const response = await nodeFetch(url, { method: 'HEAD' });
    const duration = end?.({ route: '/media-type', code: response.status });

    if (response.status !== 200) {
      httpLogger.logger.error({ message: 'API fetch', url, code: response.status, duration });
      throw new Error();
    }

    const contentType = response.headers.get('content-type');
    const mediaType = (() => {
      if (contentType?.startsWith('video')) {
        return 'video';
      }

      if (contentType?.startsWith('image')) {
        return 'image';
      }

      if (contentType?.startsWith('text/html')) {
        return 'html';
      }
    })();
    httpLogger.logger.info({ message: 'API fetch', url, code: response.status, duration });

    res.status(200).json({ type: mediaType });
  } catch (error) {
    res.status(200).json({ type: undefined });
  }
}
