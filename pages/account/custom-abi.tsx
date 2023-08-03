import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const CustomAbi = dynamic(() => import('ui/pages/CustomAbi'), { ssr: false });

const CustomAbiPage: NextPage = () => {
  return (
    <PageServer pathname="/account/custom-abi">
      <Page>
        <CustomAbi/>
      </Page>
    </PageServer>
  );
};

export default CustomAbiPage;

export { account as getServerSideProps } from 'lib/next/getServerSideProps';
