import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import type { AdBannerProviders } from 'types/client/adProviders';
import type { RollupType } from 'types/client/rollup';

import type { Route } from 'nextjs-routes';

import config from 'configs/app';
const rollupFeature = config.features.rollup;
const adBannerFeature = config.features.adsBanner;
import isNeedProxy from 'lib/api/isNeedProxy';
import * as cookies from 'lib/cookies';
import type * as metadata from 'lib/metadata';

export interface Props<Pathname extends Route['pathname'] = never> {
  query: Route['query'];
  cookies: string;
  referrer: string;
  adBannerProvider: AdBannerProviders | null;
  // if apiData is undefined, Next.js will complain that it is not serializable
  // so we force it to be always present in the props but it can be null
  apiData: metadata.ApiData<Pathname> | null;
  uuid: string;
}

export const base = async <Pathname extends Route['pathname'] = never>({ req, res, query }: GetServerSidePropsContext):
Promise<GetServerSidePropsResult<Props<Pathname>>> => {
  const adBannerProvider = (() => {
    if (adBannerFeature.isEnabled) {
      if ('additionalProvider' in adBannerFeature && adBannerFeature.additionalProvider) {
        // we need to get a random ad provider on the server side to keep it consistent with the client side
        const randomIndex = Math.round(Math.random());
        return [ adBannerFeature.provider, adBannerFeature.additionalProvider ][randomIndex];
      } else {
        return adBannerFeature.provider;
      }
    }
    return null;
  })();

  let uuid = cookies.getFromCookieString(req.headers.cookie || '', cookies.NAMES.UUID);
  if (!uuid) {
    uuid = crypto.randomUUID();
    res.setHeader('Set-Cookie', `${ cookies.NAMES.UUID }=${ uuid }`);
  }

  const isTrackingDisabled = process.env.DISABLE_TRACKING === 'true';

  if (!isTrackingDisabled) {
    // log pageview
    const hostname = req.headers.host;
    const timestamp = new Date().toISOString();
    const chainId = process.env.NEXT_PUBLIC_NETWORK_ID;
    const chainName = process.env.NEXT_PUBLIC_NETWORK_NAME;
    const publicRPC = process.env.NEXT_PUBLIC_NETWORK_RPC_URL;

    fetch('https://monitor.blockscout.com/count', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hostname,
        timestamp,
        chainId,
        chainName,
        publicRPC,
        uuid,
      }),
    });
  }

  return {
    props: {
      query,
      cookies: req.headers.cookie || '',
      referrer: req.headers.referer || '',
      adBannerProvider: adBannerProvider,
      apiData: null,
      uuid,
    },
  };
};

export const account: GetServerSideProps<Props> = async(context) => {
  if (!config.features.account.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const verifiedAddresses: GetServerSideProps<Props> = async(context) => {
  if (!config.features.addressVerification.isEnabled) {
    return {
      notFound: true,
    };
  }

  return account(context);
};

const DEPOSITS_ROLLUP_TYPES: Array<RollupType> = [ 'optimistic', 'shibarium', 'zkEvm', 'arbitrum', 'scroll' ];
export const deposits: GetServerSideProps<Props> = async(context) => {
  if (!(rollupFeature.isEnabled && DEPOSITS_ROLLUP_TYPES.includes(rollupFeature.type))) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

const WITHDRAWALS_ROLLUP_TYPES: Array<RollupType> = [ 'optimistic', 'shibarium', 'zkEvm', 'arbitrum', 'scroll' ];
export const withdrawals: GetServerSideProps<Props> = async(context) => {
  if (
    !config.features.beaconChain.isEnabled &&
    !(rollupFeature.isEnabled && WITHDRAWALS_ROLLUP_TYPES.includes(rollupFeature.type))
  ) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const txnWithdrawals: GetServerSideProps<Props> = async(context) => {
  if (!(rollupFeature.isEnabled && rollupFeature.type === 'arbitrum')) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const rollup: GetServerSideProps<Props> = async(context) => {
  if (!config.features.rollup.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const outputRoots: GetServerSideProps<Props> = async(context) => {
  if (!(rollupFeature.isEnabled && rollupFeature.outputRootsEnabled)) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

const BATCH_ROLLUP_TYPES: Array<RollupType> = [ 'zkEvm', 'zkSync', 'arbitrum', 'optimistic', 'scroll' ];
export const batch: GetServerSideProps<Props> = async(context) => {
  if (!(rollupFeature.isEnabled && BATCH_ROLLUP_TYPES.includes(rollupFeature.type))) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const batchCelestia: GetServerSideProps<Props> = async(context) => {
  if (!(rollupFeature.isEnabled && (rollupFeature.type === 'arbitrum' || rollupFeature.type === 'optimistic'))) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const marketplace = async <Pathname extends Route['pathname'] = never>(context: GetServerSidePropsContext):
Promise<GetServerSidePropsResult<Props<Pathname>>> => {
  if (!config.features.marketplace.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base<Pathname>(context);
};

export const apiDocs: GetServerSideProps<Props> = async(context) => {
  if (!config.features.restApiDocs.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const graphIQl: GetServerSideProps<Props> = async(context) => {
  if (!config.features.graphqlApiDocs.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const csvExport: GetServerSideProps<Props> = async(context) => {
  if (!config.features.csvExport.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const stats: GetServerSideProps<Props> = async(context) => {
  if (!config.features.stats.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const suave: GetServerSideProps<Props> = async(context) => {
  if (!config.features.suave.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const nameService: GetServerSideProps<Props> = async(context) => {
  if (!config.features.nameService.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const accounts: GetServerSideProps<Props> = async(context) => {
  if (config.UI.views.address.hiddenViews?.top_accounts) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const accountsLabelSearch: GetServerSideProps<Props> = async(context) => {
  if (!config.features.addressMetadata.isEnabled || !context.query.tagType) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const userOps: GetServerSideProps<Props> = async(context) => {
  if (!config.features.userOps.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const validators: GetServerSideProps<Props> = async(context) => {
  if (!config.features.validators.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const validatorDetails: GetServerSideProps<Props> = async(context) => {
  const feature = config.features.validators;
  if (!feature.isEnabled || feature.chainType !== 'zilliqa') {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const gasTracker: GetServerSideProps<Props> = async(context) => {
  if (!config.features.gasTracker.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const advancedFilter: GetServerSideProps<Props> = async(context) => {
  if (!config.features.advancedFilter.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const dataAvailability: GetServerSideProps<Props> = async(context) => {
  if (!config.features.dataAvailability.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const login: GetServerSideProps<Props> = async(context) => {

  if (!isNeedProxy()) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const dev: GetServerSideProps<Props> = async(context) => {
  if (!config.app.isDev) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const publicTagsSubmit: GetServerSideProps<Props> = async(context) => {

  if (!config.features.publicTagsSubmission.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const disputeGames: GetServerSideProps<Props> = async(context) => {
  if (!config.features.faultProofSystem.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const mud: GetServerSideProps<Props> = async(context) => {
  if (!config.features.mudFramework.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const tac: GetServerSideProps<Props> = async(context) => {
  if (!config.features.tac.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const interopMessages: GetServerSideProps<Props> = async(context) => {
  const rollupFeature = config.features.rollup;
  if (!rollupFeature.isEnabled || !rollupFeature.interopEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const pools: GetServerSideProps<Props> = async(context) => {
  if (!config.features.pools.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};
