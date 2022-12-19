import appConfig from 'configs/app/config';

import { RESOURCES } from './resources';

export default function buildUrl(resource: keyof typeof RESOURCES, params?: Record<string, string>) {
  const base = appConfig.host === 'localhost' ? appConfig.baseUrl : appConfig.api.endpoint;
  const path = appConfig.host === 'localhost' ?
    '/proxy' + appConfig.api.basePath + RESOURCES[resource].path :
    appConfig.api.basePath + RESOURCES[resource].path;
  const url = new URL(path, base);

  params && Object.entries(params).forEach(([ key, value ]) => {
    url.searchParams.append(key, value);
  });

  return url.toString();
}
