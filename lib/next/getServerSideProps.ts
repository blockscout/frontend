import type { GetServerSideProps } from 'next';

import appConfig from 'configs/app/config';

export type Props = {
  cookies: string;
  referrer: string;
  id: string;
  height_or_hash: string;
  hash: string;
  q: string;
}

export const base: GetServerSideProps<Props> = async({ req, query }) => {
  return {
    props: {
      cookies: req.headers.cookie || '',
      referrer: req.headers.referer || '',
      id: query.id?.toString() || '',
      hash: query.hash?.toString() || '',
      height_or_hash: query.height_or_hash?.toString() || '',
      q: query.q?.toString() || '',
    },
  };
};

export const account: GetServerSideProps<Props> = async(...args) => {
  if (!appConfig.account.isEnabled) {
    return {
      notFound: true,
    };
  }

  return base(...args);
};

export const verifiedAddresses: GetServerSideProps<Props> = async(...args) => {
  if (!appConfig.adminServiceApi.endpoint || !appConfig.contractInfoApi.endpoint) {
    return {
      notFound: true,
    };
  }

  return account(...args);
};

export const beaconChain: GetServerSideProps<Props> = async(args) => {
  if (!appConfig.beaconChain.hasBeaconChain) {
    return {
      notFound: true,
    };
  }

  return base(args);
};

export const L2: GetServerSideProps<Props> = async(args) => {
  if (!appConfig.L2.isL2Network) {
    return {
      notFound: true,
    };
  }

  return base(args);
};

export const marketplace: GetServerSideProps<Props> = async(args) => {
  if (!appConfig.marketplace.configUrl || !appConfig.network.rpcUrl) {
    return {
      notFound: true,
    };
  }

  return base(args);
};

export const apiDocs: GetServerSideProps<Props> = async(args) => {
  if (!appConfig.apiDoc.specUrl) {
    return {
      notFound: true,
    };
  }

  return base(args);
};

export const csvExport: GetServerSideProps<Props> = async(args) => {
  if (!appConfig.reCaptcha.siteKey) {
    return {
      notFound: true,
    };
  }

  return base(args);
};

export const stats: GetServerSideProps<Props> = async(args) => {
  if (!appConfig.statsApi.endpoint) {
    return {
      notFound: true,
    };
  }

  return base(args);
};
