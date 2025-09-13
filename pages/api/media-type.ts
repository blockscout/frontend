import type { NextApiRequest, NextApiResponse } from 'next';
import nodeFetch from 'node-fetch';

import { httpLogger } from 'nextjs/utils/logger';

import metrics from 'lib/monitoring/metrics';
import getQueryParamString from 'lib/router/getQueryParamString';

export default async function mediaTypeHandler(req: NextApiRequest, res: NextApiResponse) {

  try {
    const url = getQueryParamString(req.query.url);

    // SSRF protection: Only allow URLs from trusted hostnames
    const allowedHostnames = [
      'example.com',
      'cdn.example.com',
      // Add other trusted hostnames as needed
    ];
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      httpLogger.logger.error({ message: 'Invalid URL', url });
      res.status(400).json({ type: undefined, error: 'Invalid URL' });
      return;
    }
    if (!allowedHostnames.includes(parsedUrl.hostname)) {
      httpLogger.logger.error({ message: 'Disallowed hostname', url, hostname: parsedUrl.hostname });
      res.status(403).json({ type: undefined, error: 'Disallowed hostname' });
      return;
    }

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
