// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

const Cluster = dynamic(() => import('src/features/name-services/clusters/pages/details/Cluster'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/name-services/clusters/[name]" query={ props.query }>
      <Cluster/>
    </PageNextJs>
  );
};

export default Page;

export { nameServiceClusters as getServerSideProps } from 'src/server/getServerSideProps/main';
