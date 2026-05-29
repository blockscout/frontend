// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

const NameDomain = dynamic(() => import('src/features/name-services/domains/pages/details/NameDomain'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/name-services/domains/[name]" query={ props.query }>
      <NameDomain/>
    </PageNextJs>
  );
};

export default Page;

export { nameServiceEns as getServerSideProps } from 'src/server/getServerSideProps/main';
