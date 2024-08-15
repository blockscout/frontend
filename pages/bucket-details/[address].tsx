/* eslint-disable no-console */
import { Flex, Box } from '@chakra-ui/react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

import PageTitle from 'ui/shared/Page/PageTitle';

const HandDetails = dynamic(() => import('ui/storage/hand-details'), { ssr: false });
const TableDetails = dynamic(() => import('ui/storage/table-details'), { ssr: false });

function formatPubKey(pubKey: string | undefined, _length = 4, _preLength = 4) {
  if (!pubKey) {
    return;
  }
  if (!pubKey || typeof pubKey !== 'string' || pubKey.length < (_length * 2 + 1)) {
    return pubKey;
  }
  return pubKey.substr(0, _preLength || _length) + '...' + pubKey.substr(_length * -1, _length);
}

const ObjectDetails: NextPage<Props> = (props: Props) => {
  const router = useRouter();

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
      status: 'bucketPage',
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
  const tapList = [ 'Transactions', 'Versions' ];
  const tabThead = [ 'Txn Hash', 'Block', 'Age', 'Type' ];
  const talbeList = [
    {
      'Txn Hash': '4c83feb331594408sdjhfsdk98238293',
      Block: 'Seal Object',
      Age: '40 B',
      Type: 'Created',
    },
  ];

  const [ data, setData ] = React.useState<string>('');
  React.useEffect(() => {
  }, [ data ]);
  const changeTable = React.useCallback((value: string) => {
    setData(value);
  }, []);
  return (
    <PageNextJs pathname="/bucket-details/[address]" query={ props.query }>
      <Flex>
        <PageTitle title="Bucket Details" withTextAd/>
        <Box ml="6px">{ formatPubKey(router.query.address?.toString()) }</Box>
      </Flex>
      <HandDetails overview={ overview } more={ more }/>
      <TableDetails tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead } changeTable={ changeTable }/>
    </PageNextJs>
  );
};

export default React.memo(ObjectDetails);
