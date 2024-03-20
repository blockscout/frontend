import type { ApiData, Metadata } from './types';

import type { Route } from 'nextjs-routes';

import config from 'configs/app';
import getNetworkTitle from 'lib/networks/getNetworkTitle';

import compileValue from './compileValue';
import * as templates from './templates';

export default function generate<R extends Route>(route: R, apiData?: ApiData<R>): Metadata {
  const params = {
    ...route.query,
    ...apiData,
    network_name: config.chain.name,
    network_title: getNetworkTitle(),
  };

  const compiledTitle = compileValue(templates.title.make(route.pathname), params);
  const title = compiledTitle ? compiledTitle + (config.meta.promoteBlockscoutInTitle ? ' | Blockscout' : '') : '';
  const description = compileValue(templates.description.make(route.pathname), params);

  return {
    title: title,
    description,
    opengraph: {
      url: config.meta.og.url,
      title: config.meta.og.title || title,
      description: config.meta.og.description || description,
    },
  };
}
