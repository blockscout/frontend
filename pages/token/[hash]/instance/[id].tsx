import _omit from 'lodash/omit';
import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import * as gSSP from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';
import fetchApi from 'nextjs/utils/fetchApi';

const TokenInstance = dynamic(() => import('ui/pages/TokenInstance'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  const query = _omit(props, 'apiData');
  return (
    <PageNextJs pathname="/token/[hash]/instance/[id]" query={ query }>
      <TokenInstance/>
    </PageNextJs>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps<Props> = async(ctx) => {
  const baseResponse = await gSSP.base(ctx);

  if ('props' in baseResponse) {
    const apiData = await fetchApi({
      resource: 'token',
      pathParams: { hash: (await baseResponse.props).hash },
      timeout: 500,
    });

    (await baseResponse.props).apiData = apiData ? {
      symbol: apiData.symbol,
    } : undefined;
  }
  return baseResponse;
};
