import { debounce, orderBy } from 'lodash';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { ObjetTalbeListType, ObjetRequestType } from 'types/storage';

import PageNextJs from 'nextjs/PageNextJs';

import useGraphqlQuery from 'lib/api/useGraphqlQuery';
import PageTitle from 'ui/shared/Page/PageTitle';
import { sizeTool } from 'ui/storage/utils';

const TableList = dynamic(() => import('ui/storage/table-list'), { ssr: false });
const ObjectDetails: NextPage = () => {
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
      tableName: 'objects',
      fields: [
        'object_name',
        'content_type',
        'payload_size',
        'status',
        'visibility',
        'update_time',
        'bucket_name',
        'creator_address',
      ],
      where: {
        removed: { _eq: false },
      },
      order: { update_time: 'desc' },
      limit: 21,
      offset: 0,
      distinctOn: 'object_id',
    },
    {
      tableName: 'objects_aggregate',
      where: {
        removed: { _eq: false },
      },
      distinctOn: 'object_id',
      aggregate: [
        'count',
      ],
    },
  ]);

  React.useEffect(() => {
    setQueries([
      {
        tableName: 'objects',
        fields: [
          'object_name',
          'content_type',
          'payload_size',
          'status',
          'visibility',
          'update_time',
          'bucket_name',
          'creator_address',
        ],
        where: queryParams.searchTerm ? {
          _or: [
            { object_name: { _ilike: `${ queryParams.searchTerm }%` } },
            { object_id: { _eq: queryParams.searchTerm } },
          ],
          _and: [
            { removed: { _eq: false } },
          ],
        } : { removed: { _eq: false } },
        // order: { update_time: 'desc' },
        limit: 21,
        offset: queryParams.offset,
        distinctOn: 'object_id',
      },
      {
        tableName: 'objects_aggregate',
        where: queryParams.searchTerm ? {
          _or: [
            { object_name: { _ilike: `${ queryParams.searchTerm }%` } },
            { object_id: { _eq: queryParams.searchTerm } },
          ],
          _and: [
            { removed: { _eq: false } },
          ],
        } : { removed: { _eq: false } },
        distinctOn: 'object_id',
        aggregate: [
          'count',
        ],
      },
    ]);
  }, [ queryParams ]);

  const tableList: Array<ObjetTalbeListType> = [];
  const { loading, data, error } = useGraphqlQuery('Objects', queries);
  const tableLength = data?.objects?.length || 0;
  const totleDate = data?.objects_aggregate?.aggregate?.count || 0;
  data?.objects?.slice(0, 20).forEach((v: ObjetRequestType) => {
    tableList.push({
      'Object Name': v.object_name,
      Type: v.content_type,
      'Object Size': sizeTool(v.payload_size),
      Status: v.status,
      Visibility: v.visibility,
      'Last Updated Time': v.update_time,
      Bucket: v.bucket_name,
      Creator: v.creator_address,
    });
  });
  React.useEffect(() => {
    if (typeof tableLength === 'number' && tableLength !== 21) {
      setToNext(false);
    } else {
      setToNext(true);
    }
  }, [ tableLength ]);

  const tabThead = [ 'Object Name', 'Type', 'Object Size', 'Status', 'Visibility', 'Last Updated Time', 'Bucket', 'Creator' ];

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
    <PageNextJs pathname="/object">
      <PageTitle title="Objects" withTextAd/>
      <TableList
        totleDate={ totleDate }
        toNext={ toNext }
        currPage={ queryParams.page }
        propsPage={ propsPage }
        error={ error }
        loading={ loading }
        tableList={ orderBy(tableList, [ 'update_time' ], [ 'desc' ]) }
        tabThead={ tabThead }
        page="object"
        handleSearchChange={ handleSearchChange }
      />
    </PageNextJs>
  );
};

export default React.memo(ObjectDetails);
