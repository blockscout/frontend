import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

// import HandDetails from 'ui/storge/hand-details';
// import TableDetails from 'ui/storge/table-details';
// const HandDetails = dynamic(() => import('ui/storge/hand-details'), { ssr: false });
// const TableDetails = dynamic(() => import('ui/storge/table-details'), { ssr: false });
const TableList = dynamic(() => import('ui/storge/table-list'), { ssr: false });
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
  //   'Group Name': '0xdlz',
  //   'Group Tags': '0',
  //   'Group ID': '0x0001',
  //   Extra: '0',
  //   'Source Type': 'Created',
  // };
  // const more = {
  //   'Last Updated': {
  //     value: 'Public',
  //     status: 'none',
  //   },
  //   'Created Block': {
  //     value: 'mainnet-bsc-blocks',
  //     status: 'link',
  //   },
  //   'Resources Count': {
  //     value: formatPubKey('0x23c845626A460012EAa27842dd5d24b465B356E7'),
  //     status: 'time',
  //   },
  //   'Active Group Member Count': {
  //     value: '0x4c1a93cd42b6e4960db845bcf9d540b081b1a63a',
  //     status: 'copyLink',
  //   },
  //   Owner: {
  //     value: 'nodereal',
  //     status: 'link',
  //   },
  // };
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
      { /* <HandDetails overview={ overview } more={ more }/>
      <TableDetails tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead }/> */ }
      <TableList tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead }/>
    </PageNextJs>
  );
};

export default Page;
