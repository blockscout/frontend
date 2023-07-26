import appConfig from 'configs/app/config';

import { getServerSideProps as base } from '../getServerSideProps';

export const getServerSideProps: typeof base = async(...args) => {
  if (!appConfig.account.isEnabled) {
    return {
      notFound: true,
    };
  }
  return base(...args);
};

export const getServerSidePropsForVerifiedAddresses: typeof base = async(...args) => {
  if (!appConfig.account.isEnabled || !appConfig.adminServiceApi.endpoint || !appConfig.contractInfoApi.endpoint) {
    return {
      notFound: true,
    };
  }
  return base(...args);
};
