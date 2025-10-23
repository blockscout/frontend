import type { NextApiRequest, NextApiResponse } from 'next';
import nodeFetch from 'node-fetch';

import { httpLogger } from 'nextjs/utils/logger';

import metrics from 'lib/monitoring/metrics';
import getQueryParamString from 'lib/router/getQueryParamString';

export default async function mediaTypeHandler(req: NextApiRequest, res: NextApiResponse) {
  const url = getQueryParamString(req.query.url);

  try {

    const end = metrics?.apiRequestDuration.startTimer();

    // Add timeout for slow IPFS requests (3 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await nodeFetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

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
    // Return image as default for timeout/errors to show placeholder
    if (error instanceof Error && error.name === 'AbortError') {
      httpLogger.logger.warn({ message: 'API fetch timeout', url, duration: 3000 });
      res.status(200).json({ type: 'image' }); // Default to image on timeout
    } else {
      res.status(200).json({ type: undefined });
    }
  }
}
