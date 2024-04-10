import fetch, { AbortError } from 'node-fetch';

import buildUrl from 'nextjs/utils/buildUrl';
import { httpLogger } from 'nextjs/utils/logger';

import { RESOURCES } from 'lib/api/resources';
import type { ResourceName, ResourcePathParams, ResourcePayload } from 'lib/api/resources';
import { SECOND } from 'lib/consts';
import metrics from 'lib/monitoring/metrics';

interface Params<R extends ResourceName> {
  resource: R;
  pathParams?: ResourcePathParams<R>;
  timeout?: number;
}

export default async function fetchApi<R extends ResourceName>(params: Params<R>): Promise<ResourcePayload<R> | undefined> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, params.timeout || SECOND);

  const url = buildUrl(params.resource, params.pathParams);

  const end = metrics?.apiRequestDuration.startTimer();

  try {
    const response = await fetch(url, { signal: controller.signal });

    const duration = end?.({ route: RESOURCES[params.resource]['path'], code: response.status });
    if (response.status === 200) {
      httpLogger.logger.info({ message: 'API fetch', url, code: response.status, duration });
    } else {
      httpLogger.logger.error({ message: 'API fetch', url, code: response.status, duration });
    }

    return await response.json() as Promise<ResourcePayload<R>>;
  } catch (error) {
    const code = error instanceof AbortError ? 504 : 500;
    const duration = end?.({ route: RESOURCES[params.resource]['path'], code });
    httpLogger.logger.error({ message: 'API fetch', url, code, duration });
  } finally {
    clearTimeout(timeout);
  }
}
