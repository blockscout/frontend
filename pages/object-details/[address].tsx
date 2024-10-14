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
import TableDetails from 'ui/storage/table-details';
import { Requires } from 'ui/storage/tabs-requires';
import { formatPubKey, sizeTool, timeText, timeTool } from 'ui/storage/utils';

const HeadDetails = dynamic(() => import('ui/storage/head-details'), { ssr: false });

const ObjectDetails: NextPage<Props> = (props: Props) => {
  const router = useRouter();

  const routerFallback = () => () => {
    router.back();
  };
  const [ tabName, setTabName ] = React.useState<'Transactions' | 'Versions'>('Transactions');

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
              moniker,
              sp_id
            }
            global_virtual_group_ids
          }
        }`,
      ],
      where: { object_name: { _ilike: router.query.address } },
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
  const req = [
    {
      tableName: 'global_virtual_groups',
      fields: [
        'virtual_payment_address',
      ],
      where: { primary_sp_id: { _eq: details?.primary_sp?.global_virtual_group_family?.primary_sp.sp_id } },
    },
  ];
  const rp = useGraphqlQuery('ObjectByName', req);
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

  const overview: ObjectDetailsOverviewType = {
    'Object Name': details?.object_name,
    'Object Tags': details?.tags && Object.entries(details?.tags).length.toString(),
    'Object ID': details?.object_id,
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
      tip: 'Could be a temporary account',
    },
    Owner: {
      value: details?.owner,
      status: 'copyLink',
    },
    'Primary SP': {
      value: details?.primary_sp.global_virtual_group_family.primary_sp.moniker,
      status: 'primary',
      link: rp?.data?.global_virtual_groups && rp?.data?.global_virtual_groups[0].virtual_payment_address,
      tip: 'Available for sealed object',
    },
  };
  const secondaryAddresses: Array<string> | undefined = [];
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
  // console.log(tabRequires);

  return (
    <PageNextJs pathname="/object-details/[address]" query={ props.query }>
      <Flex align="center" marginBottom="24px">
        <IconSvg onClick={ routerFallback() } cursor="pointer" w="24px" h="24px" marginRight="4px" name="Fallback"></IconSvg>
        <PageTitle marginBottom="0" title="Object Details" withTextAd/>
        <Tooltip
          isDisabled={ details?.object_name.length <= 60 }
          label={ details?.object_name } padding="8px" placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
          <Box ml="6px" color="rgba(0, 0, 0, 0.4)" fontWeight="400" fontSize="14px">
            { details?.object_name.length > 60 ? formatPubKey(details?.object_name, 0, 60) : details?.object_name }
          </Box>
        </Tooltip>
      </Flex>
      <HeadDetails loading={ loadsing } overview={ overview } more={ more } secondaryAddresses={ secondaryAddresses }/>
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
