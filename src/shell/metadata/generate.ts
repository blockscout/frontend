// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiData, Metadata } from './types';
import type { RouteParams } from 'src/server/types';

import type { Route } from 'nextjs-routes';

import { currencyUnits } from 'src/slices/chain/units';

import config from 'src/config';

import compileValue from './compile-value';
import generateProductSchema from './generate-product-schema';
import getCanonicalUrl from './get-canonical-url';
import getChainTitle from './get-chain-title';
import getPageOgType from './get-page-og-type';
import * as templates from './templates';

export default function generate<Pathname extends Route['pathname']>(route: RouteParams<Pathname>, apiData: ApiData<Pathname> = null): Metadata {
  const idCap = route.pathname === '/essential-dapps/[id]' && typeof route.query?.id === 'string' ?
    route.query.id.charAt(0).toUpperCase() + route.query.id.slice(1) : undefined;

  const params = {
    ...route.query,
    ...apiData,
    network_name: config.chain.name,
    network_title: getChainTitle(),
    network_gwei: currencyUnits.gwei,
    id_cap: idCap,
  };

  const title = compileValue(templates.title.make(route.pathname, Boolean(apiData)), params);
  const description = compileValue(templates.description.make(route.pathname, Boolean(apiData)), params);

  const pageOgType = getPageOgType(route.pathname);
  const jsonLd = generateProductSchema(route, apiData);

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
