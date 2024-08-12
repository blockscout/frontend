import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

// import HandDetails from 'ui/storge/hand-details';
// import TableDetails from 'ui/storge/table-details';
// import TableList from 'ui/storge/table-list';
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
// interface PropsMoreValueType {
//   value: string | undefined;
//   status: 'copyLink' | 'link' | 'time' | 'clickViewAll' | 'none';
// }
const objectDetails: NextPage = () => {
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
  const tapList = [ 'Transactions', 'Versions' ];
  const tabThead = [ 'Txn Hash', 'Block', 'Age', 'Type' ];
  const talbeList = [
    {
      txnHash: '0x28919c8bc497f6ba7f3d85550cf8782668d997117a19082668bb43ad1e302106',
      Block: '132878',
      Age: '17h 51m ago',
      Type: 'Seal Object',
    },
    {
      txnHash: '0x28919c8bc497f6ba7f3d85550cf8782668d997117a19082668bb43ad1e302106',
      Block: '132878',
      Age: '17h 51m ago',
      Type: 'Seal Object',
    },
    {
      txnHash: '0x28919c8bc497f6ba7f3d85550cf8782668d997117a19082668bb43ad1e302106',
      Block: '132878',
      Age: '17h 51m ago',
      Type: 'Seal Object',
    },
    {
      txnHash: '0x28919c8bc497f6ba7f3d85550cf8782668d997117a19082668bb43ad1e302106',
      Block: '132878',
      Age: '17h 51m ago',
      Type: 'Seal Object',
    },
    {
      txnHash: '0x28919c8bc497f6ba7f3d85550cf8782668d997117a19082668bb43ad1e302106',
      Block: '132878',
      Age: '17h 51m ago',
      Type: 'Seal Object',
    },
    {
      txnHash: '0x28919c8bc497f6ba7f3d85550cf8782668d997117a19082668bb43ad1e302106',
      Block: '132878',
      Age: '17h 51m ago',
      Type: 'Seal Object',
    },
  ];
  return (
    <PageNextJs pathname="/object-details">
      { /* <HandDetails overview={overview} more={more}/>
      <TableDetails tapList={tapList} talbeList={talbeList} tabThead={tabThead}/> */ }
      <TableList tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead }/>
    </PageNextJs>
  );
};

export default React.memo(objectDetails);
