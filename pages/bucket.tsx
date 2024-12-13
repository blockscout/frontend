import { debounce, orderBy } from 'lodash';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { BucketTalbeListType, BucketRequestType } from 'types/storage';

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

  const [ queries, setQueries ] = React.useState<Array<any>>([ {
    tableName: 'buckets',
    fields: [
      'bucket_name',
      'bucket_id',
      'update_time',
      'status',
      `active_object_count: objects_aggregate {
        aggregate {
          count
        }
      }`,
      'owner_address',
      'removed',
    ],
    where: {
      removed: { _eq: false },
    },
    limit: 21,
    offset: 0,
    distinctOn: 'bucket_id',
    // order: { update_time: 'desc' },
  },
  {
    tableName: 'buckets_aggregate',
    where: {
      removed: { _eq: false },
    },
    aggregate: [
      'count',
    ],
  } ]);

  React.useEffect(() => {
    setQueries([
      {
        tableName: 'buckets',
        fields: [
          'bucket_name',
          'bucket_id',
          'update_time',
          'status',
          {
            field: 'active_object_count: objects_aggregate',
            where: { removed: { _eq: false } },
            subfields: [ 'aggregate { count }' ],
          },
          'owner_address',
        ],
        limit: 21,
        offset: queryParams.offset,
        distinctOn: 'bucket_id',
        where: queryParams.searchTerm ? {
          _or: [
            { bucket_name: { _ilike: `${ queryParams.searchTerm }%` } },
            { bucket_id: { _eq: queryParams.searchTerm } },
          ],
          _and: [
            { removed: { _eq: false } },
          ],
        } : { removed: { _eq: false } },
        // order: { update_time: 'desc' },
        order: { bucket_id: 'desc' },
      },
      {
        tableName: 'buckets_aggregate',
        where: queryParams.searchTerm ? {
          _or: [
            { bucket_name: { _ilike: `${ queryParams.searchTerm }%` } },
            { bucket_id: { _eq: queryParams.searchTerm } },
          ],
          _and: [
            { removed: { _eq: false } },
          ],
        } : { removed: { _eq: false } },
        distinctOn: 'bucket_id',
        aggregate: [
          'count',
        ],
      },
    ]);
  }, [ queryParams ]);

  const tableList: Array<BucketTalbeListType> = [];

  const { loading, data, error } = useGraphqlQuery('Buckets', queries);
  const tableLength = data?.buckets?.length || 0;
  const totleDate = data?.buckets_aggregate?.aggregate?.count || 0;

  orderBy(data?.buckets?.slice(0, 20), [ 'update_time' ], [ 'desc' ]).forEach((v: BucketRequestType) => {
    tableList.push({
      'Bucket Name': v.bucket_name,
      'Bucket ID': v.bucket_id,
      'Last Updated Time': v.update_time,
      Status: v.status,
      'Active Objects Count': v.active_object_count.aggregate.count,
      Creator: v.owner_address,
    });
  });
  React.useEffect(() => {
    if (typeof tableLength === 'number' && tableLength !== 21) {
      setToNext(false);
    } else {
      setToNext(true);
    }
  }, [ tableLength ]);

  const tabThead = [ 'Bucket Name', 'Bucket ID', 'Last Updated Time', 'Status', 'Active Objects Count', 'Creator' ];

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
    <PageNextJs pathname="/bucket">
      <PageTitle title="Buckets" withTextAd/>
      <TableList
        totleDate={ totleDate }
        toNext={ toNext }
        currPage={ queryParams.page }
        propsPage={ propsPage }
        error={ error }
        loading={ loading }
        tableList={ orderBy(tableList, [ 'update_time' ], [ 'desc' ]) }
        tabThead={ tabThead }
        page="bucket"
        handleSearchChange={ handleSearchChange }/>
    </PageNextJs>
  );
};

export default Page;
