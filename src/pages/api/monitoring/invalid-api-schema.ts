// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextApiRequest, NextApiResponse } from 'next';

import type { ApiName } from 'src/api/types';

import metrics from 'src/server/monitoring/metrics';
import { httpLogger } from 'src/server/utils/logger';

import { RESOURCES } from 'src/api/resources';

import getErrorMessage from 'src/shared/errors/get-error-message';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload: { resource?: string; url?: string } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!payload.resource) {
      throw new Error('Resource not found');
    }

    const [ apiName, resourceName ] = payload.resource.split(':');
    const api = RESOURCES[apiName as ApiName];
    const resource = api?.[resourceName as keyof typeof api];

    if (!resource) {
      throw new Error(`Resource not found: ${ payload.resource }`);
    }

    const url = payload.url ? new URL(payload.url) : undefined;

    metrics?.invalidApiSchema.inc({
      resource: payload.resource,
      url: url?.toString(),
    });
  } catch (error) {
    httpLogger.logger.error({ message: 'Unable to process invalid API schema', error: getErrorMessage(error) || 'Unknown error' });
  }
  res.status(200).json({ status: 'ok' });
}
