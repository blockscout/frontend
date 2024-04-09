import fetch, { AbortError } from 'node-fetch';

import buildUrl from 'nextjs/utils/buildUrl';

import type { ResourceName, ResourcePathParams, ResourcePayload } from 'lib/api/resources';
import { SECOND } from 'lib/consts';

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

  try {
    const response = await fetch(url, { signal: controller.signal });
    return await response.json() as Promise<ResourcePayload<R>>;
  } catch (error) {
    if (error instanceof AbortError) {
    //   console.log('request was aborted');
    }
  } finally {
    clearTimeout(timeout);
  }
}
