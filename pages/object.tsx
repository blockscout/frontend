/* eslint-disable no-console */
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import apolloClient from 'lib/hooks/apolloClient';
import PageTitle from 'ui/shared/Page/PageTitle';

const TableList = dynamic(() => import('ui/storage/table-list'), { ssr: false });
const ObjectDetails: NextPage = () => {
  const queryDate = `
    object: object(limit: $limit, offset: $offset, order_by: { create_at: desc }) {
    id       
    object_name            
    bucket_name       
    owner             
    creator           
    payload_size      
    visibility        
    content_type      
    object_status     
    redundancy_type   
    source_type       
    checksums         
    create_at         
    local_virtual_group_id 
    height                 
    tags                   
    is_updating            
    updated_at             
    updated_by             
    version                
    }`;
  (async() => {
    const buckets = await apolloClient(queryDate, 10, 0);
    console.log(buckets);
  })();
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
