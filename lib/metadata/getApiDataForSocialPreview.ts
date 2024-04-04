import type { IncomingMessage, ServerResponse } from 'http';

import { httpLogger } from 'nextjs/utils/logger';

import metrics from 'lib/monitoring/metrics';

export default async function getApiDataForSocialPreview(req: IncomingMessage | undefined, res: ServerResponse<IncomingMessage> | undefined, pathname: string) {
  if (!req || !res || !metrics) {
    return;
  }

  const userAgent = req.headers['user-agent'];

  if (!userAgent) {
    return;
  }

  if (userAgent.toLowerCase().includes('twitter')) {
    httpLogger(req, res);
    metrics.requestCounter.inc({ route: pathname, bot: 'twitter' });
  }

  if (userAgent.toLowerCase().includes('facebook')) {
    httpLogger(req, res);
    metrics.requestCounter.inc({ route: pathname, bot: 'facebook' });
  }

  if (userAgent.toLowerCase().includes('telegram')) {
    httpLogger(req, res);
    metrics.requestCounter.inc({ route: pathname, bot: 'telegram' });
  }
}
