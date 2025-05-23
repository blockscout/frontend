import type { NextPage } from 'next';
import React from 'react';

import type { Route } from 'nextjs-routes';
import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

import multichainConfig from 'configs/multichain';
import { MultichainProvider } from 'lib/contexts/multichain';
import { SocketProvider } from 'lib/socket/context';
import Address from 'ui/pages/Address';

const pathname: Route['pathname'] = '/subchain/[subchain-id]/address/[hash]';

const Page: NextPage<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  const subchainId = props.query?.['subchain-id'];
  const socketUrl = multichainConfig.chains.find(chain => chain.id === subchainId)?.apis.general.socketEndpoint;

  return (
    <PageNextJs pathname={ pathname } query={ props.query } apiData={ props.apiData }>
      <SocketProvider url={ socketUrl }>
        <MultichainProvider>
          <Address/>
        </MultichainProvider>
      </SocketProvider>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';
