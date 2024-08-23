import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { BucketTalbeListType, BucketRequestType } from 'types/storage';

import PageNextJs from 'nextjs/PageNextJs';

import useGraphqlQuery from 'lib/api/useGraphqlQuery';
import useDebounce from 'lib/hooks/useDebounce';
import PageTitle from 'ui/shared/Page/PageTitle';
import { timeTool } from 'ui/storage/utils';
const TableList = dynamic(() => import('ui/storage/table-list'), { ssr: false });
const Page: NextPage = () => {
  const [ searchTerm, setSearchTerm ] = React.useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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
      limit: 10,
      offset: 0,
      where: debouncedSearchTerm ? {
        _or: [
          { bucket_name: { _ilike: `${ debouncedSearchTerm }%` } },
          { bucket_id: { _eq: debouncedSearchTerm } },
        ],
      } : undefined,
    },
  ];
  const talbeList: Array<BucketTalbeListType> = [];

  const { loading, data, error } = useGraphqlQuery('Buckets', queries);
  data?.buckets?.forEach((v: BucketRequestType) => {
    talbeList.push({
      'Bucket Name': v.bucket_name,
      'Bucket ID': v.bucket_id,
      'Last Updated Time': timeTool(v.update_time),
      Status: v.status,
      'Active Objects Count': v.active_object_count.aggregate.count,
      Creator: v.owner_address,
    });
  });
  const tapList = [ 'Transactions', 'Versions' ];
  const tabThead = [ 'Bucket Name', 'Bucket ID', 'Last Updated Time', 'Status', 'Active Objects Count', 'Creator' ];

  const handleSearchChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  return (
    <PageNextJs pathname="/bucket">
      <PageTitle title="Buckets" withTextAd/>
      <TableList
        error={ error }
        loading={ loading }
        tapList={ tapList }
        talbeList={ talbeList }
        tabThead={ tabThead } page="bucket"
        handleSearchChange={ handleSearchChange }/>
    </PageNextJs>
  );
};

export default Page;
