import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import type { RollupType } from 'types/client/rollup';

import type { Route } from 'nextjs-routes';
import type { Props } from 'nextjs/getServerSideProps/handlers';

import config from 'configs/app';
import isNeedProxy from 'lib/api/isNeedProxy';

export type Guard = (chainConfig: typeof config) => <Pathname extends Route['pathname'] = never>(context: GetServerSidePropsContext) =>
Promise<GetServerSidePropsResult<Props<Pathname>> | undefined>;

export const account: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.account.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const verifiedAddresses: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.addressVerification.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const userOps: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.userOps.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const marketplace: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.marketplace.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const apiDocs: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.apiDocs.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const csvExport: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.csvExport.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const stats: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.stats.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const suave: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.suave.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const nameService: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.nameService.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const accounts: Guard = (chainConfig: typeof config) => async() => {
  if (chainConfig.UI.views.address.hiddenViews?.top_accounts) {
    return {
      notFound: true,
    };
  }
};

export const accountsLabelSearch: Guard = (chainConfig: typeof config) => async(context) => {
  if (!chainConfig.features.addressMetadata.isEnabled || !context.query.tagType) {
    return {
      notFound: true,
    };
  }
};

export const validators: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.validators.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const validatorDetails: Guard = (chainConfig: typeof config) => async() => {
  const feature = chainConfig.features.validators;
  if (!feature.isEnabled || feature.chainType !== 'zilliqa') {
    return {
      notFound: true,
    };
  }
};

export const gasTracker: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.gasTracker.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const advancedFilter: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.advancedFilter.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const dataAvailability: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.dataAvailability.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const login: Guard = () => async() => {
  if (!isNeedProxy()) {
    return {
      notFound: true,
    };
  }
};

export const dev: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.app.isDev) {
    return {
      notFound: true,
    };
  }
};

export const publicTagsSubmit: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.publicTagsSubmission.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const pools: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.pools.isEnabled) {
    return {
      notFound: true,
    };
  }
};

// ROLLUPS
export const rollup: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.rollup.isEnabled) {
    return {
      notFound: true,
    };
  }
};

const DEPOSITS_ROLLUP_TYPES: Array<RollupType> = [ 'optimistic', 'shibarium', 'zkEvm', 'arbitrum', 'scroll' ];
export const deposits: Guard = (chainConfig: typeof config) => async() => {
  const rollupFeature = chainConfig.features.rollup;
  if (
    !chainConfig.features.beaconChain.isEnabled &&
    !(rollupFeature.isEnabled && DEPOSITS_ROLLUP_TYPES.includes(rollupFeature.type))) {
    return {
      notFound: true,
    };
  }
};

const WITHDRAWALS_ROLLUP_TYPES: Array<RollupType> = [ 'optimistic', 'shibarium', 'zkEvm', 'arbitrum', 'scroll' ];
export const withdrawals: Guard = (chainConfig: typeof config) => async() => {
  const rollupFeature = chainConfig.features.rollup;
  if (
    !chainConfig.features.beaconChain.isEnabled &&
    !(rollupFeature.isEnabled && WITHDRAWALS_ROLLUP_TYPES.includes(rollupFeature.type))
  ) {
    return {
      notFound: true,
    };
  }
};

const BATCH_ROLLUP_TYPES: Array<RollupType> = [ 'zkEvm', 'zkSync', 'arbitrum', 'optimistic', 'scroll' ];
export const batch: Guard = (chainConfig: typeof config) => async() => {
  const rollupFeature = chainConfig.features.rollup;
  if (!(rollupFeature.isEnabled && BATCH_ROLLUP_TYPES.includes(rollupFeature.type))) {
    return {
      notFound: true,
    };
  }
};

export const batchCelestia: Guard = (chainConfig: typeof config) => async() => {
  const rollupFeature = chainConfig.features.rollup;
  if (!(rollupFeature.isEnabled && (rollupFeature.type === 'arbitrum' || rollupFeature.type === 'optimistic'))) {
    return {
      notFound: true,
    };
  }
};

export const txnWithdrawals: Guard = (chainConfig: typeof config) => async() => {
  const rollupFeature = chainConfig.features.rollup;
  if (!(rollupFeature.isEnabled && rollupFeature.type === 'arbitrum')) {
    return {
      notFound: true,
    };
  }
};

export const outputRoots: Guard = (chainConfig: typeof config) => async() => {
  const rollupFeature = chainConfig.features.rollup;
  if (!(rollupFeature.isEnabled && rollupFeature.outputRootsEnabled)) {
    return {
      notFound: true,
    };
  }
};

export const disputeGames: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.faultProofSystem.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const mud: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.mudFramework.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const tac: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.tac.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const celo: Guard = (chainConfig: typeof config) => async() => {
  if (!chainConfig.features.celo.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const interopMessages: Guard = (chainConfig: typeof config) => async() => {
  const rollupFeature = chainConfig.features.rollup;
  if (!rollupFeature.isEnabled || !rollupFeature.interopEnabled) {
    return {
      notFound: true,
    };
  }
};

export const opSuperchain: Guard = () => async() => {
  if (!config.features.opSuperchain.isEnabled) {
    return {
      notFound: true,
    };
  }
};

export const notOpSuperchain: Guard = () => async() => {
  if (config.features.opSuperchain.isEnabled) {
    return {
      notFound: true,
    };
  }
};
