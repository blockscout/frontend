// SPDX-License-Identifier: LicenseRef-Blockscout

import { upperFirst } from 'es-toolkit';
import type { Route } from 'nextjs-routes';

import type { ApiData, Metadata } from './types';
import type { RouteParams } from 'src/server/types';

import { currencyUnits } from 'src/slices/chain/units';

import config from 'src/config';

import { castToString } from 'src/toolkit/utils/guards';

import compileValue from './compile-value';
import getCanonicalUrl from './get-canonical-url';
import getChainExplorerTitle from './get-chain-explorer-title';
import getPageOgType from './get-page-og-type';
import { generateStructuredData } from './structured-data';
import * as templates from './templates';

export default function generate<Pathname extends Route['pathname']>(route: RouteParams<Pathname>, apiData: ApiData<Pathname> = null): Metadata {
  const idParam = castToString(route.query?.id);
  const idFormatted = idParam ? upperFirst(idParam) : undefined;

  const params = {
    ...route.query,
    ...apiData,
    chain_name: config.chain.name,
    chain_explorer_title: getChainExplorerTitle(),
    gwei_name: currencyUnits.gwei,
    id_formatted: idFormatted,
  };

  const title = compileValue(templates.title.make(route.pathname, Boolean(apiData)), params);
  const description = compileValue(templates.description.make(route.pathname, Boolean(apiData)), params);

  const pageOgType = getPageOgType(route.pathname);
  const jsonLd = generateStructuredData({ route, apiData });

  return {
    title: title,
    description,
    opengraph: {
      title: title,
      description: pageOgType !== 'Regular page' ? config.metadata.og.description : '',
      imageUrl: pageOgType !== 'Regular page' ? config.metadata.og.imageUrl : '',
    },
    canonical: getCanonicalUrl(route.pathname),
    jsonLd,
  };
}
