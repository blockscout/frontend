// SPDX-License-Identifier: LicenseRef-Blockscout

import { kebabCase, upperFirst } from 'es-toolkit';
import type { Route } from 'nextjs-routes';

import type { ApiData, Metadata } from './types';
import type { RouteParams } from 'src/server/types';

import { currencyUnits } from 'src/slices/chain/units';

import config from 'src/config';

import { castToString } from 'src/toolkit/utils/guards';

import compileValue from './compile-value';
import getCanonicalUrl from './get-canonical-url';
import getChainExplorerTitle from './get-chain-explorer-title';
import { generateStructuredData } from './structured-data';
import { TEMPLATE_MAP } from './templates';

export default function generate<Pathname extends Route['pathname']>(route: RouteParams<Pathname>, apiData: ApiData<Pathname> = null): Metadata {
  const idParam = castToString(route.query?.id);
  const idFormatted = idParam ? upperFirst(kebabCase(idParam).replaceAll('-', ' ')) : undefined;

  const params = {
    ...route.query,
    ...apiData,
    chain_name: config.chain.name,
    chain_explorer_title: getChainExplorerTitle(),
    gwei_name: currencyUnits.gwei,
    id_formatted: idFormatted,
  };

  const titlePostfix = config.metadata.promoteBlockscoutInTitle ? ' | Blockscout' : '';

  const title = compileValue(TEMPLATE_MAP[route.pathname].metadata.title, params) + titlePostfix;
  const description = compileValue(TEMPLATE_MAP[route.pathname].metadata.description, params);

  const jsonLd = generateStructuredData({ route, apiData });

  return {
    title: title,
    description,
    opengraph: {
      title: title,
      description: TEMPLATE_MAP[route.pathname].og?.description,
      imageUrl: TEMPLATE_MAP[route.pathname].og?.image,
    },
    canonical: getCanonicalUrl(route.pathname),
    jsonLd,
  };
}
