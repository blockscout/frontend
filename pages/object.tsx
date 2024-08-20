/* eslint-disable no-console */
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { ObjetTalbeListType, ObjetRequestType } from 'types/storage';

import PageNextJs from 'nextjs/PageNextJs';

import useGraphqlQuery from 'lib/api/useGraphqlQuery';
import PageTitle from 'ui/shared/Page/PageTitle';

const TableList = dynamic(() => import('ui/storage/table-list'), { ssr: false });
const ObjectDetails: NextPage = () => {

  const queries = [
    {
      tableName: 'object',
      fields: [
        'object_name',
        'content_type',
        'payload_size',
        'status',
        'visibility',
        'update_time',
        'bucket_name',
        'creator_address',
        'id',
      ],
      limit: 10, // Example: set limit to 10
      offset: 0, // Example: set offset to 0
      // If you need to add where or order conditions, you can do so here
      // where: { id: { _eq: 8 } }, // Example filter condition
      // order: { create_at: "DESC" }  // Example order condition
    },
  ];
  const [ talbeList, setTalbeList ] = React.useState<Array<ObjetTalbeListType>>([]);

  // for (let index = 0; index < 1; index++) {
  //   talbeList.push({
  //     'Object Name': 'asdasd',
  //     Creator: 'asdasd',
  //     Type: 'asdasd',
  //     'Object Size': 'asdasd',
  //     Status: 'v.object_status',
  //     Visibility: 'v.visibility',
  //     'Last Updated Time': 'v.updated_at',
  //     Bucket: 'v.bucket_name',
  //     id: 'v.id',
  //   });
  // }

  const { loading, data } = useGraphqlQuery('Objects', queries);
  const [ skeLoading, setSkeLoading ] = React.useState<boolean>(true);
  setTimeout(() => {
    setTalbeList([]);
    if (!loading) {
      setSkeLoading(false);
      data?.object?.forEach((v: ObjetRequestType) => {
        talbeList.push({
          'Object Name': v.object_name,
          Type: v.content_type,
          'Object Size': v.payload_size + 'KB',
          Status: v.object_status,
          Visibility: v.visibility,
          'Last Updated Time': v.updated_at,
          Bucket: v.bucket_name,
          Creator: v.creator,
          id: v.id,
        });
      });
    }
  }, 3000);

  const tapList = [ 'Transactions', 'Versions' ];

  const tabThead = [ 'Object Name', 'Type', 'Object Size', 'Status', 'Visibility', 'Last Updated Time', 'Bucket', 'Creator' ];
  return (
    <PageNextJs pathname="/object">
      <PageTitle title="Objects" withTextAd/>
      <TableList loading={ skeLoading } tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead }/>
    </PageNextJs>
  );
};

export default React.memo(ObjectDetails);
