import { Flex, Box } from '@chakra-ui/react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';

import useGraphqlQuery from 'lib/api/useGraphqlQuery';
import IconSvg from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';
import { timeTool, sizeTool, formatPubKey } from 'ui/storage/utils';

const HeadDetails = dynamic(() => import('ui/storage/head-details'), { ssr: false });
// const TableDetails = dynamic(() => import('ui/storage/table-details'), { ssr: false });

const ObjectDetails: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  // const [ objectAddress, setobjectAddress ] = React.useState<string>('');
  // React.useEffect(() => {
  // }, [ objectAddress ]);
  // const changeTable = React.useCallback((value: string) => {
  //   setobjectAddress(value);
  // }, []);
  const routerFallback = () => () => {
    router.back();
  };

  const queries = [
    {
      tableName: 'buckets',
      fields: [
        'bucket_name',
        'tags',
        'bucket_id',
        `objects {
          object_name
          content_type
          status
          visibility
          update_time
          creator_address
        }`,
        'status',
        'delete_at',
        'update_time',
        'storage_size',
        'charge_size',
        'creator: owner_address',
        'payment_address',
        'global_virtual_group_family_id',
        `global_virtual_group_family {
          global_virtual_group_ids
        }`,
        'removed',
      ],
      limit: 10, // Example: set limit to 10
      offset: 0, // Example: set offset to 0
      // If you need to add where or order conditions, you can do so here
      where: { bucket_name: { _ilike: router.query.address } }, // Example filter condition
      // order: { create_at: "DESC" } // Example order condition
    },
    {
      tableName: 'transaction',
      fields: [
        'gas_used',
        'gas_wanted',
        'logs',
        'memo',
        'raw_log',
        'messages',
        'hash',
      ],
    },
  ];
  const { loading, data } = useGraphqlQuery('Bucket', router.query.address ? queries : []);
  const details = data?.buckets && data?.buckets[0];
  const [ loadsing, setLoadsing ] = React.useState(true);
  React.useEffect(() => {
    if (!loading && Object.keys(data?.buckets || {}).length) {
      setLoadsing(false);
    }
  }, [ data, loading ]);

  const overview = {
    'Bucket Name': details?.bucket_name,
    'Bucket Tags': details?.tags && Object.entries(details?.tags).length.toString(),
    'Bucket ID': details?.bucket_id,
    // 'Bucket No.': details?.bucket_id,
    'Active Objects Count': details?.global_virtual_group_family_id,
    'Bucket Status': details?.status,
    Deleted: details?.removed ? 'Yes' : 'No',
  };
  const more = {
    'Last Updated Time': {
      value: timeTool(details?.update_time.slice(0, 19)),
      status: 'time',
    },
    'Storage Size': {
      value: sizeTool(details?.storage_size),
      status: 'none',
    },
    'Charge Size': {
      value: sizeTool(details?.charge_size),
      status: 'none',
    },
    Creator: {
      value: details?.creator,
      status: 'copyLink',
    },
    'Payment Address': {
      value: details?.payment_address,
      status: 'copyLink',
    },
    'Virtual Group Family ID': {
      titleNmae: 'All GVGs',
      value: 'Click to view all GVGs',
      status: 'clickViewAll',
    },
  };
  const secondaryAddresses = details?.global_virtual_group_family.global_virtual_group_ids.split(',') || [];
  // const tapList = [ 'Transactions', 'Versions' ];
  // const tabThead = [ 'objects name', 'Type', 'Object Size', 'Status', 'Visibility', 'Last Updated Time', 'Creator' ];
  // const talbeList = [
  //   {
  //     'objects name': '4c83feb331594408sdjhfsdk98238293',
  //     Type: 'Created',
  //     'Object Size': '1.41 KB',
  //     Status: 'Sealed',
  //     Visibility: 'Private',
  //     'Last Updated Time': '17h 51m ago',
  //     Creator: '0x5a8819edbc43fb1f51394e3fef35cb28977abd06',
  //     id: '2',
  //   },
  // ];
  // const storageDetails = [
  //   {
  //     name: 'Free Quota (one-time)',
  //     data: '1 GB/1 GB (100%)',
  //   },
  //   {
  //     name: 'Monthly Free Quota (31 Jul, 2024)',
  //     data: '1 GB/1 GB (100%)',
  //   },
  //   {
  //     name: 'Monthly Charged Quota (31 Jul, 2024)',
  //     data: '1 GB/1 GB (100%)',
  //   },
  // ];
  return (
    <PageNextJs pathname="/bucket-details/[address]" query={ props.query }>
      <Flex align="center" marginBottom="24px">
        <IconSvg onClick={ routerFallback() } cursor="pointer" w="24px" h="24px" marginRight="4px" name="Fallback"></IconSvg>
        <PageTitle marginBottom="0" title="Bucket Details" withTextAd/>
        <Box ml="6px" color="rgba(0, 0, 0, 0.4)" fontWeight="400" fontSize="14px">
          { details?.bucket_name.length > 60 ? formatPubKey(details?.bucket_name, 60, 0) : details?.bucket_name }
        </Box>
      </Flex>
      { /* <Flex justifyContent="space-between">
        {
          storageDetails.map((value, index) => (
            <Box
              key={ index }
              w="432px"
              padding="16px"
              border="1px solid rgba(0, 0, 0, 0.06)"
              borderRadius="12px"
              margin="24px"
            >
              <Box fontSize="12px" color="rgba(0, 0, 0, 1)" fontWeight="400">{ value.name }</Box>
              <Box paddingBottom="8px" display="inline-block" fontWeight="700" fontSize="16px" color="#000000" marginTop="8px" borderBottom="4px solid #A07EFF">
                { value.data }
              </Box>
            </Box>
          ))
        }
      </Flex> */ }
      <HeadDetails loading={ loadsing } secondaryAddresses={ secondaryAddresses } overview={ overview } more={ more }/>
      { /* <TableDetails tapList={ tapList } talbeList={ talbeList } tabThead={ tabThead } changeTable={ changeTable }/> */ }
    </PageNextJs>
  );
};

export default React.memo(ObjectDetails);
