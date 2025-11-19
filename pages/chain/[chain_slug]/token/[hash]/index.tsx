import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Route } from 'nextjs-routes';
import type { Props } from 'nextjs/getServerSideProps/handlers';
import PageNextJs from 'nextjs/PageNextJs';

const OpSuperchainToken = dynamic(() => import('ui/optimismSuperchain/token/OpSuperchainToken'), { ssr: false });

const pathname: Route['pathname'] = '/token/[hash]';

const Page: NextPage<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  return (
    <PageNextJs pathname={ pathname } query={ props.query } apiData={ props.apiData }>
      <OpSuperchainToken/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps/multichain';
