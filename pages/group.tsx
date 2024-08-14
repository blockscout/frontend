import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import PageTitle from 'ui/shared/Page/PageTitle';
const TableList = dynamic(() => import('ui/storage/table-list'), { ssr: false });

const Page: NextPage = () => {
  const tapList = [ 'objects', 'Transactions', 'Permissions' ];
  const tabThead = [ 'Group Name', 'Group ID', 'Last Updated', 'Active Group Member Count', 'Owner' ];
  const talbeList = [
    {
      'Group Name': '0xa317...d45455',
      'Group ID': '10269120',
      'Last Updated': 'Seal Object',
      'Active Group Member Count': '1.41 KB',
      Owner: 'Private',
    },
  ];
  return (
    <PageNextJs pathname="/group">
      <PageTitle title="Groups" withTextAd/>
      <TableList tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead }/>
    </PageNextJs>
  );
};

export default Page;
