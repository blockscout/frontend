/* eslint-disable no-nested-ternary */
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Tooltip,
  Box,
  Flex,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React, { useState } from 'react';

// import Pagination from 'ui/shared/pagination/Pagination';

import { formatPubKey } from './utils';

interface TalbeListType {
  Block?: string;
  Age?: string;
  Type?: string;
  objectSize?: string;
  Visibility?: string;
  lastTime?: string;
  Creator?: string;
  'objects name'?: string;
  'Txn Hash'?: string;
  'Object Size'?: string;
  Status?: string;
  'Last Updated Time'?: string;
}

type Props<T extends string> = {
  tabsList?: Array<T> | undefined;
  tableList?: Array<TalbeListType> | undefined;
  tabThead?: Array<T> | undefined;
  changeTable: (value: any) => void;
  toNext: boolean;
  propsPage: (value: number) => void;
  currPage: number;
}

function Page<T extends string>(props: Props<T>) {
  const [ tapSelect, setTapSelect ] = useState<string>(props.tabsList && props.tabsList.length ? props.tabsList[0] : '');
  const handleChange = (event: any) => () => {
    setTapSelect(event);
    props.changeTable(event);
  };

  return (
    <TableContainer marginTop="24px" border="1px" borderRadius="12px" borderColor="rgba(0, 0, 0, 0.06);" padding="24px 0">
      <Table variant="simple">
        <Thead>
          <Tr padding="0 24px" display="table-row">
            { props.tabsList?.map((value, key) => (
              <Th
                key={ key }
                onClick={ handleChange(value) }
                borderBottom={ tapSelect === value ? '2px' : '0px' }
                borderColor="#8A55FD"
                display="inline-block"
                cursor="pointer"
                color={ tapSelect === value ? '#8A55FD' : 'rgba(0, 0, 0, 0.6)' }
                fontWeight={ tapSelect === value ? '700' : '400' }
                fontSize="16px"
                p="0 0 10px 0"
                m="0 24px"
                ml={ !key ? '24px' : '0px' }
                bg="none"
              >
                { value }
              </Th>
            )) }
          </Tr>
          <Tr>
            { props.tabThead?.map((value, index) => (
              <Th
                key={ index }
                p="24px"
                bg="#FFFF"
                borderTop="1px" borderBottom="1px" borderColor="rgba(0, 0, 0, 0.06)">{ value }</Th>
            )) }
          </Tr>
        </Thead>
        <Tbody>
          {
            props.tableList?.map((title: any, key) => (
              <Tr key={ key } >
                {
                  Object.keys(title)?.map((value: string, index) => (
                    value !== 'id' && (
                      <Td
                        key={ index }
                        fontWeight="500" fontSize="14px"
                        overflow="hidden"
                        color={ value === 'txnHash' ? '#8A55FD' : '#000000' } padding="24px"
                      >
                        {
                          value === 'Txn Hash' ? (
                            <Tooltip label={ title[value] } placement="top" bg="#FFFF" color="#000000">
                              <NextLink href={{ pathname: '/tx/[hash]', query: { hash: title[value] || '' } }}>
                                <Box color="#8A55FD">
                                  { formatPubKey(title[value], 6, 6) }
                                </Box>
                              </NextLink>
                            </Tooltip >
                          ) :
                            value === 'Block' ? (
                              <NextLink href={{ pathname: '/block/[height_or_hash]', query: { height_or_hash: title[value] || '' } }}>
                                <Box color="#8A55FD">
                                  { title[value] }
                                </Box>
                              </NextLink>
                            ) :
                              value === 'Creator' ? (
                                <NextLink href={{ pathname: '/address/[hash]', query: { hash: title[value] || '' } }}>
                                  <Box color="#8A55FD" overflow="hidden">{ formatPubKey(title[value], 6, 6) }</Box>
                                </NextLink>
                              ) :
                                value === 'objects name' ? (
                                  <NextLink href={{ pathname: '/object-details/[address]', query: { address: title.id || '' } }}>
                                    <Box color="#8A55FD" overflow="hidden">{ title[value] }</Box>
                                  </NextLink>
                                ) :
                                  value === 'Block' ? (
                                    <NextLink href={{ pathname: '/block/[height_or_hash]', query: { height_or_hash: title[value] || '' } }}>
                                      { title[value] }
                                    </NextLink>
                                  ) :
                                    value === 'Type' ? (
                                      <Box color="#FFFFFF" display="inline-block" padding="4px 12px" bg="#30D3BF" borderRadius="23px">
                                        { title[value] }
                                      </Box>
                                    ) :
                                      <div>{ title[value] }</div>
                        }
                      </Td>
                    )
                  ))
                }
              </Tr>
            )) }
        </Tbody>
      </Table>
      <Flex position="absolute" right="24px" bottom="-54px" justifyContent="space-between" w="97%">
        { /* <Pagination page={ props.currPage } propsPage={ props.propsPage } toNext={ props.toNext }></Pagination> */ }
      </Flex>
    </TableContainer>
  );
}

export default React.memo(Page);
