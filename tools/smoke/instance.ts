import type { APIRequestContext } from '@playwright/test';

import type { schemas } from '@blockscout/api-types';

type LatestTransaction = Pick<schemas['Transaction'], 'hash' | 'from'>;

type AppEnvs = Record<string, string | undefined>;

const readJson = async<TBody>(request: APIRequestContext, url: string): Promise<TBody> => {
  const response = await request.get(url);
  if (!response.ok()) {
    throw new Error(`GET ${ url } answered ${ response.status() }`);
  }
  return response.json();
};

export const fetchAppEnvs = async(request: APIRequestContext): Promise<AppEnvs> => {
  const { envs } = await readJson<{ envs: AppEnvs }>(request, '/node-api/config');
  return envs;
};

// read from the running app rather than the preset registry: the API can live on another host than the instance
const getCoreApiUrl = async(request: APIRequestContext): Promise<string> => {
  const envs = await fetchAppEnvs(request);
  const protocol = envs.NEXT_PUBLIC_API_PROTOCOL || 'https';
  const port = envs.NEXT_PUBLIC_API_PORT ? `:${ envs.NEXT_PUBLIC_API_PORT }` : '';
  const basePath = (envs.NEXT_PUBLIC_API_BASE_PATH ?? '').replace(/\/$/, '');

  return `${ protocol }://${ envs.NEXT_PUBLIC_API_HOST }${ port }${ basePath }`;
};

export const fetchLatestTransaction = async(request: APIRequestContext): Promise<LatestTransaction> => {
  const apiUrl = await getCoreApiUrl(request);
  const [ transaction ] = await readJson<Array<LatestTransaction>>(request, `${ apiUrl }/api/v2/main-page/transactions`);
  if (!transaction) {
    throw new Error('The instance has no transactions to sample');
  }
  return transaction;
};
