import { Flex, Box } from '@chakra-ui/react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';

import type { ObjectDetailsOverviewType } from 'types/storage';

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

  const routerFallback = () => () => {
    router.back();
  };

  const [ objectAddress, setobjectAddress ] = React.useState<string>('');
  React.useEffect(() => {
  }, [ objectAddress ]);
  const changeTable = React.useCallback((value: string) => {
    setobjectAddress(value);
  }, []);

  const queries = [
    {
      tableName: 'object',
      fields: [
        'object_name',
        'tags',
        'object_id',
        'content_type',
        'payload_size',
        'status',
        'delete_at',
        'visibility',
        'bucket_name',
        'update_time',
        'removed',
        'creator: owner_address',
        'owner: owner_address',
        `primary_sp: bucket {
          global_virtual_group_family {
            primary_sp {
              moniker
            }
            global_virtual_group_ids
          }
        }`,
      ],
      where: { object_id: { _eq: router.query.address } },
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

  const details = data?.object && data?.object[0];

  const overview: ObjectDetailsOverviewType = {
    'Object Name': details?.object_name,
    'Object Tags': Object.entries(details?.tags).length.toString(),
    'Object ID': details?.object_id,
    'Object No.': details?.object_id,
    Type: details?.content_type,
    'Object Size': details?.content_type || '',
    'Object Status': details?.status,
    Deleted: details?.removed || 'NO',
  };
  const more = {
    Visibility: {
      value: details?.visibility,
      status: 'none',
    },
    'Bucket Name': {
      id: details?.bucket_name,
      value: details?.bucket_name,
      status: 'bucketPage',
    },
    'Last Updated Time': {
      value: details?.update_time,
      status: 'time',
    },
    Creator: {
      value: details?.creator,
      status: 'copyLink',
    },
    Owner: {
      value: details?.owner,
      status: 'copyLink',
    },
  };
  const secondaryAddresses = [ '0x4c1a93cd42b6e4960db845bcf9d540b081b1a63a', '0x4c1a93cd42b6e4960db845bcf9d540b081b1a63a' ];
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
    <PageNextJs pathname="/object-details/[address]" query={ props.query }>
      <Flex align="center" marginBottom="24px">
        <IconSvg onClick={ routerFallback() } cursor="pointer" w="24px" h="24px" marginRight="4px" name="Fallback"></IconSvg>
        <PageTitle marginBottom="0" title="Object Details" withTextAd/>
        <Box ml="6px">{ formatPubKey(details?.object_name) }</Box>
      </Flex>
      <HandDetails overview={ overview } more={ more } secondaryAddresses={ secondaryAddresses }/>
      <TableDetails tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead } changeTable={ changeTable }/>
    </PageNextJs>
  );
};

export default React.memo(ObjectDetails);
