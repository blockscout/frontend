import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

const NameDomain = dynamic(() => import('ui/pages/NameDomain'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/name-domains/[name]" query={ props.query }>
      <NameDomain/>
    </PageNextJs>
  );
};

export default Page;

export { nameService as getServerSideProps } from 'nextjs/getServerSideProps';
