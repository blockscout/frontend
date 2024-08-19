import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { GroupTalbeListType, GroupRequestType } from 'types/storage';

import PageNextJs from 'nextjs/PageNextJs';

import useGraphqlQuery from 'lib/api/useGraphqlQuery';
import PageTitle from 'ui/shared/Page/PageTitle';

const TableList = dynamic(() => import('ui/storage/table-list'), { ssr: false });

const Page: NextPage = () => {

  const queries = [
    {
      tableName: 'storage_group',
      fields: [
        'id',
        'group_name',
        'owner',
        'source_type',
        'height',
      ],
      limit: 10, // Example: set limit to 10
      offset: 0, // Example: set offset to 0
      // If you need to add where or order conditions, you can do so here
      // where: { id: 8 }, // Example filter condition
      // order: { create_at: "DESC" }  // Example order condition
    },
  ];
  const talbeList: Array<GroupTalbeListType> = [];

  const { data } = useGraphqlQuery('storage_group', queries);
  data?.storage_group?.forEach((v: GroupRequestType) => {
    talbeList.push({
      'Group Name': v.group_name,
      'Group ID': v.id,
      'Last Updated': v.height,
      'Active Group Member Count': v.source_type,
      Owner: v.owner,
    });
  });
  const tapList = [ 'objects', 'Transactions', 'Permissions' ];
  const tabThead = [ 'Group Name', 'Group ID', 'Last Updated', 'Active Group Member Count', 'Owner' ];
  return (
    <PageNextJs pathname="/group">
      <PageTitle title="Groups" withTextAd/>
      <TableList tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead }/>
    </PageNextJs>
  );
};

export default Page;
