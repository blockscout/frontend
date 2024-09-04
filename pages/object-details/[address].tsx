/* eslint-disable no-console */
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
import { formatPubKey, sizeTool, timeTool } from 'ui/storage/utils';

const HeadDetails = dynamic(() => import('ui/storage/head-details'), { ssr: false });
// const TableDetails = dynamic(() => import('ui/storage/table-details'), { ssr: false });

const ObjectDetails: NextPage<Props> = (props: Props) => {
  const router = useRouter();

  const routerFallback = () => () => {
    router.back();
  };

  // const [ objectAddress, setobjectAddress ] = React.useState<string>('');
  // React.useEffect(() => {
  // }, [ objectAddress ]);
  // const changeTable = React.useCallback((value: string) => {
  //   setobjectAddress(value);
  // }, []);

  const queries = [
    {
      tableName: 'objects',
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
      where: { object_name: { _ilike: router.query.address } },
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
  const { loading, data } = useGraphqlQuery('Objects', router.query.address ? queries : []);
  const [ loadsing, setLoadsing ] = React.useState(true);
  React.useEffect(() => {
    if (!loading && Object.keys(data?.objects || {}).length) {
      setLoadsing(false);
    }
  }, [ data, loading ]);

  const details = data?.objects && data?.objects[0];

  const overview: ObjectDetailsOverviewType = {
    'Object Name': details?.object_name,
    'Object Tags': details?.tags && Object.entries(details?.tags).length.toString(),
    'Object ID': details?.object_id && formatPubKey(details?.object_id, 6, 6),
    'Object No.': details?.object_id && formatPubKey(details?.object_id, 6, 6),
    Type: details?.content_type,
    'Object Size': sizeTool(details?.payload_size),
    'Object Status': details?.status,
    Deleted: details?.removed ? 'Yes' : 'No',
  };
  const more = {
    Visibility: {
      value: details?.visibility,
      status: 'none',
    },
    'Bucket Name': {
      value: details?.bucket_name,
      status: 'bucketPage',
    },
    'Last Updated Time': {
      value: timeTool(details?.update_time),
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
  // const tapList = [ 'Transactions', 'Versions' ];
  // const tabThead = [ 'Txn Hash', 'Block', 'Age', 'Type' ];
  // const talbeList = [
  //   {
  //     'Txn Hash': 'object1.txt',
  //     Block: 'Seal Object',
  //     Age: '40 B',
  //     Type: 'Created',
  //   },
  // ];

  return (
    <PageNextJs pathname="/object-details/[address]" query={ props.query }>
      <Flex align="center" marginBottom="24px">
        <IconSvg onClick={ routerFallback() } cursor="pointer" w="24px" h="24px" marginRight="4px" name="Fallback"></IconSvg>
        <PageTitle marginBottom="0" title="Object Details" withTextAd/>
        <Box ml="6px" color="rgba(0, 0, 0, 0.4)" fontWeight="400" fontSize="14px">
          { details?.object_name.length > 60 ? formatPubKey(details?.object_name, 60, 0) : details?.object_name }
        </Box>
      </Flex>
      <HeadDetails loading={ loadsing } overview={ overview } more={ more } secondaryAddresses={ secondaryAddresses }/>
      { /* <TableDetails tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead } changeTable={ changeTable }/> */ }
    </PageNextJs>
  );
};

export default React.memo(ObjectDetails);
