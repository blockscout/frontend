import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import useAddressTxsQuery from 'queries/address/addresTxs';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

import useAddressQuery from 'ui/address/utils/useAddressQuery';

const Address = dynamic(() => import('ui/pages/Address'), { ssr: false });

const Page: NextPage<Props> = (props: Props) => {
  useAddressQuery({ hash: props.hash });

  // add filter
  useAddressTxsQuery({ hash: props.hash, enabled: !props.tab || props.tab === 'txs' });

  return (
    <PageNextJs pathname="/address/[hash]" query={ props }>
      <Address/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';
