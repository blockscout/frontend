import type { GetServerSideProps } from 'next';

import config from 'configs/app';
const rollupFeature = config.features.rollup;

export type Props = {
  cookies: string;
  referrer: string;
  id: string;
  height_or_hash: string;
  hash: string;
  number: string;
  q: string;
  name: string;
}

export const base: GetServerSideProps<Props> = async({ req, query }) => {
  return {
    props: {
      cookies: req.headers.cookie || '',
      referrer: req.headers.referer || '',
      id: query.id?.toString() || '',
      hash: query.hash?.toString() || '',
      height_or_hash: query.height_or_hash?.toString() || '',
      number: query.number?.toString() || '',
      q: query.q?.toString() || '',
      name: query.name?.toString() || '',
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

export const deposits: GetServerSideProps<Props> = async(context) => {
  if (!(rollupFeature.isEnabled && (rollupFeature.type === 'optimistic' || rollupFeature.type === 'shibarium'))) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const withdrawals: GetServerSideProps<Props> = async(context) => {
  if (
    !config.features.beaconChain.isEnabled &&
    !(rollupFeature.isEnabled && (rollupFeature.type === 'optimistic' || rollupFeature.type === 'shibarium'))
  ) {
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

export const optimisticRollup: GetServerSideProps<Props> = async(context) => {
  if (!(rollupFeature.isEnabled && rollupFeature.type === 'optimistic')) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const zkEvmRollup: GetServerSideProps<Props> = async(context) => {
  if (!(rollupFeature.isEnabled && rollupFeature.type === 'zkEvm')) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const marketplace: GetServerSideProps<Props> = async(context) => {
  if (!config.features.marketplace.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};

export const apiDocs: GetServerSideProps<Props> = async(context) => {
  if (!config.features.restApiDocs.isEnabled) {
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

export const gasTracker: GetServerSideProps<Props> = async(context) => {
  if (!config.features.gasTracker.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(context);
};
