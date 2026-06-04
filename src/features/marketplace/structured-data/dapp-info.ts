// SPDX-License-Identifier: LicenseRef-Blockscout

import { route } from 'nextjs-routes';
import type { WebApplication, WithContext } from 'schema-dts';

import type { ApiData } from 'src/shell/metadata/types';

import config from 'src/config';

interface Params {
  id: string;
  apiData: NonNullable<ApiData<'/apps/[id]/info'>>;
}

export default function generateDappInfoSchema({ id, apiData }: Params): WithContext<WebApplication> | undefined {

  const appInfoPageUrl = config.app.baseUrl + route({ pathname: '/apps/[id]/info', query: { id } });
  const appPageUrl = config.app.baseUrl + route({ pathname: '/apps/[id]', query: { id } });

  const schema: WithContext<WebApplication> = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': id,
    name: apiData.title,
    url: appInfoPageUrl,
    sameAs: apiData.external ? apiData.url : appPageUrl,
    description: apiData.description,
    image: apiData.logo,
    applicationCategory: 'Decentralized Web Application',
    applicationSubCategory: apiData.categories[0],
    operatingSystem: 'Web',
    publisher: {
      '@type': 'Organization',
      name: apiData.author,
      url: apiData.site,
    },
  };

  if (apiData.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: apiData.rating,
      ratingCount: apiData.ratingsTotalCount,
    };
  }

  return schema;
}
