import { Flex, Box, Tooltip } from '@chakra-ui/react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

import useGraphqlQuery from 'lib/api/useGraphqlQuery';
import IconSvg from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';
import TableDetails from 'ui/storage/table-details';
import { Requires } from 'ui/storage/tabs-requires';
import { timeTool, sizeTool, formatPubKey, timeText } from 'ui/storage/utils';

const HeadDetails = dynamic(() => import('ui/storage/head-details'), { ssr: false });

const ObjectDetails: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const routerFallback = () => () => {
    router.back();
  };

  const queries = [
    {
      tableName: 'buckets',
      fields: [
        'bucket_name',
        'tags',
        'bucket_id',
        `objects {
          object_name
          content_type
          status
          visibility
          update_time
          creator_address
        }`,
        'status',
        'delete_at',
        'update_time',
        'storage_size',
        'charge_size',
        'creator: owner_address',
        'payment_address',
        'global_virtual_group_family_id',
        `global_virtual_group_family {
          global_virtual_group_ids
        }`,
        'removed',
      ],
      limit: 10, // Example: set limit to 10
      offset: 0, // Example: set offset to 0
      // If you need to add where or order conditions, you can do so here
      where: { bucket_name: { _ilike: router.query.address } }, // Example filter condition
      // order: { create_at: "DESC" } // Example order condition
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
  const { loading, data } = useGraphqlQuery('Bucket', router.query.address ? queries : []);
  const details = data?.buckets && data?.buckets[0];
  const [ loadsing, setLoadsing ] = React.useState(true);
  React.useEffect(() => {
    if (!loading && Object.keys(data?.buckets || {}).length) {
      setLoadsing(false);
    }
  }, [ data, loading ]);

  const [ oldTimeText, setoldTimeText ] = React.useState<string>('');
  React.useEffect(() => {
    const time = setInterval(() => {
      if (details?.update_time) {
        setoldTimeText(`${ timeTool(details?.update_time).toString() } (${ timeText(details?.update_time) })`);
      }
    }, 1000);
    return (() => {
      clearInterval(time);
    });
  }, [ details?.update_time ]);
  React.useEffect(() => {
    details?.update_time && setoldTimeText(`${ timeTool(details?.update_time).toString() } (${ timeText(details?.update_time) })`);
  }, [ details ]);

  const overview = {
    'Bucket Name': details?.bucket_name,
    'Bucket Tags': details?.tags && Object.entries(details?.tags).length.toString(),
    'Bucket ID': details?.bucket_id,
    // 'Bucket No.': details?.bucket_id,
    'Active Objects Count': details?.objects.length,
    'Bucket Status': details?.status,
    Deleted: details?.removed ? 'Yes' : 'No',
  };
  const more = {
    'Last Updated Time': {
      value: oldTimeText,
      status: 'time',
    },
    'Storage Size': {
      value: sizeTool(details?.storage_size),
      status: 'none',
    },
    'Charge Size': {
      value: sizeTool(details?.charge_size),
      status: 'none',
      tip: 'If the object\'s storage size is less than   , charge size is 128k; otherwise charge size is equal to storage size.',
    },
    Creator: {
      value: details?.creator,
      status: 'copyLink',
    },
    'Payment Address': {
      value: details?.payment_address,
      status: 'copyLink',
    },
    'Virtual Group Family ID': {
      titleNmae: 'All GVGs',
      value: 'Click to view all GVGs',
      status: 'clickViewAll',
    },
  };
  const secondaryAddresses = details?.global_virtual_group_family.global_virtual_group_ids.replace('{', '').replace('}', '').split(',') || [];
  const groupFamilyId = details?.global_virtual_group_family_id || '';
  const [ tabName, setTabName ] = React.useState<'Transactions' | 'Versions'>('Transactions');

  const tabsList = [ 'Transactions', 'Versions' ];
  const tableList = [
    {
      'Txn Hash': '',
    },
  ];
  const changeTable = React.useCallback((value: 'Transactions' | 'Versions') => {
    setTabName(value);
  }, []);
  const tabRequires = Requires(tabName, 1);
  const [ queryParams, setQueryParams ] = React.useState<{offset: number; searchTerm: string; page: number}>({
    offset: 0,
    searchTerm: '',
    page: 1,
  });

  const updateQueryParams = (newParams: Partial<{ offset: number; searchTerm: string; page: number }>) => {
    setQueryParams(prevParams => ({
      ...prevParams,
      ...newParams,
    }));
  };

  const [ toNext, setToNext ] = React.useState<boolean>(true);
  React.useEffect(() => {
    if (queryParams.page > 1) {
      updateQueryParams({
        offset: (queryParams.page - 1) * 20,
      });
    } else {
      updateQueryParams({
        offset: 0,
      });
    }
  }, [ queryParams.page ]);

  const propsPage = React.useCallback((value: number) => {
    updateQueryParams({
      page: value,
    });
  }, []);

  React.useEffect(() => {
    if (typeof tabRequires === 'number' && tabRequires !== 21) {
      setToNext(false);
    } else {
      setToNext(true);
    }
  }, [ tabRequires ]);

  return (
    <PageNextJs pathname="/bucket-details/[address]" query={ props.query }>
      <Flex align="center" marginBottom="24px">
        <IconSvg onClick={ routerFallback() } cursor="pointer" w="24px" h="24px" marginRight="4px" name="Fallback"></IconSvg>
        <PageTitle marginBottom="0" title="Bucket Details" withTextAd/>
        <Tooltip
          isDisabled={ details?.bucket_name.length <= 60 }
          label={ details?.bucket_name } padding="8px" placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
          <Box ml="6px" color="rgba(0, 0, 0, 0.4)" fontWeight="400" fontSize="14px">
            { details?.bucket_name.length > 60 ? formatPubKey(details?.bucket_name, 0, 60) : details?.bucket_name }
          </Box>
        </Tooltip>
      </Flex>
      <HeadDetails loading={ loadsing } secondaryAddresses={ secondaryAddresses } groupFamilyId={ groupFamilyId } overview={ overview } more={ more }/>
      <TableDetails
        changeTable={ changeTable }
        tabsList={ tabsList }
        tableList={ tableList }
        toNext={ toNext }
        currPage={ queryParams.page }
        propsPage={ propsPage }
      >
      </TableDetails>
    </PageNextJs>
  );
};

export default React.memo(ObjectDetails);
