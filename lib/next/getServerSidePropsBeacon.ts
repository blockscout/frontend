import type { GetServerSideProps } from 'next';

import appConfig from 'configs/app/config';
import type { Props } from 'lib/next/getServerSideProps';
import { getServerSideProps as getServerSidePropsBase } from 'lib/next/getServerSideProps';

export const getServerSideProps: GetServerSideProps<Props> = async(args) => {
  if (!appConfig.beaconChain.hasBeaconChain) {
    return {
      notFound: true,
    };
  }

  return getServerSidePropsBase(args);
};
