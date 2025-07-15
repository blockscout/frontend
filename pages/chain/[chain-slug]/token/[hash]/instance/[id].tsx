import type { NextPage } from 'next';
import React from 'react';

import type { Route } from 'nextjs-routes';
import type { Props } from 'nextjs/getServerSideProps/handlers';
import PageNextJs from 'nextjs/PageNextJs';

import multichainConfig from 'configs/multichain';
import getSocketUrl from 'lib/api/getSocketUrl';
import { MultichainProvider } from 'lib/contexts/multichain';
import { SocketProvider } from 'lib/socket/context';
import TokenInstance from 'ui/pages/TokenInstance';

const pathname: Route['pathname'] = '/token/[hash]/instance/[id]';

const Page: NextPage<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  const chainSlug = props.query?.['chain-slug'];
  const chainData = multichainConfig()?.chains.find(chain => chain.slug === chainSlug);

  return (
    <PageNextJs pathname={ pathname } query={ props.query } apiData={ props.apiData }>
      <SocketProvider url={ getSocketUrl(chainData?.config) }>
        <MultichainProvider level="page">
          <TokenInstance/>
        </MultichainProvider>
      </SocketProvider>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps/multichain';
