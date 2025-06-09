import type { NextPage } from 'next';
import React from 'react';

import type { Route } from 'nextjs-routes';
import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

import multichainConfig from 'configs/multichain';
import getSocketUrl from 'lib/api/getSocketUrl';
import { MultichainProvider } from 'lib/contexts/multichain';
import { SocketProvider } from 'lib/socket/context';
import Address from 'ui/pages/Address';

const pathname: Route['pathname'] = '/subchain/[subchain-id]/address/[hash]';

const Page: NextPage<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  // TODO @tom2drum rename subchain-id to slug
  const subchainId = props.query?.['subchain-id'];
  const subchainData = multichainConfig()?.chains.find(chain => chain.slug === subchainId);

  return (
    <PageNextJs pathname={ pathname } query={ props.query } apiData={ props.apiData }>
      <SocketProvider url={ getSocketUrl(subchainData?.config) }>
        <MultichainProvider>
          <Address/>
        </MultichainProvider>
      </SocketProvider>
    </PageNextJs>
  );
};

export default Page;

export { multichain as getServerSideProps } from 'nextjs/getServerSideProps';
