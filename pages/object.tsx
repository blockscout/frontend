/* eslint-disable no-console */
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import useGraphqlQuery from 'lib/api/useGraphqlQuery';
import PageTitle from 'ui/shared/Page/PageTitle';

const TableList = dynamic(() => import('ui/storage/table-list'), { ssr: false });
const ObjectDetails: NextPage = () => {

  const queries = [
    {
      tableName: 'object',
      fields: [
        'bucket_name',
        'checksums',
        'content_type',
        'create_at',
        'creator',
        'height',
        'id',
        'is_updating',
        'local_virtual_group_id',
        'object_name',
        'object_status',
        'owner',
        'payload_size',
        'redundancy_type',
        'source_type',
        'tags',
        'updated_at',
        'updated_by',
        'version',
        'visibility',
      ],
      limit: 10, // Example: set limit to 10
      offset: 0, // Example: set offset to 0
      // If you need to add where or order conditions, you can do so here
      // where: { object_status: "active" },  // Example filter condition
      // order: { create_at: "DESC" }  // Example order condition
    },
  ];

  const { data } = useGraphqlQuery('Objects', queries);
  console.log(data);

  const talbeList = [
    {
      'Object Name': '4c83feb331594408sdjhfsdk98238293',
      Type: 'Seal Object',
      'Object Size': '40 B',
      Status: 'Created',
      Visibility: 'unSpecified',
      'Last Updated Time': new Date().toString(),
      Bucket: 'xxxxx-xxxxx',
      Creator: '0x23c845626A460012EAa27842dd5d24b465B356E7',
    },
  ];

  const tapList = [ 'Transactions', 'Versions' ];

  const tabThead = [ 'Object Name', 'Type', 'Object Size', 'Status', 'Visibility', 'Last Updated Time', 'Bucket', 'Creator' ];
  return (
    <PageNextJs pathname="/object">
      <PageTitle title="Objects" withTextAd/>
      <TableList tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead }/>
    </PageNextJs>
  );
};

export default React.memo(ObjectDetails);
