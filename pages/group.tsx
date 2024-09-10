import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { GroupTalbeListType, GroupRequestType } from 'types/storage';

import PageNextJs from 'nextjs/PageNextJs';

import useGraphqlQuery from 'lib/api/useGraphqlQuery';
import useDebounce from 'lib/hooks/useDebounce';
import PageTitle from 'ui/shared/Page/PageTitle';

const TableList = dynamic(() => import('ui/storage/table-list'), { ssr: false });

const Page: NextPage = () => {
  const [ searchTerm, setSearchTerm ] = React.useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [ page, setPage ] = React.useState<number>(1);
  const [ offset, setOffset ] = React.useState<number>(0);
  const [ toNext, setToNext ] = React.useState<boolean>(true);
  React.useEffect(() => {
    if (page > 1) {
      setOffset((page - 1) * 10);
    } else {
      setOffset(0);
    }
  }, [ page, offset ]);
  const propsPage = React.useCallback((value: number) => {
    setPage(value);
  }, [ setPage ]);

  const queries = [
    {
      tableName: 'groups',
      fields: [
        'group_name',
        'group_id',
        'update_at',
        `active_member_count: group_members_aggregate {
          aggregate {
            count
          }
        }`,
        'owner_address',
      ],
      limit: 21,
      offset: offset,
      where: debouncedSearchTerm ? {
        _or: [
          { group_name: { _ilike: `${ debouncedSearchTerm }%` } },
          { group_id: { _eq: debouncedSearchTerm } },
        ],
      } : undefined,
      order: { group_id: 'desc' },
    },
  ];
  const tableList: Array<GroupTalbeListType> = [];

  const { loading, data, error } = useGraphqlQuery('storage_group', queries);
  const tableLength = data?.buckets?.length || 0;
  data?.groups?.forEach((v: GroupRequestType) => {
    tableList.push({
      'Group Name': v.group_name,
      'Group ID': v.group_id,
      'Last Updated': v.update_at,
      'Active Group Member Count': v.active_member_count.aggregate.count,
      Owner: v.owner_address,
    });
  });

  React.useEffect(() => {
    if (typeof tableLength === 'number' && tableLength >= 21) {
      setToNext(false);
    } else {
      setToNext(true);
    }
  }, [ tableLength ]);
  const tapList = [ 'objects', 'Transactions', 'Permissions' ];
  const tabThead = [ 'Group Name', 'Group ID', 'Last Updated', 'Active Group Member Count', 'Owner' ];

  const handleSearchChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  return (
    <PageNextJs pathname="/group">
      <PageTitle title="Groups" withTextAd/>
      <TableList
        toNext={ toNext }
        currPage={ page }
        propsPage={ propsPage }
        error={ error }
        loading={ loading }
        tapList={ tapList }
        tableList={ tableList }
        tabThead={ tabThead }
        page="group"
        handleSearchChange={ handleSearchChange }/>
    </PageNextJs>
  );
};

export default Page;
