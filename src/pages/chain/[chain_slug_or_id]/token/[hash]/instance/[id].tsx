// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import type { Route } from 'nextjs-routes';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

const MultichainTokenInstance = dynamic(() => import('src/features/multichain/pages/token-instance/MultichainTokenInstance'), { ssr: false });

const pathname: Route['pathname'] = '/token/[hash]/instance/[id]';

const Page: NextPage<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  return (
    <PageNextJs pathname={ pathname } query={ props.query } apiData={ props.apiData }>
      <MultichainTokenInstance/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'src/server/getServerSideProps/multichain';
