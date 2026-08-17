// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Route } from 'nextjs-routes';
import type { Product, WebApplication, WithContext } from 'schema-dts';

import type { MarketplaceDapp } from '@blockscout/admin-rs-types';
import type { schemas } from '@blockscout/api-types';
import type { LineChart } from '@blockscout/stats-types';
import type { TxOgDescriptionParams } from 'src/slices/tx/types/api';

/* eslint-disable @stylistic/indent */
export type ApiData<Pathname extends Route['pathname']> =
(
    Pathname extends '/address/[hash]' ? { domain_name: string } :
    Pathname extends '/tx/[hash]' ? TxOgDescriptionParams :
    Pathname extends '/token/[hash]' ? schemas['Token'] & { symbol_or_name: string; description?: string; projectName?: string } :
    Pathname extends '/token/[hash]/instance/[id]' ? { symbol_or_name: string } :
    Pathname extends '/apps/[id]' ? MarketplaceDapp :
    Pathname extends '/apps/[id]/info' ? MarketplaceDapp :
    Pathname extends '/stats/[id]' ? LineChart['info'] :
    never
) | null;
/* eslint-enable @stylistic/indent */

export type StructuredData = WithContext<Product> | WithContext<WebApplication>;

// The `enhanced` variant is used only when every placeholder in it resolves to a truthy param.
export interface TemplateValue {
  'default': string;
  enhanced?: string;
}

// An OG template may omit its `default` and inherit the route's metadata one.
export type OgTemplateValue = Partial<TemplateValue>;

export interface Metadata {
  title: string;
  description: string;
  opengraph: {
    title: string;
    description?: string;
    imageUrl?: string;
  };
  canonical: string | undefined;
  jsonLd?: StructuredData;
}
