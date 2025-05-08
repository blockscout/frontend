/* eslint-disable */
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs'
import dynamic from 'next/dynamic';

import type { NextPageWithLayout } from 'nextjs/types';;
import type { Route } from 'nextjs-routes';
import type { Props } from 'nextjs/getServerSideProps';

const pathname: Route['pathname'] = '/validator-detail/[addr]';

const ValidatorDetails = dynamic(() => import('ui/validators/ValidatorDetails'), { ssr: false });

const Page: NextPageWithLayout<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  return (
    <PageNextJs pathname={ pathname } query={ props.query } apiData={ props.apiData }>
      <ValidatorDetails />
    </PageNextJs>
  );
};

export default Page;
