import type { GetServerSideProps } from 'next';

import appConfig from 'configs/app/config';
import type { Props } from 'lib/next/getServerSideProps';
import { getServerSideProps as getServerSidePropsBase } from 'lib/next/getServerSideProps';

export const getServerSideProps: GetServerSideProps<Props> = async(args) => {
  if (!appConfig.L2.isL2Network) {
    return {
      notFound: true,
    };
  }

  return getServerSidePropsBase(args);
};
