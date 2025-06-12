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

const pathname: Route['pathname'] = '/subchain/[subchain-slug]/address/[hash]';

const Page: NextPage<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  const subchainSlug = props.query?.['subchain-slug'];
  const subchainData = multichainConfig()?.chains.find(chain => chain.slug === subchainSlug);

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
