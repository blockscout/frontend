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
import { formatPubKey } from 'ui/storage/utils';

const HeadDetails = dynamic(() => import('ui/storage/head-details'), { ssr: false });
// const TableDetails = dynamic(() => import('ui/storage/table-details'), { ssr: false });

const ObjectDetails: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  // const [ objectAddress, setobjectAddress ] = React.useState<string>('');
  // React.useEffect(() => {
  // }, [ objectAddress ]);
  // const changeTable = React.useCallback((value: string) => {
  //   setobjectAddress(value);
  // }, []);
  const routerFallback = () => () => {
    router.back();
  };

  const queries = [
    {
      tableName: 'groups',
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
  const { loading, data } = useGraphqlQuery('Group', router.query.address ? queries : []);
  const details = data?.groups && data?.groups[0];
  const [ loadsing, setLoadsing ] = React.useState(true);
  React.useEffect(() => {
    if (!loading && Object.keys(data?.groups || {}).length) {
      setLoadsing(false);
    }
  }, [ data, loading ]);

  const overview = {
    'Group Name': details?.group_name,
    'Group Tags': details?.tags && Object.entries(details?.tags).length.toString(),
    'Group ID': formatPubKey(details?.group_id),
    Extra: details?.extra,
    'Source Type': details?.source_type,
  };
  const more = {
    'Last Updated': {
      value: details?.update_at,
      status: 'block',
    },
    'Created Block': {
      value: details?.create_at,
      status: 'block',
    },
    'Resources Count': {
      value: '',
      status: 'none',
    },
    'Active Group Member Count': {
      value: details?.tags && Object.entries(details?.members).length.toString(),
      status: 'none',
    },
    Owner: {
      value: details?.owner_address,
      status: 'copyLink',
    },
  };
  // const tapList = [ 'Transactions', 'Versions' ];
  // const tabThead = [ 'Txn Hash', 'Block', 'Age', 'Type' ];
  // const talbeList = [
  //   {
  //     'Txn Hash': '4c83feb331594408sdjhfsdk98238293',
  //     Block: 'Seal Object',
  //     Age: '40 B',
  //     Type: 'Created',
  //   },
  // ];

  return (
    <PageNextJs pathname="/group-details/[address]" query={ props.query }>
      <Flex align="center" marginBottom="24px">
        <IconSvg onClick={ routerFallback() } cursor="pointer" w="24px" h="24px" marginRight="4px" name="Fallback"></IconSvg>
        <PageTitle marginBottom="0" title="Group Details" withTextAd/>
        <Box ml="6px">{ router.query.address }</Box>
      </Flex>
      <HeadDetails loading={ loadsing } overview={ overview } more={ more }/>
      { /* <TableDetails tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead } changeTable={ changeTable }/> */ }
    </PageNextJs>
  );
};

export default React.memo(ObjectDetails);
