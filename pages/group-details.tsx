import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

// import HandDetails from 'ui/storge/hand-details';
// import TableDetails from 'ui/storge/table-details';
const HandDetails = dynamic(() => import('ui/storge/hand-details'), { ssr: false });
const TableDetails = dynamic(() => import('ui/storge/table-details'), { ssr: false });
function formatPubKey(pubKey: string, _length = 4, _preLength = 4) {
  if (!pubKey) {
    return;
  }
  if (!pubKey || typeof pubKey !== 'string' || pubKey.length < (_length * 2 + 1)) {
    return pubKey;
  }
  return pubKey.substr(0, _preLength || _length) + '...' + pubKey.substr(_length * -1, _length);
}

const Page: NextPage = () => {
  const overview = {
    'Object Name': '0xdlz',
    'Object Tags': '0',
    'Object ID': '1',
    'Object No.': '24521',
    Type: '001',
    'Object Size': 'Created',
    'Object Status': 'Sealed',
    Deleted: 'NO',
  };
  const more = {
    Visibility: {
      value: 'Public',
      status: 'none',
    },
    'Bucket Name': {
      value: 'mainnet-bsc-blocks',
      status: 'link',
    },
    'Last Updated Time': {
      value: formatPubKey('0x23c845626A460012EAa27842dd5d24b465B356E7'),
      status: 'time',
    },
    Creator: {
      value: '0x4c1a93cd42b6e4960db845bcf9d540b081b1a63a',
      status: 'copyLink',
    },
    Owner: {
      value: '0x4c1a93cd42b6e4960db845bcf9d540b081b1a63a',
      status: 'copyLink',
    },
    'Primary SP': {
      value: 'nodereal',
      status: 'link',
    },
    'Secondary SP Addresses': {
      value: 'Click to view all',
      status: 'clickViewAll',
    },
  };
  const tapList = [ 'objects', 'Transactions', 'Permissions' ];
  const tabThead = [ 'Transactions', 'Group Member', 'Group Objects', 'Group Buckets' ];
  const talbeList = [
    {
      txnHash: '0xa317...d45455',
      Block: '10269120',
      Type: 'Seal Object',
      objectSize: '1.41 KB',
      Visibility: 'Private',
      lastTime: '17h 51m ago',
      Creator: '0xbe...123mx0',
    },
    {
      txnHash: '0xa317...d45455',
      Block: '10269120',
      Type: 'Seal Object',
      objectSize: '1.41 KB',
      Visibility: 'Private',
      lastTime: '17h 51m ago',
      Creator: '0xbe...123mx0',
    },
    {
      txnHash: '0xa317...d45455',
      Block: '10269120',
      Type: 'Seal Object',
      objectSize: '1.41 KB',
      Visibility: 'Private',
      lastTime: '17h 51m ago',
      Creator: '0xbe...123mx0',
    },
    {
      txnHash: '0xa317...d45455',
      Block: '10269120',
      Type: 'Seal Object',
      objectSize: '1.41 KB',
      Visibility: 'Private',
      lastTime: '17h 51m ago',
      Creator: '0xbe...123mx0',
    },
  ];
  return (
    <PageNextJs pathname="/object-details">
      <HandDetails overview={ overview } more={ more }/>
      <TableDetails tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead }/>
    </PageNextJs>
  );
};

export default Page;
