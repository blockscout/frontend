import type { NextApiRequest, NextApiResponse } from 'next';
import * as v from 'valibot';

import type { ApiName } from 'lib/api/types';

import { httpLogger } from 'nextjs/utils/logger';

import { RESOURCES } from 'lib/api/resources';
import metrics from 'lib/monitoring/metrics';

const PayloadSchema = v.object({
  resource: v.string(),
  url: v.optional(v.string()),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload = v.parse(PayloadSchema, JSON.parse(req.body));
    const [ apiName, resourceName ] = payload.resource.split(':');
    const resource = RESOURCES[apiName as ApiName][resourceName as keyof typeof RESOURCES[ApiName]];

    if (!resource) {
      throw new Error('Resource not found');
    }

    const url = payload.url ? new URL(payload.url) : undefined;

    metrics?.invalidApiSchema.inc({
      resource: payload.resource,
      url: url?.toString(),
    });
  } catch (error) {
    httpLogger.logger.error({ message: 'Unable to process invalid API schema', error });
  }
  res.status(200).json({ status: 'ok' });
}
