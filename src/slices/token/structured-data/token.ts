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

  if (!apiData.exchange_rate) {
    // If there is no exchange rate, we cannot add offers to the schema
    // And without offers, Google will complain that the schema is invalid
    // So we don't generate the schema in this cases
    return;
  }

  const tokenUrl = route({ pathname: '/token/[hash]', query: { hash } }, { absolute: true });

  const schema: WithContext<Product> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: apiData.name || apiData.symbol || undefined,
    description: apiData.description || undefined,
    image: apiData.icon_url || undefined,
    url: tokenUrl,
    productID: apiData.address_hash,
    offers: {
      '@type': 'Offer',
      price: apiData.exchange_rate,
      priceCurrency: 'USD',
      priceValidUntil: new Date(Date.now() + DAY).toISOString(),
      availability: 'InStock',
    },
  };

  if (apiData.projectName) {
    schema.brand = {
      '@type': 'Brand',
      name: apiData.projectName,
    };
  }

  return schema;
}
