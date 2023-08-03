import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'lib/next/getServerSideProps';
import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const MarketplaceApp = dynamic(() => import('ui/pages/MarketplaceApp'), { ssr: false });

const MarketplaceAppPage: NextPage<Props> = (props: Props) => {
  return (
    <PageServer pathname="/apps/[id]" query={ props }>
      <Page wrapChildren={ false }>
        <MarketplaceApp/>
      </Page>
    </PageServer>
  );
};

export default MarketplaceAppPage;

export { marketplace as getServerSideProps } from 'lib/next/getServerSideProps';
