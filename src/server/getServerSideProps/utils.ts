// SPDX-License-Identifier: LicenseRef-Blockscout

import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import multichainConfig from 'src/features/multichain/chains-config';

import config from 'src/config';
import type { Route } from 'src/shared/router/routes';

import type { Guard } from './guards';
import * as handlers from './handlers';
import type { Props } from './handlers';

// A nested array of guards works as OR: it passes when any of its guards returns nothing, and
// otherwise returns the result of its first guard.
export const factory = (guards: Array<Guard | Array<Guard>>, chainConfig = config) => {
  return async<Pathname extends Route['pathname'] = never>(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props<Pathname>>> => {
    for (const guard of guards) {
      if (Array.isArray(guard)) {
        const results = await Promise.all(guard.map((subGuard) => subGuard(chainConfig)(context)));
        if (results.some((result) => !result)) {
          continue;
        } else {
          return results.find((result) => result) as GetServerSidePropsResult<Props<Pathname>>;
        }
      } else {
        const result = await guard(chainConfig)(context);
        if (result) {
          return result;
        }
      }
    }
    return handlers.base<Pathname>(context);
  };
};

export const factoryMultichain = (guards: Array<Guard>) => {
  return async(context: GetServerSidePropsContext) => {
    const chainSlugOrId = context.params?.chain_slug_or_id;
    const chain = multichainConfig()?.chains.find((chain) => chain.slug === chainSlugOrId || chain.id === chainSlugOrId);

    if (!chain?.app_config) {
      return {
        notFound: true,
      };
    }

    return factory(guards, chain.app_config)(context);
  };
};
