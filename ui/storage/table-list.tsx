/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-imports */
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
  InputGroup,
  InputRightElement,
  InputLeftElement,
  useToast,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import type { TalbeListType } from 'types/storage';

import IconSvg from 'ui/shared/IconSvg';

import Pagination from './Pagination';
import styles from './pagination.module.css';
import { formatPubKey, timeTool, timeText } from './utils';

type Props<T extends string> = {
  tableList: Array<TalbeListType>;
  tabThead?: Array<T> | undefined;
  loading: boolean;
  error?: Error | undefined;
  page: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement> | null) => void;
  propsPage: (value: number) => void;
  currPage: number;
  toNext: boolean;
  totleDate: number;
  showTotal?: boolean;
};

function TableList(props: Props<string>) {
  const [ tableList, setTableList ] = React.useState<Array<TalbeListType>>(props.tableList);

  const router = useRouter();
  React.useEffect(() => {
    if (props.tableList) {
      setTableList(props.tableList);
    }
  }, [ props, router.pathname, tableList.length ]);
  const [ search, setSearch ] = React.useState('');
  const linkName = (name: string) => {
    switch (name) {
      case 'Object Name':
        return '/object-details/[address]';
      case 'Bucket Name':
        return '/bucket-details/[address]';
      case 'Bucket':
        return '/bucket-details/[address]';
      case 'Group Name':
        return '/group-details/[address]';
      default:
        return '/object-details/[address]';
    }
  };
  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      setSearch(event.target.value);
      props.handleSearchChange(event);
    }
  }, [ props ]);

  const clearSearch = React.useCallback(() => {
    setSearch('');
    props.handleSearchChange(null);
  }, [ props ]);
  React.useEffect(() => {
    let time: any;
    if (props?.tableList && props?.tableList.length) {
      time = setInterval(() => {
        setTableList(tableList => tableList.map(item => ({
          ...item,
          timestamp: Date.now(),
        })));
      }, 1000);
    }
    return (() => {
      if (time) {
        clearInterval(time);
      }
    });
  }, [ props ]);

  const toast = useToast();
  const copyAddress = (value: string | undefined) => () => {
    if (value) {
      toast({
        position: 'top',
        isClosable: false,
        duration: 3000,
        containerStyle: {
          minWidth: 'auto',
        },
        render: () => (
          <Box
            p="10px 48px"
            bg="#FFFF"
            border="1px solid rgba(0, 0, 0, 0.06)"
            borderRadius="32px"
          >
            <Flex alignItems="center">
              <IconSvg name="copy-toast" width="16px" height="16px" marginRight="4px"/>
              <Text fontWeight="700"
                fontSize="14px"
                color="#000000">Copy successfully</Text>
            </Flex>
          </Box>
        ),
      });
      const elInput = document.createElement('input');
      elInput.value = value;
      document.body.appendChild(elInput);
      elInput.select();
      document.execCommand('Copy');
      elInput.remove();
    }
  };

  return (
    <>
      {
        !props.showTotal ? (
          <Flex justifyContent="right" position="relative" top="-64px">
            <InputGroup
              _placeholder={{ color: 'rgba(0, 0, 0, 0.3)' }}
              fontWeight="400" fontSize="12px"
              borderColor="rgba(0, 46, 51, 0.1)"
              width="344px"
              display="flex"
              alignItems="center"
            >
              <InputLeftElement
                w="16px" h="16px" position="absolute"
                left="16px"
                top="50%"
                transform="translateY(-50%)"
              >
                <IconSvg color="#C15E97" w="16px" h="16px" name="search"/>
              </InputLeftElement>
              <Input
                value={ search }
                onChange={ handleChange }
                pl="40px"
                borderRadius="29px" height="42px"
                _focusVisible={{ borderColor: '#C15E97 !important' }}
                placeholder={ `Search by ${ props.page.replace(/^./, props.page[0].toUpperCase()) } Name or ID` }
              >
              </Input>
              {
                search && (
                  <InputRightElement w="16px" h="16px" position="absolute"
                    right="16px"
                    top="50%"
                    transform="translateY(-50%)"
                    cursor="pointer"
                    onClick={ clearSearch }
                  >
                    <IconSvg border="1px solid #C15E97" borderRadius="50%" color="#C15E97" w="16px" h="16px" name="cross"/>
                  </InputRightElement>
                )
              }
            </InputGroup>
          </Flex>
        ) : <div></div>
      }

      {
        !props.loading ? (
          <TableContainer
            position="relative"
            top={ !props.showTotal ? '-50px' : '0' }
            border="1px" borderRadius="12px" borderColor="rgba(0, 0, 0, 0.06);" padding="0 4px 78px 4px">
            <Table minHeight={ tableList.length ? 'auto' : '550px' } variant="bubble" position="relative" className={ styles.table }>
              <Thead>
                <Tr>
                  { props.tabThead?.map((value, index) => (
                    <Th
                      _first={{ p: '24px 24px 10px 24px' }}
                      key={ index }
                      color="rgba(0, 0, 0, 0.6)"
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
                  tableList?.map((title: TalbeListType | any, key) => (
                    <Tr _hover={{ bg: 'rgba(220, 212, 255, 0.24)' }} key={ key }>
                      {
                        Object.keys(title)?.map((value: string, index) => (
                          value !== 'timestamp' && (
                            <Td
                              _last={{ borderRightRadius: '12px' }}
                              _first={{ borderLeftRadius: '12px' }}
                              key={ index }
                              fontWeight="500" fontSize="14px"
                              overflow="hidden"
                              color="#C15E97"
                              p="12px 24px"
                            >
                              {
                                value === 'id' ? null :
                                  value === 'Last Updated Time' || value === 'Time' ? (
                                    <Tooltip
                                      label={ timeText(title[value]) } placement="top" bg="#FFFFFF" color="#000000" >
                                      <Box overflow="hidden" color="#000000" display="inline-block">
                                        <Skeleton isLoaded={ !props.loading }>{ timeTool(title[value]) }</Skeleton>
                                      </Box>
                                    </Tooltip >
                                  ) :
                                    value === 'txnHash' || value === 'Txn hash' ? (
                                      <Tooltip label={ title[value] } placement="top" bg="#FFFFFF" color="#000000">
                                        <NextLink href={{ pathname: '/tx/[hash]', query: { hash: title[value] || '',
                                          tab: value === 'Txn hash' ? location.pathname.slice(1) : '' } }}>
                                          <Box overflow="hidden" display="inline-block">
                                            <Skeleton isLoaded={ !props.loading }>{ formatPubKey(title[value]) }</Skeleton>
                                          </Box>
                                        </NextLink>
                                      </Tooltip >
                                    ) :
                                      value === 'Owner' || value === 'Creator' ? (
                                        <Tooltip
                                          isDisabled={ title[value].toString().length <= 12 }
                                          label={ title[value] } padding="8px" placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
                                          <NextLink href={{ pathname: '/address/[hash]', query: { hash: title[value] || '' } }}>
                                            <Box overflow="hidden" display="inline-block">
                                              <Skeleton isLoaded={ !props.loading }>{ formatPubKey(title[value], 6, 6) }</Skeleton>
                                            </Box>
                                          </NextLink>
                                        </Tooltip>
                                      ) :
                                        value === 'Last Updated' || value === 'Block' ? (
                                          <Skeleton isLoaded={ !props.loading }>
                                            <Flex>
                                              {
                                                value === 'Last Updated' && <Box color="#000000" marginRight="4px">Block</Box>
                                              }
                                              <NextLink href={{ pathname: '/block/[height_or_hash]', query: { height_or_hash: title[value] || '' } }}>
                                                <Box>{ title[value] }</Box>
                                              </NextLink>
                                            </Flex>
                                          </Skeleton>
                                        ) :
                                          value === 'Object Name' ||
                                          value === 'Type' ||
                                          value === 'Bucket Name' ||
                                          value === 'Bucket' ||
                                          value === 'Group Name' ? (
                                              <Tooltip
                                                isDisabled={ title[value].toString().length <= 16 }
                                                label={ title[value] } padding="8px" placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
                                                {
                                                  value === 'Object Name' || value === 'Bucket Name' || value === 'Bucket' || value === 'Group Name' ? (
                                                    <NextLink href={{ pathname: linkName(value), query: { address: title.id || '' } }}>
                                                      <Box overflow="hidden" display="inline-block">
                                                        <Skeleton isLoaded={ !props.loading }>
                                                          { formatPubKey(title[value], 0, 16, 16) }
                                                        </Skeleton>
                                                      </Box>
                                                    </NextLink>
                                                  ) : (
                                                    <Box overflow="hidden" color="#000000" display="inline-block">
                                                      <Skeleton isLoaded={ !props.loading }>
                                                        { formatPubKey(title[value], 0, 16, 16) }
                                                      </Skeleton>
                                                    </Box>
                                                  )
                                                }
                                              </Tooltip >
                                            ) :
                                            value === 'Bucket ID' || value === 'Group ID' ? (
                                              <Tooltip
                                                isDisabled={ title[value].toString().length <= 12 }
                                                label={ title[value] } padding="8px" placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
                                                <Box color="#000000" display="inline-block">
                                                  <Skeleton isLoaded={ !props.loading }>
                                                    { title[value].length > 12 ? formatPubKey(title[value], 0, 12) : title[value] }
                                                  </Skeleton>
                                                </Box>
                                              </Tooltip>
                                            ) :
                                              value === 'Group Name' ? (
                                                <Tooltip label={ title[value] } padding="8px" placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
                                                  <NextLink href={{ pathname: '/group-details/[address]', query: { address: title[value] || '' } }}>
                                                    <Box display="inline-block">
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
                                                    textTransform="capitalize"
                                                  >
                                                    <Box><Skeleton isLoaded={ !props.loading }>
                                                      { title[value].split('_').splice(-1).toString().toLowerCase() }
                                                    </Skeleton></Box>
                                                  </Box>
                                                ) :
                                                  value === 'From/To' ? (
                                                    <Skeleton display="flex" isLoaded={ !props.loading }>
                                                      <NextLink href={{ pathname: '/address/[hash]', query: { hash: title[value][0] || '' } }}>
                                                        <Box display="inline-block">
                                                          <Skeleton isLoaded={ !props.loading }>
                                                            { formatPubKey(title[value][0]) }
                                                          </Skeleton>
                                                        </Box>
                                                      </NextLink>
                                                      <IconSvg
                                                        onClick={ copyAddress(title[value][0]) }
                                                        cursor="pointer"
                                                        marginLeft="4px"
                                                        color="rgba(0, 0, 0, .4)" w="16px" h="16px" name="copyAddress"/>
                                                      <Box margin="0 4px" color="#000000">/</Box>
                                                      <NextLink href={{ pathname: '/address/[hash]', query: { hash: title[value][1] || '' } }}>
                                                        <Box display="inline-block">
                                                          <Skeleton isLoaded={ !props.loading }>
                                                            Moca Chain
                                                          </Skeleton>
                                                        </Box>
                                                      </NextLink>
                                                      <IconSvg
                                                        onClick={ copyAddress(title[value][1]) }
                                                        cursor="pointer"
                                                        marginLeft="4px"
                                                        color="rgba(0, 0, 0, .4)" w="16px" h="16px" name="copyAddress"/>

                                                    </Skeleton>
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
              <Flex position="absolute" right="24px" bottom="-54px" justifyContent="space-between" w="97%">
                {
                  !props.showTotal ? (
                    <Box color="rgba(0, 0, 0, 0.5)" fontWeight="400" fontSize="12px">
                      A total of { props.totleDate } { props.totleDate > 1 ? props.page + 's' : props.page }
                    </Box>
                  ) : <div></div>
                }
                <Pagination page={ props.currPage } propsPage={ props.propsPage } toNext={ props.toNext }></Pagination>
              </Flex>
            </Table>
            <Flex>
              <Box
                opacity={ tableList.length ? '0' : '1' }
                position="absolute"
                zIndex="10"
                w="100px"
                h="100px"
                backgroundRepeat="no-repeat"
                top="50%"
                left="50%"
                backgroundSize="cover"
                backgroundImage="url(/static/NotDate.png)"></Box>
            </Flex>
          </TableContainer>
        ) : (
          <Flex>
            <Box className={ styles.loader }></Box>
          </Flex>
        )
      }
    </>
  );
}

export default React.memo(TableList);
