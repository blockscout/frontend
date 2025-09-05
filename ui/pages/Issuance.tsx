/* eslint-disable @typescript-eslint/no-explicit-any */

// import { Box, Flex, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
// import orderBy from 'lodash/orderBy';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import { getEnvValue } from 'configs/app/utils';

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

  // const [ block, setBlock ] = React.useState<number>(0);

  const [ tableList, setTableList ] = React.useState<Array<IssuanceTalbeListType>>([]);

  const tabThead = [ 'Txn hash', 'Block', 'Method', 'From/To', 'Time', 'Value MOCA', 'Fee MOCA' ];

  const url = getEnvValue('NEXT_PUBLIC_API_HOST');
  // const [ totalIssued, setTotalIssued ] = React.useState<number>(0);
  // const [ totalCredential, setTotalCredential ] = React.useState<number>(0);
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const [ map, setMap ] = React.useState<Map<string, any>>(new Map());
  const setMapValue = React.useCallback((key: string, value: any) => {
    setMap(prevMap => {
      prevMap.set(key, value);
      return prevMap;
    });
  }, [ ]);
  // const [ previousCursor, setpreviousCursor ] = React.useState<string>('');

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

  const request = React.useCallback(async() => {
    try {
      setLoading(true);
      const hash = queryParams.page > 1 ? map.get((queryParams.page - 1).toString()) : '';
      const rp1 = await (await fetch('https://' + url + '/api/v2/addresses/' +
        '0xC26Cc070c4Cc98EFC78D6ed1936987Db5d6Cd82b' + '/transactions?' + `${ hash || '' }`,
      { method: 'get' })).json() as any;
      const tableList: Array<IssuanceTalbeListType> = [];
      rp1.items.forEach((v: any) => {
        tableList.push({
          'Txn hash': v.hash,
          Block: v.block_number,
          Method: v.method,
          'From/To': [ v.from.hash, '0xC26Cc070c4Cc98EFC78D6ed1936987Db5d6Cd82b' ],
          Time: new Date(v.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Shanghai', hour12: false }),
          'Value MOCA': v.value,
          'Fee MOCA': truncateToSignificantDigits(BigNumber(v.base_fee_per_gas / 1e18).toString(10), 3).toString(10),
        });
      });
      setMapValue(queryParams.page.toString(), new URLSearchParams(
        Object.entries(rp1.next_page_params).map(([ k, v ]) => [ k, String(v) ]),
      ).toString());
      setToNext(rp1.next_page_params ? true : false);
      setTableList(tableList);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      throw Error(error);
    }
  }, [ url, setMapValue, queryParams.page, map ]);

  const propsPage = React.useCallback((value: number) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    request();
    updateQueryParams({
      page: value,
    });
  }, [ request ]);

  React.useEffect(() => {
    if (url) {
      request();
    }
  }, [ request, url ]);

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
