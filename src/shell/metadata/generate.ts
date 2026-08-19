// SPDX-License-Identifier: LicenseRef-Blockscout

import { kebabCase, upperFirst } from 'es-toolkit';
import type { Route } from 'nextjs-routes';

import type { ApiData, Metadata, OgTemplateValue, TemplateValue } from './types';
import type { RouteParams } from 'src/server/types';

import { currencyUnits } from 'src/slices/chain/units';

import config from 'src/config';
import shortenString from 'src/shared/texts/shorten-string';

import { castToString } from 'src/toolkit/utils/guards';

import compileValue from './compile-value';
import getCanonicalUrl from './get-canonical-url';
import getChainExplorerTitle from './get-chain-explorer-title';
import { generateStructuredData } from './structured-data';
import { TEMPLATE_MAP } from './templates';

// What `truncation="constant"` resolves to in the entity components, so a shortened hash in a title reads
// the same as the one on the page.
const HASH_SHORT_CHAR_NUMBER = 8;

function withInheritedDefault(template: OgTemplateValue, metadataTemplate: TemplateValue): TemplateValue {
  return {
    'default': template['default'] ?? metadataTemplate['default'],
    enhanced: template.enhanced,
  };
}

export default function generate<Pathname extends Route['pathname']>(route: RouteParams<Pathname>, apiData: ApiData<Pathname> = null): Metadata {
  const idParam = castToString(route.query?.id);
  const idFormatted = idParam ? upperFirst(kebabCase(idParam).replaceAll('-', ' ')) : undefined;
  const hashParam = castToString(route.query?.hash);

  const params = {
    ...route.query,
    ...apiData,
    chain_name: config.chain.name,
    chain_explorer_title: getChainExplorerTitle(),
    gwei_name: currencyUnits.gwei,
    id_formatted: idFormatted,
    hash_short: hashParam ? shortenString(hashParam, HASH_SHORT_CHAR_NUMBER) : undefined,
  };

  const titlePostfix = config.metadata.promoteBlockscoutInTitle ? ' | Blockscout' : '';

  const metadataTemplates = TEMPLATE_MAP[route.pathname].metadata;
  const ogTemplates = TEMPLATE_MAP[route.pathname].og;

  const title = compileValue(metadataTemplates.title, params) + titlePostfix;
  const description = compileValue(metadataTemplates.description, params);

  const jsonLd = generateStructuredData({ route, apiData });

  return {
    title: title,
    description,
    opengraph: {
      title: ogTemplates?.title ? compileValue(withInheritedDefault(ogTemplates.title, metadataTemplates.title), params) + titlePostfix : title,
      description: ogTemplates?.description ? compileValue(withInheritedDefault(ogTemplates.description, metadataTemplates.description), params) : description,
      imageUrl: ogTemplates?.image,
    },
    canonical: getCanonicalUrl(route.pathname),
    jsonLd,
  };
}
