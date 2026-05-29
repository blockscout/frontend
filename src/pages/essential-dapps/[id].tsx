// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

const MarketplaceEssentialDapp = dynamic(() => import('src/features/marketplace/pages/essential-dapp/MarketplaceEssentialDapp'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => (
  <PageNextJs pathname="/essential-dapps/[id]" query={ props.query }>
    <MarketplaceEssentialDapp/>
  </PageNextJs>
);

export default Page;

export { marketplaceEssentialDapp as getServerSideProps } from 'src/server/getServerSideProps/main';
