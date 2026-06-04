// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Route } from 'nextjs-routes';
import type { Product, WebApplication, WithContext } from 'schema-dts';

import type { LineChart } from '@blockscout/stats-types';
import type { MarketplaceApp } from 'src/features/marketplace/types/client';
import type { TokenInfo } from 'src/slices/token/types/api';

/* eslint-disable @stylistic/indent */
export type ApiData<Pathname extends Route['pathname']> =
(
    Pathname extends '/address/[hash]' ? { domain_name: string } :
    Pathname extends '/token/[hash]' ? TokenInfo & { symbol_or_name: string; description?: string; projectName?: string } :
    Pathname extends '/token/[hash]/instance/[id]' ? { symbol_or_name: string } :
    Pathname extends '/apps/[id]' ? MarketplaceApp :
    Pathname extends '/apps/[id]/info' ? MarketplaceApp :
    Pathname extends '/stats/[id]' ? LineChart['info'] :
    never
) | null;
/* eslint-enable @stylistic/indent */

export type StructuredData = WithContext<Product> | WithContext<WebApplication>;

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
