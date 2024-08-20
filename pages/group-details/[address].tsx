import { Flex, Box } from '@chakra-ui/react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

import useGraphqlQuery from 'lib/api/useGraphqlQuery';
import IconSvg from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';

const HandDetails = dynamic(() => import('ui/storage/head-details'), { ssr: false });
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
  const [ objectAddress, setobjectAddress ] = React.useState<string>('');
  React.useEffect(() => {
  }, [ objectAddress ]);
  const changeTable = React.useCallback((value: string) => {
    setobjectAddress(value);
  }, []);
  const routerFallback = () => () => {
    router.back();
  };

  const queries = [
    {
      tableName: 'storage_group',
      fields: [
        'group_name',
        'tags',
        'group_id',
        'extra',
        'source_type',
        'update_at',
        'create_at',
        `members: group_members {
          id
          member
          expiration_time
        }`,
        'owner_address',
      ],
      where: { group_name: { _eq: router.query.address } },
    },
    {
      tableName: 'transaction',
      fields: [
        'gas_used',
        'gas_wanted',
        'logs',
        'memo',
        'raw_log',
        'messages',
        'hash',
      ],
    },
  ];
  const { data } = useGraphqlQuery('Objects', queries);
  const details = data?.storage_group && data?.storage_group[0];

  const overview = {
    'Group Name': details?.group_name,
    'Group Tags': Object.entries(details?.tags).length.toString(),
    'Group ID': details?.group_id,
    Extra: details?.extra,
    'Source Type': details?.source_type,
  };
  const more = {
    'Last Updated': {
      value: 'Public',
      status: 'none',
    },
    'Created Block': {
      value: 'mainnet-bsc-blocks',
      status: 'bucketPage',
    },
    'Resources Count': {
      value: formatPubKey('0x23c845626A460012EAa27842dd5d24b465B356E7'),
      status: 'time',
    },
    'Active Group Member Count': {
      value: '0x4c1a93cd42b6e4960db845bcf9d540b081b1a63a',
      status: 'copyLink',
    },
    Owner: {
      value: '0x4c1a93cd42b6e4960db845bcf9d540b081b1a63a',
      status: 'copyLink',
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

  return (
    <PageNextJs pathname="/group-details/[address]" query={ props.query }>
      <Flex align="center" marginBottom="24px">
        <IconSvg onClick={ routerFallback() } cursor="pointer" w="24px" h="24px" marginRight="4px" name="Fallback"></IconSvg>
        <PageTitle marginBottom="0" title="Group Details" withTextAd/>
        <Box ml="6px">{ router.query.address }</Box>
      </Flex>
      <HandDetails overview={ overview } more={ more }/>
      <TableDetails tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead } changeTable={ changeTable }/>
    </PageNextJs>
  );
};

export default React.memo(ObjectDetails);
