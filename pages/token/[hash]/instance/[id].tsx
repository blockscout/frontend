import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import * as gSSP from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';
import fetchApi from 'nextjs/utils/fetchApi';

const TokenInstance = dynamic(() => import('ui/pages/TokenInstance'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/token/[hash]/instance/[id]" pageProps={ props }>
      <TokenInstance/>
    </PageNextJs>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps<Props<'/token/[hash]/instance/[id]'>> = async(ctx) => {
  const baseResponse = await gSSP.base(ctx);

  if ('props' in baseResponse) {
    const apiData = await fetchApi({
      resource: 'token',
      pathParams: { hash: (await baseResponse.props).hash },
      timeout: 500,
    });

    (await baseResponse.props as Props<'/token/[hash]/instance/[id]'>).apiData = apiData && apiData.symbol ? {
      symbol: apiData.symbol,
    } : undefined;
  }
  return baseResponse;
};
