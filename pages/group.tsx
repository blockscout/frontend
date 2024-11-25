import { debounce } from 'lodash';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { GroupTalbeListType, GroupRequestType } from 'types/storage';

import PageNextJs from 'nextjs/PageNextJs';

import useGraphqlQuery from 'lib/api/useGraphqlQuery';
import PageTitle from 'ui/shared/Page/PageTitle';

const TableList = dynamic(() => import('ui/storage/table-list'), { ssr: false });

const Page: NextPage = () => {
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

  const [ queries, setQueries ] = React.useState<Array<any>>([
    {
      tableName: 'groups',
      fields: [
        'group_name',
        'group_id',
        'update_at',
        // `active_member_count: group_members_aggregate {
        //   aggregate {
        //     count
        //   }
        // }`,
        'owner_address',
      ],
      where: {
        removed: { _eq: false },
      },
      limit: 21,
      offset: 0,
      order: { update_at: 'desc' },
    },
    {
      tableName: 'groups_aggregate',
      where: {
        removed: { _eq: false },
      },
      aggregate: [
        'count',
      ],
    },
  ]);

  React.useEffect(() => {
    setQueries([
      {
        tableName: 'groups',
        fields: [
          'group_name',
          'group_id',
          'update_at',
          // `active_member_count: group_members_aggregate {
          //   aggregate {
          //     count
          //   }
          // }`,
          'owner_address',
        ],
        limit: 21,
        offset: queryParams.offset,
        where: queryParams.searchTerm ? {
          _or: [
            { group_name: { _ilike: `${ queryParams.searchTerm }%` } },
            { group_id: { _eq: queryParams.searchTerm } },
          ],
          _and: [
            { removed: { _eq: false } },
          ],
        } : { removed: { _eq: false } },
        order: { update_at: 'desc' },
      },
      {
        tableName: 'groups_aggregate',
        where: queryParams.searchTerm ? {
          _or: [
            { group_name: { _ilike: `${ queryParams.searchTerm }%` } },
            { group_id: { _eq: queryParams.searchTerm } },
          ],
          _and: [
            { removed: { _eq: false } },
          ],
        } : { removed: { _eq: false } },
        aggregate: [
          'count',
        ],
      },
    ]);
  }, [ queryParams ]);

  const tableList: Array<GroupTalbeListType> = [];

  const { loading, data, error } = useGraphqlQuery('storage_group', queries);
  const tableLength = data?.groups?.length || 0;
  const totleDate = data?.groups_aggregate?.aggregate?.count || 0;

  data?.groups?.slice(0, 20).forEach((v: GroupRequestType) => {
    tableList.push({
      'Group Name': v.group_name,
      'Group ID': v.group_id,
      'Last Updated': v.update_at,
      'Active Group Member Count': '0',
      Owner: v.owner_address,
    });
  });

  React.useEffect(() => {
    if (typeof tableLength === 'number' && tableLength !== 21) {
      setToNext(false);
    } else {
      setToNext(true);
    }
  }, [ tableLength ]);
  const tabThead = [ 'Group Name', 'Group ID', 'Last Updated', 'Active Group Member Count', 'Owner' ];

  const debouncedHandleSearchChange = React.useMemo(
    () => debounce((event: React.ChangeEvent<HTMLInputElement> | null) => {
      if (!event) {
        updateQueryParams({
          searchTerm: '',
          offset: 0,
          page: 1,
        });
      } else {
        updateQueryParams({
          searchTerm: event.target.value,
          page: 1,
          offset: 0,
        });
      }
    }, 300), // Adjust the debounce delay as needed (300ms in this case)
    [], // Dependencies array is empty because the debounce function itself is memoized
  );

  const handleSearchChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement> | null) => {
    debouncedHandleSearchChange(event);
  }, [ debouncedHandleSearchChange ]);

  return (
    <PageNextJs pathname="/group">
      <PageTitle title="Groups" withTextAd/>
      <TableList
        totleDate={ totleDate }
        toNext={ toNext }
        currPage={ queryParams.page }
        propsPage={ propsPage }
        error={ error }
        loading={ loading }
        tableList={ tableList }
        tabThead={ tabThead }
        page="group"
        handleSearchChange={ handleSearchChange }/>
    </PageNextJs>
  );
};

export default Page;
