import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';
const TableList = dynamic(() => import('ui/storge/table-list'), { ssr: false });

// import HandDetails from 'ui/storge/hand-details';
// import TableDetails from 'ui/storge/table-details';
// const HandDetails = dynamic(() => import('ui/storge/hand-details'), { ssr: false });
// const TableDetails = dynamic(() => import('ui/storge/table-details'), { ssr: false });
// function formatPubKey(pubKey: string, _length = 4, _preLength = 4) {
//   if (!pubKey) {
//     return;
//   }
//   if (!pubKey || typeof pubKey !== 'string' || pubKey.length < (_length * 2 + 1)) {
//     return pubKey;
//   }
//   return pubKey.substr(0, _preLength || _length) + '...' + pubKey.substr(_length * -1, _length);
// }

const Page: NextPage = () => {
  // const overview = {
  //   'Object Name': '0xdlz',
  //   'Object Tags': '0',
  //   'Object ID': '1',
  //   'Object No.': '24521',
  //   Type: '001',
  //   'Object Size': 'Created',
  //   'Object Status': 'Sealed',
  //   Deleted: 'NO',
  // };
  // const more = {
  //   Visibility: {
  //     value: 'Public',
  //     status: 'none',
  //   },
  //   'Bucket Name': {
  //     value: 'mainnet-bsc-blocks',
  //     status: 'link',
  //   },
  //   'Last Updated Time': {
  //     value: formatPubKey('0x23c845626A460012EAa27842dd5d24b465B356E7'),
  //     status: 'time',
  //   },
  //   Creator: {
  //     value: '0x4c1a93cd42b6e4960db845bcf9d540b081b1a63a',
  //     status: 'copyLink',
  //   },
  //   Owner: {
  //     value: '0x4c1a93cd42b6e4960db845bcf9d540b081b1a63a',
  //     status: 'copyLink',
  //   },
  //   'Primary SP': {
  //     value: 'nodereal',
  //     status: 'link',
  //   },
  //   'Secondary SP Addresses': {
  //     value: 'Click to view all',
  //     status: 'clickViewAll',
  //   },
  // };
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
      { /* <HandDetails overview={ overview } more={ more }/>
      <TableDetails tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead }/> */ }
      <TableList tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead }/>
    </PageNextJs>
  );
};

export default Page;
