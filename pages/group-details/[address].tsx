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
import { formatPubKey } from 'ui/storage/utils';

const HeadDetails = dynamic(() => import('ui/storage/head-details'), { ssr: false });

const ObjectDetails: NextPage<Props> = (props: Props) => {
  const router = useRouter();
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
    'Group ID': details?.group_id,
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
      value: details?.members[0]?.member || '0',
      status: 'none',
    },
    Owner: {
      value: details?.owner_address,
      status: 'copyLink',
    },
  };
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
  const tabRequires = Requires(tabName, 1, 2);
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
    <PageNextJs pathname="/group-details/[address]" query={ props.query }>
      <Flex align="center" marginBottom="24px">
        <IconSvg onClick={ routerFallback() } cursor="pointer" w="24px" h="24px" marginRight="4px" name="Fallback"></IconSvg>
        <PageTitle marginBottom="0" title="Group Details" withTextAd/>
        <Tooltip
          isDisabled={ details?.group_name.length <= 60 }
          label={ details?.group_name } padding="8px" placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
          <Box ml="6px" color="rgba(0, 0, 0, 0.4)" fontWeight="400" fontSize="14px">
            { details?.group_name.length > 60 ? formatPubKey(details?.group_name, 0, 60) : details?.group_name }
          </Box>
        </Tooltip>
      </Flex>
      <HeadDetails loading={ loadsing } overview={ overview } more={ more }/>
      <Box display="none">
        <TableDetails
          changeTable={ changeTable }
          tabsList={ tabsList }
          tableList={ tableList }
          toNext={ toNext }
          currPage={ queryParams.page }
          propsPage={ propsPage }
        >
        </TableDetails>
      </Box>
    </PageNextJs>
  );
};

export default React.memo(ObjectDetails);
