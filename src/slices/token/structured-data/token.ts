// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Product, WithContext } from 'schema-dts';

import type { ApiData } from 'src/shell/metadata/types';

import { route } from 'src/shared/router/routes';

import { DAY } from 'src/toolkit/utils/consts';

interface Params {
  hash: string;
  apiData: NonNullable<ApiData<'/token/[hash]'>>;
}

export default function generateTokenSchema({ hash, apiData }: Params): WithContext<Product> | undefined {

  const tokenUrl = route({ pathname: '/token/[hash]', query: { hash } }, { absolute: true });

  const schema: WithContext<Product> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: apiData.name || apiData.symbol || undefined,
    description: apiData.description || undefined,
    image: apiData.icon_url || undefined,
    url: tokenUrl,
    productID: apiData.address_hash,
  };

  if (apiData.projectName) {
    schema.brand = {
      '@type': 'Brand',
      name: apiData.projectName,
    };
  }

  // Only include offers if we have a valid price
  // Schema.org requires valid price data when including an Offer
  if (apiData.exchange_rate) {
    schema.offers = {
      '@type': 'Offer',
      price: apiData.exchange_rate,
      priceCurrency: 'USD',
      priceValidUntil: new Date(Date.now() + DAY).toISOString(),
      availability: 'InStock',
    };
  }

  return schema;
}
