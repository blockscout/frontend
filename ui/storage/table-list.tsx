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
  Flex,
  Input,
  Box,
  Skeleton,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import type { TalbeListType } from 'types/storage';

import Pagination from './Pagination';
import styles from './pagination.module.css';
import { formatPubKey, skeletonList } from './utils';

type Props<T extends string> = {
  tapList?: Array<T> | undefined;
  talbeList: Array<TalbeListType>;
  tabThead?: Array<T> | undefined;
  loading: boolean;
  error: Error | undefined;
  page: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  propsPage: (value: number) => void;
  currPage: number;
  toNext: boolean;
}

function TableList(props: Props<string>) {
  let talbeList: Array<TalbeListType> = props.talbeList;
  const router = useRouter();
  if (!talbeList?.length && !props.error && props.loading) {
    talbeList = skeletonList(router.pathname);
  }
  return (
    <>
      <Flex justifyContent="right">
        <Input
          _placeholder={{ color: 'rgba(0, 0, 0, 0.3)' }}
          fontWeight="400" fontSize="12px"
          borderColor="rgba(0, 46, 51, 0.1)"
          onChange={ props.handleSearchChange }
          borderRadius="29px" width="344px" height="42px"
          placeholder={ `Search by ${ props.page.replace(/^./, props.page[0].toUpperCase()) } Name or ID` }
        >
        </Input>
      </Flex>
      <TableContainer marginTop="16px" border="1px" borderRadius="12px" borderColor="rgba(0, 0, 0, 0.06);" padding="0 4px 78px 4px">
        <Table variant="bubble" position="relative" className={ styles.table }>
          <Thead>
            <Tr>
              { props.tabThead?.map((value, index) => (
                <Th
                  _first={{ p: '24px 24px 10px 24px' }}
                  key={ index }
                  color="rgba(0, 0, 0, 0.4)"
                  p="24px 24px 10px 24px"
                  bg="#FFFF"
                  borderBottom="1px"
                  borderColor="rgba(0, 0, 0, 0.1)">
                  { value }
                </Th>
              )) }
            </Tr>
          </Thead>
          <Tbody>
            {
              talbeList?.map((title: TalbeListType | any, key) => (
                <Tr _hover={{ bg: 'rgba(220, 212, 255, 0.24)' }} key={ key }>
                  {
                    Object.keys(title)?.map((value: string, index) => (
                      value !== 'id' && (
                        <Td
                          _last={{ borderRightRadius: '12px' }}
                          _first={{ borderLeftRadius: '12px' }}
                          key={ index }
                          fontWeight="500" fontSize="14px"
                          overflow="hidden"
                          color="#8A55FD"
                          p="12px 24px"
                        >
                          {
                            value === 'txnHash' ? (
                              <Tooltip label={ title[value] } placement="top" bg="#FFFFFF" >
                                <NextLink href={{ pathname: '/tx/[hash]', query: { hash: title[value] || '' } }}>
                                  <Box overflow="hidden">
                                    <Skeleton isLoaded={ !props.loading }>{ formatPubKey(title[value]) }</Skeleton>
                                  </Box>
                                </NextLink>
                              </Tooltip >
                            ) :
                              value === 'Owner' || value === 'Creator' ? (
                                <Tooltip label={ title[value] } padding="8px" placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
                                  <NextLink href={{ pathname: '/address/[hash]', query: { hash: title[value] || '' } }}>
                                    <Box overflow="hidden">
                                      <Skeleton isLoaded={ !props.loading }>{ formatPubKey(title[value], 6, 6) }</Skeleton>
                                    </Box>
                                  </NextLink>
                                </Tooltip>
                              ) :
                                value === 'Last Updated' ? (
                                  <Skeleton isLoaded={ !props.loading }>
                                    <Flex>
                                      <Box color="#000000" marginRight="4px">Block</Box>
                                      <NextLink href={{ pathname: '/block/[height_or_hash]', query: { height_or_hash: title[value] || '' } }}>
                                        <Box>{ title[value] }</Box>
                                      </NextLink>
                                    </Flex>
                                  </Skeleton>
                                ) :
                                  value === 'Object Name' ? (
                                    <Tooltip label={ title[value] } padding="8px" placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
                                      <NextLink href={{ pathname: '/object-details/[address]', query: { address: title[value] || '' } }}>
                                        <Box overflow="hidden"><Skeleton isLoaded={ !props.loading }>{ formatPubKey(title[value], 16, 16) }</Skeleton></Box>
                                      </NextLink>
                                    </Tooltip >
                                  ) :
                                    value === 'Bucket ID' || value === 'Group ID' ? (
                                      <Tooltip label={ title[value] } padding="8px" placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
                                        <Box>
                                          <Skeleton isLoaded={ !props.loading }>
                                            { title[value].length > 12 ? formatPubKey(title[value], 6, 6) : title[value] }
                                          </Skeleton>
                                        </Box>
                                      </Tooltip>
                                    ) :
                                      value === 'Bucket Name' || value === 'Bucket' ? (
                                        <Tooltip label={ title[value] } padding="8px" placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
                                          <NextLink href={{ pathname: '/bucket-details/[address]', query: { address: title[value] || '' } }}>
                                            <Box>
                                              <Skeleton isLoaded={ !props.loading }>
                                                { title[value].length > 16 ? formatPubKey(title[value], 0, 16) : title[value] }
                                              </Skeleton>
                                            </Box>
                                          </NextLink>
                                        </Tooltip>
                                      ) :
                                        value === 'Group Name' ? (
                                          <Tooltip label={ title[value] } padding="8px" placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
                                            <NextLink href={{ pathname: '/group-details/[address]', query: { address: title[value] || '' } }}>
                                              <Box>
                                                <Skeleton isLoaded={ !props.loading }>
                                                  { title[value].length > 16 ? formatPubKey(title[value], 0, 16) : title[value] }
                                                </Skeleton>
                                              </Box>
                                            </NextLink>
                                          </Tooltip>
                                        ) :
                                          value === 'Status' ? (
                                            <Box
                                              bg="#30D3BF"
                                              color="#FFFFFF"
                                              fontWeight="500"
                                              fontSize="12px"
                                              display="inline-block"
                                              padding="4px 8px"
                                              borderRadius="24px"
                                            >
                                              <Box><Skeleton isLoaded={ !props.loading }>{ title[value] }</Skeleton></Box>
                                            </Box>
                                          ) : (
                                            <Box color="#000000" overflow="hidden">
                                              <Skeleton isLoaded={ !props.loading }>{ title[value] }</Skeleton>
                                            </Box>
                                          ) }
                        </Td>
                      )
                    ))
                  }
                </Tr>
              )) }
          </Tbody>
          <Box position="absolute" right="24px" bottom="-54px">
            <Pagination page={ props.currPage } propsPage={ props.propsPage } toNext={ props.toNext }></Pagination>
          </Box>
        </Table>

      </TableContainer>
    </>
  );
}

export default React.memo(TableList);
