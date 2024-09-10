import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { BucketTalbeListType, BucketRequestType } from 'types/storage';

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
      ],
      limit: 21,
      offset: offset,
      where: debouncedSearchTerm ? {
        _or: [
          { bucket_name: { _ilike: `${ debouncedSearchTerm }%` } },
          { bucket_id: { _eq: debouncedSearchTerm } },
        ],
      } : undefined,
      order: { update_time: 'desc' },
    },
  ];
  const tableList: Array<BucketTalbeListType> = [];

  const { loading, data, error } = useGraphqlQuery('Buckets', queries);
  const tableLength = data?.buckets?.length || 0;
  data?.buckets?.forEach((v: BucketRequestType, index: number) => {
    if (index <= 20) {
      tableList.push({
        'Bucket Name': v.bucket_name,
        'Bucket ID': v.bucket_id,
        'Last Updated Time': v.update_time,
        Status: v.status,
        'Active Objects Count': v.active_object_count.aggregate.count,
        Creator: v.owner_address,
      });
    }
  });
  React.useEffect(() => {
    if (typeof tableLength === 'number' && tableLength !== 21) {
      setToNext(false);
    } else {
      setToNext(true);
    }
  }, [ tableLength ]);

  const tapList = [ 'Transactions', 'Versions' ];
  const tabThead = [ 'Bucket Name', 'Bucket ID', 'Last Updated Time', 'Status', 'Active Objects Count', 'Creator' ];

  const handleSearchChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  return (
    <PageNextJs pathname="/bucket">
      <PageTitle title="Buckets" withTextAd/>
      <TableList
        toNext={ toNext }
        currPage={ page }
        propsPage={ propsPage }
        error={ error }
        loading={ loading }
        tapList={ tapList }
        tableList={ tableList }
        tabThead={ tabThead }
        page="bucket"
        handleSearchChange={ handleSearchChange }/>
    </PageNextJs>
  );
};

export default Page;
