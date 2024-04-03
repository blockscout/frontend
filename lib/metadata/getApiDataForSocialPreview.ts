import type { IncomingMessage, ServerResponse } from 'http';

import { httpLogger } from 'nextjs/utils/logger';

import * as metrics from 'lib/monitoring/metrics';

export default async function getApiDataForSocialPreview(req: IncomingMessage | undefined, res: ServerResponse<IncomingMessage> | undefined, pathname: string) {
  if (!req || !res) {
    return;
  }

  const userAgent = req.headers['user-agent'];

  if (!userAgent) {
    return;
  }

  if (userAgent.toLowerCase().includes('twitter')) {
    httpLogger(req, res);
    metrics.requestCounter.inc({ route: pathname, is_bot: 'true', is_social_preview: 'true' });
  }

  if (userAgent.toLowerCase().includes('facebook')) {
    httpLogger(req, res);
    metrics.requestCounter.inc({ route: pathname, is_bot: 'true', is_social_preview: 'true' });
  }
}
