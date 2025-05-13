/* eslint-disable */

import useAccount from 'lib/web3/useAccount';
import { Box, Flex, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import orderBy from 'lodash/orderBy';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import PageNextJs from 'nextjs/PageNextJs';
import { getEnvValue } from 'configs/app/utils';

import TabTable from 'ui/staking/TabTable';
import StakingInfo from 'ui/staking/StakingInfo';
import { useStakeLoginContextValue } from 'lib/contexts/stakeLogin';

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

  const tabThead = [ 'Credential ID', 'Txn hash', 'Block', 'Method', 'From/To', 'Time', 'Value MOCA', 'Fee MOCA' ];

  // const url = getEnvValue('NEXT_PUBLIC_CREDENTIAL_API_HOST');
  const url = "http://192.168.0.97:8080"
  const [ totalIssued, setTotalIssued ] = React.useState<number>(0);
  const [ totalCredential, setTotalCredential ] = React.useState<number>(0);
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const [ nextCursor, setNextCursor ] = React.useState<string>('');
  const [ previousCursor, setpreviousCursor ] = React.useState<string>('');

  const { address } = useAccount();

  const { token } = useStakeLoginContextValue();


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
    }
  }, [ url ]);

  const requestTotal = React.useCallback(async() => {
    try {
      setLoading(true);
      const rp2 = await (await fetch(url + '/api/v1/explorer/totalissuancesinfo', { method: 'get' })).json() as {
        total_credential_number: number; total_issued_number: number;
      };
      setLoading(false);
      setTotalIssued(rp2.total_credential_number);
      setTotalCredential(rp2.total_issued_number);
    } catch (error: any) {
      setLoading(false);
    }
  }, [ url ]);



  const [ stakedAmount, setStakedAmount ] = React.useState<string>('0');
  const [ claimableRewards, setClaimableRewards ] = React.useState<string>('0');
  const [ withdrawingAmount , setWithdrawingAmount ] = React.useState<string>('0');
  const [ totalRewards, setTotalRewards ] = React.useState<string>('0');

  const requestMyStakingInfo = React.useCallback(async() => {
    try {
      setLoading(true);
      const res = await (await fetch(url + '/api/me/staking/summary', { 
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token }`,
          },
        })).json() as  any;
      if(res && res.code === 200) {
        setStakedAmount(res.data.stakedAmount);
        setClaimableRewards(res.data.claimableRewards);
        setWithdrawingAmount(res.data.withdrawingAmount);
        setTotalRewards(res.data.totalRewards);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
    }
  }, [ url ]);


    const requestMyStakingTableList = React.useCallback(async() => {
    try {
      setLoading(true);
      const res = await (await fetch(url + '/api/me/staking/delegations', { 
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ token }`,
          },
        })).json() as  any;
      if(res && res.code === 200) {
        console.log('res', res);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
    }
  }, [ url ]);


    const requestMyActivityTableList = React.useCallback(async({
      limit = 10,
      offset = 0,
      countTotal = false,
      reverse = false,
    }) => {
      try {
        setLoading(true);
        const paramStr = new URLSearchParams({
          limit: limit.toString(),
          offset: offset.toString(),
          countTotal: countTotal.toString(),
          reverse: reverse.toString(),
        }).toString();
        const res = await (await fetch(url + '/api/me/staking/delegations' + '?' + paramStr, {
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${ token }`,
            },
            
          })).json() as  any;
        if(res && res.code === 200) {
          console.log('res', res);
        }
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
      }
    }, [ url ]);


    const handleClaimAll = React.useCallback(async() => {
      try {
        setLoading(true);
        const res = await (await fetch(url + '/api/me/staking/claim', { 
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${ token }`,
            },
          })).json() as  any;
        if(res && res.code === 200) {
          console.log('res', res);
        }
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
      }
    } , [ url ]);

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
      requestMyStakingInfo();
    }
  }, [ requestMyStakingInfo , url ]);

  React.useEffect(() => {
    if (url) {
      requestMyStakingTableList();
    }
  }, [ requestMyStakingTableList , url ]);

  React.useEffect(() => {
    if (url) {
      requestMyActivityTableList({
        limit: 10,
        offset: 0,
        countTotal: true,
        reverse: false,
      });
    }
  }, [ requestMyActivityTableList , url ]);


  return (
    <PageNextJs pathname="/object">
      <StakingInfo
        stakedAmount={ stakedAmount }
        claimableRewards={ claimableRewards }
        withdrawingAmount={ withdrawingAmount }
        totalRewards={ totalRewards }
        handleClaimAll={ handleClaimAll }
      />
      { /* <TableList
        totleDate={ 0 }
        showTotal={ true }
        toNext={ toNext }
        currPage={ queryParams.page }
        propsPage={ propsPage }
        loading={ loading }
        tableList={ tableList }
        tabThead={ tabThead }
        page="Issuance"
        handleSearchChange={ handleSearchChange() }
      /> */ }
      <TabTable />
    </PageNextJs>
  );
};

export default React.memo(ObjectDetails);
