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
      limit: 10,
      offset: 0,
    },
  ];
  const talbeList: Array<GroupTalbeListType> = [];

  const { loading, data, error } = useGraphqlQuery('storage_group', queries);
  data?.groups?.forEach((v: GroupRequestType) => {
    talbeList.push({
      'Group Name': v.group_name,
      'Group ID': v.group_id,
      'Last Updated': v.update_at,
      'Active Group Member Count': v.active_member_count.aggregate.count,
      Owner: v.owner_address,
    });
  });
  const tapList = [ 'objects', 'Transactions', 'Permissions' ];
  const tabThead = [ 'Group Name', 'Group ID', 'Last Updated', 'Active Group Member Count', 'Owner' ];
  return (
    <PageNextJs pathname="/group">
      <PageTitle title="Groups" withTextAd/>
      <TableList error={ error } loading={ loading } tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead }/>
    </PageNextJs>
  );
};

export default Page;
