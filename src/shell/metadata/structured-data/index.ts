// SPDX-License-Identifier: LicenseRef-Blockscout

// https://schema.org

import type { StructuredData, ApiData } from '../types';
import type { RouteParams } from 'src/server/types';

import generateTokenProductSchema from 'src/slices/token/structured-data/token';

import generateDappInfoSchema from 'src/features/marketplace/structured-data/dapp-info';

import type { Route } from 'src/shared/router/routes';

interface Params<Pathname extends Route['pathname']> {
  route: RouteParams<Pathname>;
  apiData: ApiData<Pathname>;
}

export function generateStructuredData<Pathname extends Route['pathname']>(params: Params<Pathname>): StructuredData | undefined {

  if (!params.apiData || typeof params.apiData !== 'object' || params.apiData === null) {
    return;
  }

  switch (params.route.pathname) {
    case '/token/[hash]': {
      const hash = typeof params.route.query?.hash === 'string' ? params.route.query.hash : undefined;
      if (!hash) {
        return;
      }
      return generateTokenProductSchema({
        hash,
        apiData: params.apiData as NonNullable<ApiData<'/token/[hash]'>>,
      });
    }
    case '/apps/[id]/info': {
      const id = typeof params.route.query?.id === 'string' ? params.route.query.id : undefined;
      if (!id) {
        return;
      }
      return generateDappInfoSchema({
        id,
        apiData: params.apiData as NonNullable<ApiData<'/apps/[id]/info'>>,
      });
    }
    default: {
      return;
    }
  }
}
