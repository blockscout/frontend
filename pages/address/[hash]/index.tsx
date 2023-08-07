import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'lib/next/getServerSideProps';
import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const Address = dynamic(() => import('ui/pages/Address'), { ssr: false });

const AddressPage: NextPage<Props> = (props: Props) => {
  return (
    <PageServer pathname="/address/[hash]" query={ props }>
      <Page>
        <Address/>
      </Page>
    </PageServer>
  );
};

export default AddressPage;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';
