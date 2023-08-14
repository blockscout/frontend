import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'lib/next/getServerSideProps';
import PageServer from 'lib/next/PageServer';
import type { NextPageWithLayout } from 'pages/_app';

const MarketplaceApp = dynamic(() => import('ui/pages/MarketplaceApp'), { ssr: false });

const Page: NextPageWithLayout<Props> = (props: Props) => {
  return (
    <PageServer pathname="/apps/[id]" query={ props }>
      <MarketplaceApp/>
    </PageServer>
  );
};

export default Page;

export { marketplace as getServerSideProps } from 'lib/next/getServerSideProps';
