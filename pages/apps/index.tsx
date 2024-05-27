import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { NextPageWithLayout } from 'nextjs/types';

import type { Route } from 'nextjs-routes';
import * as gSSP from 'nextjs/getServerSideProps';
import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

const Marketplace = dynamic(() => import('ui/pages/Marketplace'), { ssr: false });

const pathname: Route['pathname'] = '/apps';

const Page: NextPageWithLayout<Props<typeof pathname>> = (props: Props<typeof pathname>) => (
  <PageNextJs pathname={ pathname } query={ props.query } apiData={ props.apiData }>
    <Marketplace/>
  </PageNextJs>
);

export default Page;

export const getServerSideProps: GetServerSideProps<Props<typeof pathname>> = async(ctx) => {
  const baseResponse = await gSSP.marketplace<typeof pathname>(ctx);

  if ('props' in baseResponse) {
    (await baseResponse.props).apiData = {
      seo_category: typeof ctx.query.category === 'string' ? ctx.query.category : 'DApps',
      seo_details: ctx.query.category ? 'Decentralized trading apps' : 'Explore top apps',
    };
  }

  return baseResponse;
};
