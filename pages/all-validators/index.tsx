/* eslint-disable */

import { Box, Flex, Button , Grid, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import orderBy from 'lodash/orderBy';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import PageNextJs from 'nextjs/PageNextJs';
import ValidatorsTable from 'ui/validators/ValidatorsTable';
import { getEnvValue } from 'configs/app/utils';
import WithTipsText from 'ui/validators/WithTipsText';

const TableList = dynamic(() => import('ui/storage/table-list'), { ssr: false });



type RequestType = {
  has_next: boolean;
  has_more: boolean;
  next_cursor: string;
  previous_cursor: string;
  title_data: Array<{
    block_number: number;
    credential_id: string;
    from_address: string;
    to_address: string;
    transaction_status: string;
    tx_fee: string;
    tx_hash: string;
    tx_time: string;
    tx_value: string;
  }>;
};


type IssuanceTalbeListType = {
  'Credential ID': string;
  'Txn hash': string;
  Block: string;
  Method: string;
  'From/To': [ string, string ];
  Time: string;
  'Value MOCA': string;
  'Fee MOCA': string;
};

const ObjectDetails: NextPage = () => {
  const [ queryParams, setQueryParams ] = React.useState<{ offset: number; searchTerm: string; page: number }>({
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

  const [ tableList, setTableList ] = React.useState<Array<IssuanceTalbeListType>>([]);


  const [ isOverviewStatsLoading, setIsOverviewStatsLoading ] = React.useState<boolean>(false);





  // const url = getEnvValue('NEXT_PUBLIC_CREDENTIAL_API_HOST');
  const url = "http://192.168.0.97:8080"
  const [ totalIssued, setTotalIssued ] = React.useState<number>(0);
  const [ totalCredential, setTotalCredential ] = React.useState<number>(0);
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const [ nextCursor, setNextCursor ] = React.useState<string>('');
  const [ previousCursor, setpreviousCursor ] = React.useState<string>('');

  const  [ totalDelegators, setTotalDelegators ] = React.useState<number>(0);
  const  [ totalValidators, setTotalValidators ] = React.useState<number>(0);
  const  [ totalStaked, setTotalStaked ] = React.useState<any>(null);
  const [ totalEpoch, setTotalEpoch ] = React.useState<any>({});


  const [ tableDataList, setTableDataList ] = React.useState<Array<any>>([]);
  const [ isTableLoading, setIsTableLoading ] = React.useState<boolean>(false);

  const handleSearchChange = () => () => {};

  function truncateToSignificantDigits(numberStr: string, significantDigits: number) {
    const num = new BigNumber(numberStr);
    if (num.isZero()) return num;

    const exponent = num.e || 0;

    let decimalPlaces;
    if (num.abs().isLessThan(1)) {
      decimalPlaces = Math.abs(exponent) + significantDigits - 1;
    } else {
      const integerDigits = exponent + 1;
      decimalPlaces = Math.max(significantDigits - integerDigits, 0);
    }

    return num.decimalPlaces(decimalPlaces, BigNumber.ROUND_DOWN);
  }

  const request = React.useCallback(async(hash?: string) => {
    try {
      setLoading(true);
      const rp1 = await (await fetch(url + `/api/v1/explorer/issuancestitle${ hash ? `?cursor=${ hash }` : '' }`,
        { method: 'get' })).json() as RequestType;
      const tableList: Array<IssuanceTalbeListType> = [];
      orderBy(rp1.title_data, [ 'transaction_status' ]).forEach((v: any) => {
        tableList.push({
          'Credential ID': v.credential_id || '/',
          'Txn hash': v.tx_hash,
          Block: v.block_number,
          Method: v.method,
          'From/To': [ v.from_address, v.to_address ],
          Time: v.tx_time,
          'Value MOCA': v.tx_value,
          'Fee MOCA': truncateToSignificantDigits(BigNumber(v.tx_fee / 1e18).toString(10), 3).toString(10),
        });
      });
      setNextCursor(rp1.next_cursor);
      setpreviousCursor(rp1?.previous_cursor || '');
      setToNext(rp1.has_next);
      setTableList(tableList);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      throw Error(error);
    }
  }, [ url ]);



  const requestOverviewStats = React.useCallback(async() => {
    try {
      setIsOverviewStatsLoading(true);
      const res = await (await fetch(url + '/api/network/overview-stats', { method: 'get' })).json() as any
      setIsOverviewStatsLoading(false);
      if(res && res.code === 200) {
        const { 
          delegatorCount,
          validatorCount,
          totalStake,
          epoch,
        } = res.data;
        setTotalDelegators(delegatorCount);
        setTotalValidators(validatorCount);
        setTotalStaked(totalStake);
        setTotalEpoch(epoch || {});
      }
    }
    catch (error: any) {
      setIsOverviewStatsLoading(false);
      throw Error(error);
    }
  }
  , [ url ]);


  const requestTableList = React.useCallback(async() => {
    try {
      setIsTableLoading(true);
      const res = await (await fetch(url + '/api/network/validators/list', { method: 'get' })).json() as any
      setIsTableLoading(false);
      if(res && res.code === 200) {
        setTableDataList(res.data.validators);
      }
    }
    catch (error: any) {
      setIsTableLoading(false);
      throw Error(error);
    }
  }
  , [ url ]);
  
  const propsPage = React.useCallback((value: number) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    if (value > queryParams.page) {
      request(nextCursor);
    } else {
      request(previousCursor);
    }
    updateQueryParams({
      page: value,
    });
  }, [ queryParams.page, request, nextCursor, previousCursor ]);


  React.useEffect(() => {
    if (url) {
      requestOverviewStats();
      requestTableList();
    }
  }, [ url, requestOverviewStats, requestTableList]);

  return (
    <PageNextJs pathname="/object">

      <Flex 
          display={{ base: 'flex-wrap', lg: 'flex' }}
          justifyContent= {{ base: 'space-between' , lg:  'flex-start' }}
          alignItems="center" marginBottom="24px">
          <Text fontSize="24px" fontWeight="600" lineHeight="32px" color="#000">MOCA Staking</Text>

          <Button
              onClick={() => {
                window.open('https://moca.network/staking', '_blank');
              }}
              px = "6px"
              py = "2px"
              width={ 'auto' }
              height={ 'auto' }
              marginLeft={"8px"}
              variant="surface"
              color="#FF57B7"
              borderRadius={9999}
              backgroundColor="#FEE5F4"
            >
              <Text 
                fontSize="12px"
                fontWeight="400"
                lineHeight="140%"
                color="#FF57B7"
                fontFamily="Inter"
              >MOCA Staking</Text>
          </Button>
      </Flex>

      <Grid templateColumns={{ base: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }} marginBottom = {4} rowGap={ 4 } columnGap={ 6 } mb={ 8 }>
        <Box border="solid 1px rgba(0, 0, 0, 0.06)" borderRadius="12px" display="grid" gridGap="8px" padding="16px">
          <WithTipsText
            placement='right'
            label={  <Text
              fontSize="12px"
              display="inline"
              lineHeight="16px"
              fontStyle="normal"
              as={'span'}
              textTransform="capitalize"
              fontFamily="HarmonyOS Sans" fontWeight="400" color="rgba(0, 0, 0, 0.4)">Total Staking</Text> }
            tips={ `Total Amount Staked Across the Blockchain Network` }
          />
          <Text as={'span'}>{ totalStaked || '-' }</Text>
        </Box>
        <Box border="solid 1px rgba(0, 0, 0, 0.06)" borderRadius="12px" display="grid" gridGap="18px" padding="16px">
          <WithTipsText
            placement='right'
            label={ <Text
              fontSize="12px"
              display="inline"
              lineHeight="16px"
              fontStyle="normal"
              as={'span'}
              textTransform="capitalize"
              fontFamily="HarmonyOS Sans" fontWeight="400" color="rgba(0, 0, 0, 0.4)">Epoch</Text> }
            tips={ `A fixed period in PoS blockchains for validator selection, staking, and reward distribution.` }
          />
          <Text as={'span'}>{ totalEpoch.current || '-' }</Text>
        </Box>
        <Box border="solid 1px rgba(0, 0, 0, 0.06)" borderRadius="12px" display="grid" gridGap="8px" padding="16px">
          <WithTipsText
            placement='right'
            label={ <Text
              fontSize="12px"
              display="inline"
              lineHeight="16px"
              fontStyle="normal"
              as={'span'}
              textTransform="capitalize"
              fontFamily="HarmonyOS Sans" fontWeight="400" color="rgba(0, 0, 0, 0.4)">Validators</Text> }
            tips={ `Node operator responsible for verifying transactions, securing the blockchain, and earning staking rewards.` }
          />
          <Text>{ totalValidators || '0' }</Text>
        </Box>
        <Box border="solid 1px rgba(0, 0, 0, 0.06)" borderRadius="12px" display="grid" gridGap="8px" padding="16px">
          <WithTipsText
            placement='right'
            label={ <Text
              fontSize="12px"
              display="inline"
              lineHeight="16px"
              fontStyle="normal"
              as={'span'}
              textTransform="capitalize"
              fontFamily="HarmonyOS Sans" fontWeight="400" color="rgba(0, 0, 0, 0.4)">Delegators</Text> }
            tips={ `Individual who stakes their tokens with a validator, earning rewards without running a node directly.` }
          />
          <Text as={'span'}>{ totalDelegators || '0' }</Text>
        </Box>
      </Grid>

      {/* <InfoBox /> */}

      {/* <TabChart /> */}

      <ValidatorsTable 
        data={ tableDataList }
        isLoading={ isTableLoading }
        onPageChange={ propsPage }
        onPageSizeChange={ (pageSize: number) => {
          updateQueryParams({ offset: 0, page: 1 });
        } }
        onSortChange={ (sortBy: string, sortOrder: string) => {
          updateQueryParams({ offset: 0, page: 1 });
        } }
      />
    </PageNextJs>
  );
};

export default React.memo(ObjectDetails);
