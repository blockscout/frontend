import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import PageTitle from 'ui/shared/Page/PageTitle';
const TableList = dynamic(() => import('ui/storage/table-list'), { ssr: false });
const Page: NextPage = () => {
  const talbeList = [
    {
      'Bucket Name': '0xa317...d45455',
      'Bucket ID': '10269120',
      'Last Updated Time': 'Seal Object',
      Status: '1.41 KB',
      'Active Objects Count': 'Private',
      Creator: '17h 51m ago',
    },
  ];
  const tapList = [ 'Transactions', 'Versions' ];
  const tabThead = [ 'Bucket Name', 'Bucket ID', 'Last Updated Time', 'Status', 'Active Objects Count', 'Creator' ];
  return (
    <PageNextJs pathname="/bucket">
      <PageTitle title="Buckets" withTextAd/>
      <TableList tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead }/>
    </PageNextJs>
  );
};

export default Page;
