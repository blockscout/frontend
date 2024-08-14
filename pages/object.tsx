/* eslint-disable no-console */
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import PageTitle from 'ui/shared/Page/PageTitle';

// import { getEnvValue } from 'configs/app/utils';
// const asd = getEnvValue('NEXT_PUBLIC_MARKETPLACE_ENABLED');
// import useFetch from 'lib/hooks/useFetch';

const TableList = dynamic(() => import('ui/storage/table-list'), { ssr: false });
const ObjectDetails: NextPage = () => {
  // const fetch = useFetch();

  // (async() => {
  //   const rp = await fetch(asd || '');
  //   console.log(rp);
  // })();
  const tapList = [ 'Transactions', 'Versions' ];

  const tabThead = [ 'Object Name', 'Type', 'Object Size', 'Status', 'Visibility', 'Last Updated Time', 'Bucket', 'Creator' ];
  const talbeList = [
    {
      'Object Name': '4c83feb331594408sdjhfsdk98238293',
      Type: 'Seal Object',
      'Object Size': '40 B',
      Status: 'Created',
      Visibility: 'unSpecified',
      'Last Updated Time': new Date().toString(),
      Bucket: 'xxxxx-xxxxx',
      Creator: '0x23c845626A460012EAa27842dd5d24b465B356E7',
    },
  ];
  return (
    <PageNextJs pathname="/object">
      <PageTitle title="Objects" withTextAd/>
      <TableList tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead }/>
    </PageNextJs>
  );
};

export default React.memo(ObjectDetails);
