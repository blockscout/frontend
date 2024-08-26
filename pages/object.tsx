/* eslint-disable no-console */
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { ObjetTalbeListType, ObjetRequestType } from 'types/storage';

import PageNextJs from 'nextjs/PageNextJs';

import useGraphqlQuery from 'lib/api/useGraphqlQuery';
import useDebounce from 'lib/hooks/useDebounce';
import PageTitle from 'ui/shared/Page/PageTitle';
import { sizeTool } from 'ui/storage/utils';

const TableList = dynamic(() => import('ui/storage/table-list'), { ssr: false });
const ObjectDetails: NextPage = () => {
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
      where: debouncedSearchTerm ? {
        _or: [
          { object_name: { _ilike: `${ debouncedSearchTerm }%` } },
          { object_id: { _eq: debouncedSearchTerm } },
        ],
      } : undefined,
      limit: 11,
      offset: offset,
    },
  ];
  // const [ talbeList ] = React.useState<Array<ObjetTalbeListType>>([]);
  const talbeList: Array<ObjetTalbeListType> = [];

  const { loading, data, error } = useGraphqlQuery('Objects', queries);
  const tableLength = data?.objects?.length || 0;
  data?.objects?.forEach((v: ObjetRequestType, i: number) => {
    if (i < 10) {
      talbeList.push({
        'Object Name': v.object_name,
        Type: v.content_type,
        'Object Size': sizeTool(v.payload_size),
        Status: v.status,
        Visibility: v.visibility,
        'Last Updated Time': v.update_time,
        Bucket: v.bucket_name,
        Creator: v.creator_address,
      });
    }
  });
  React.useEffect(() => {
    if (typeof tableLength === 'number' && tableLength !== 11) {
      setToNext(false);
    } else {
      setToNext(true);
    }
  }, [ tableLength ]);

  const tapList = [ 'Transactions', 'Versions' ];

  const tabThead = [ 'Object Name', 'Type', 'Object Size', 'Status', 'Visibility', 'Last Updated Time', 'Bucket', 'Creator' ];

  const handleSearchChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  return (
    <PageNextJs pathname="/object">
      <PageTitle title="Objects" withTextAd/>
      <TableList
        toNext={ toNext }
        currPage={ page }
        propsPage={ propsPage }
        error={ error }
        loading={ loading }
        tapList={ tapList }
        talbeList={ talbeList }
        tabThead={ tabThead }
        page="object"
        handleSearchChange={ handleSearchChange }
      />
    </PageNextJs>
  );
};

export default React.memo(ObjectDetails);
