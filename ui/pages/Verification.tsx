/* eslint-disable @typescript-eslint/no-explicit-any */

import BigNumber from 'bignumber.js';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import { verificationRequest, transactionsRequest } from 'ui/verification/verificationRequest';

const TableList = dynamic(() => import('ui/storage/table-list'), { ssr: false });

type IssuanceTalbeListType = {
  'Txn hash': string;
  Block: string;
  Method: string;
  'From/To': [ string, string ];
  Time: string;
  'Value MOCA': string;
  'Fee MOCA': string;
};

type LogsRequestParams = {
  items: Array<{
    block_hash: string;
    block_number: number;
    data: string;
    index: number;
    items_count: number;
    decoded: {
      method_call: string;
    };
    smart_contract: {
      hash: string;
    };
    transaction_hash: string;
  }>;
  next_page_params: {
    index: number;
    items_count: number;
    block_number: number;
  };
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

  // const [ allList, setAllList ] = React.useState<Array<any>>([]);

  const [ tableList, setTableList ] = React.useState<Array<IssuanceTalbeListType>>([]);

  const tabThead = [ 'Txn hash', 'Block', 'Method', 'From/To', 'Time', 'Value MOCA', 'Fee MOCA' ];

  const [ loading, setLoading ] = React.useState<boolean>(false);
  const [ map, setMap ] = React.useState<Map<string, any>>(new Map());
  const setMapValue = React.useCallback((key: string, value: any) => {
    setMap(prevMap => {
      prevMap.set(key, value);
      return prevMap;
    });
  }, [ ]);
  const [ transactionsAllList, setTransactionsAllList ] = React.useState<Map<string, any>>(new Map());
  const setTransactionsAllListValue = React.useCallback((address: string, list: Array<IssuanceTalbeListType>) => {
    setTransactionsAllList(prevList => {
      prevList.set(address, list);
      return prevList;
    });
  }, [ ]);

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
  const [ once, setOnce ] = React.useState(false);

  const getTransactions = React.useCallback(async(address: string, arr: Array<any>) => {
    const page = transactionsAllList.get(address)?.next_page_params;
    let rp2 = null;
    if (page) {
      rp2 = await transactionsRequest(address, page.index.toString()) as LogsRequestParams;
    } else {
      rp2 = await transactionsRequest(address) as LogsRequestParams;
    }
    setTransactionsAllListValue(address, rp2.next_page_params as any);
    const newItems = arr.concat(rp2.items);
    return newItems;
  }, [ transactionsAllList, setTransactionsAllListValue ]);

  const pushTableList = React.useCallback(async(params: LogsRequestParams, arr: Array<any>) => {
    if (!arr.length) return;
    const tableList: Array<IssuanceTalbeListType> = [];
    params.items.forEach((v: any) => {
      const item = arr.find((v2: any) => v2.hash === v.transaction_hash);
      if (item) {
        tableList.push({
          'Txn hash': v.transaction_hash,
          Block: v.block_number,
          Method: v.decoded.method_call.split('(')[0],
          'From/To': [ item.from.hash, v.smart_contract.hash ],
          Time: new Date(item.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour12: false }),
          'Value MOCA': item.value,
          'Fee MOCA': truncateToSignificantDigits(BigNumber(item.base_fee_per_gas / 1e18).toString(10), 3).toString(10),
        });
      } else {
        tableList.push({
          'Txn hash': v.transaction_hash,
          Block: v.block_number,
          Method: v.decoded.method_call.split('(')[0],
          'From/To': [ '', v.smart_contract.hash ],
          Time: '',
          'Value MOCA': '',
          'Fee MOCA': '0',
        });
      }
    });
    const noneData = tableList.find((v: any) => v['From/To'][0] === '');
    if (noneData) {
      const newItems = await getTransactions(noneData['From/To'][1], arr);
      pushTableList(params, newItems);
      return;
    }
    setMapValue(queryParams.page.toString(), new URLSearchParams(
      Object.entries(params.next_page_params).map(([ k, v ]) => [ k, String(v) ]),
    ).toString());
    setTableList(tableList);
    setToNext(params.next_page_params ? true : false);
  }, [ getTransactions, queryParams.page, setMapValue ]);

  const requestTransactions = React.useCallback(async(params: LogsRequestParams) => {
    let arr: Array<any> = [];
    if (!once) {
      const contract = params.items.map((v: any) => v.smart_contract.hash);

      const contractSet = new Set(contract);
      for (const i of contractSet) {
        const rp2 = await transactionsRequest(i) as LogsRequestParams;
        setTransactionsAllListValue(i, rp2.next_page_params as any);
        arr = arr.concat(rp2.items);
        // setAllList(arr);
      }
      setOnce(true);
    }
    pushTableList(params, arr);
  }, [ once, pushTableList, setTransactionsAllListValue ]);

  const request = React.useCallback(async() => {
    try {
      setLoading(true);
      const page = queryParams.page > 1 ? map.get((queryParams.page - 1).toString()) : '';
      const rp1 = await verificationRequest(page) as LogsRequestParams;
      await requestTransactions(rp1);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      throw Error(error);
    }
  }, [ map, queryParams.page, requestTransactions ]);

  const propsPage = React.useCallback((value: number) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    updateQueryParams({
      page: value,
    });
  }, [ ]);

  useEffect(() => {
    request();
  }, [ queryParams.page, request ]);

  return (
    <PageNextJs pathname="/object">
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
