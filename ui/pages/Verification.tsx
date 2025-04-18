/* eslint-disable @typescript-eslint/no-explicit-any */

import { Box, Flex, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import orderBy from 'lodash/orderBy';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import { getEnvValue } from 'configs/app/utils';

const TableList = dynamic(() => import('ui/storage/table-list'), { ssr: false });
type RequestType = {
  has_next: boolean;
  has_more: boolean;
  next_cursor: string;
  previous_cursor?: string;
  title_data: Array<{
    block_number: number;
    scheme_id: Array<string>;
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
  'Schema ID': string;
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

  const tabThead = [ 'Schema ID', 'Txn hash', 'Block', 'Method', 'From/To', 'Time', 'Value MOCA', 'Fee MOCA' ];
  const url = getEnvValue('NEXT_PUBLIC_CREDENTIAL_API_HOST');
  const [ totalIssued, setTotalIssued ] = React.useState<number>(0);
  const [ totalCredential, setTotalCredential ] = React.useState<number>(0);
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const [ nextCursor, setNextCursor ] = React.useState<string>('');
  const [ previousCursor, setpreviousCursor ] = React.useState<string>('');

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
      const rp1 = await (await fetch(url + `/api/v1/explorer/verificationstitle${ hash ? `?cursor=${ hash }` : '' }`, { method: 'get' })).json() as RequestType;
      const tableList: Array<IssuanceTalbeListType> = [];
      orderBy(rp1.title_data, [ 'transaction_status' ]).forEach((v: any) => {
        tableList.push({
          'Schema ID': v.scheme_id[0] || '/',
          'Txn hash': v.tx_hash,
          Block: v.block_number,
          Method: v.method,
          'From/To': [ v.from_address, v.to_address ],
          Time: v.tx_time.slice(0, -1),
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

  const requestTotal = React.useCallback(async() => {
    try {
      setLoading(true);
      const rp2 = await (await fetch(url + '/api/v1/explorer/totalverificationsinfo', { method: 'get' })).json() as {
        total_verified_number: number; total_verified_scheme: number;
      };
      setLoading(false);
      setTotalIssued(rp2.total_verified_number);
      setTotalCredential(rp2.total_verified_scheme);
    } catch (error: any) {
      setLoading(false);
      throw Error(error);
    }
  }, [ url ]);

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
      request();
      requestTotal();
    }
  }, [ requestTotal, request, url ]);

  return (
    <PageNextJs pathname="/object">
      <Flex justifyContent="space-between" textAlign="left" margin="24px 0">
        <Box width="48%" border="solid 1px rgba(0, 0, 0, 0.06)" borderRadius="12px" display="grid" gridGap="8px" padding="16px">
          <Text>Total Verified Number</Text>
          <Text>{ Number(new Intl.NumberFormat('en-US').format(totalIssued)) || '-' }</Text>
        </Box>
        <Box width="48%" border="solid 1px rgba(0, 0, 0, 0.06)" borderRadius="12px" display="grid" gridGap="18px" padding="16px">
          <Text>Total Verified Schema</Text>
          <Text>{ Number(new Intl.NumberFormat('en-US').format(totalCredential)) || '-' }</Text>
        </Box>
      </Flex>
      <TableList
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
      />
    </PageNextJs>
  );
};

export default React.memo(ObjectDetails);
