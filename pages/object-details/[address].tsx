/* eslint-disable no-console */
import { Flex, Box, Tooltip } from '@chakra-ui/react';
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
import { formatPubKey, sizeTool, timeTool, timeText } from 'ui/storage/utils';

const HeadDetails = dynamic(() => import('ui/storage/head-details'), { ssr: false });

const ObjectDetails: NextPage<Props> = (props: Props) => {
  const router = useRouter();

  const routerFallback = () => () => {
    router.back();
  };

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
  const overTime = timeTool(details?.update_time);

  const [ oldTimeText, setoldTimeText ] = React.useState<string>('');
  React.useEffect(() => {
    let countdown = 0;
    if (typeof overTime === 'number' && countdown <= 60 && !Number.isNaN(overTime)) {
      setTimeout(() => {
        countdown = overTime + 1;
        setoldTimeText(`${ countdown } second ago ${ timeText(details?.update_time) }`);
      }, 1000);
    } else if (!oldTimeText && !Number.isNaN(overTime)) {
      setoldTimeText(timeTool(details?.update_time).toString());
    }
  }, [ oldTimeText, overTime, details ]);

  const overview: ObjectDetailsOverviewType = {
    'Object Name': details?.object_name,
    'Object Tags': details?.tags && Object.entries(details?.tags).length.toString(),
    'Object ID': details?.object_id && formatPubKey(details?.object_id, 6, 6),
    // 'Object No.': details?.object_id && formatPubKey(details?.object_id, 6, 6),
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
      value: oldTimeText || '-',
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
  const secondaryAddresses: Array<string> | undefined = [];

  return (
    <PageNextJs pathname="/object-details/[address]" query={ props.query }>
      <Flex align="center" marginBottom="24px">
        <IconSvg onClick={ routerFallback() } cursor="pointer" w="24px" h="24px" marginRight="4px" name="Fallback"></IconSvg>
        <PageTitle marginBottom="0" title="Object Details" withTextAd/>
        <Tooltip
          isDisabled={ details?.object_name.length < 60 }
          label={ details?.object_name } padding="8px" placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
          <Box ml="6px" color="rgba(0, 0, 0, 0.4)" fontWeight="400" fontSize="14px">
            { details?.object_name.length > 60 ? formatPubKey(details?.object_name, 60, 0) : details?.object_name }
          </Box>
        </Tooltip>
      </Flex>
      <HeadDetails loading={ loadsing } overview={ overview } more={ more } secondaryAddresses={ secondaryAddresses }/>
    </PageNextJs>
  );
};

export default React.memo(ObjectDetails);
