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
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

interface TalbeListType {
  txnHash?: string;
  Block?: string;
  Age?: string;
  Type?: string;
  objectSize?: string;
  Visibility?: string;
  lastTime?: string;
  Creator?: string;
  'Object Name'?: string;
  'Group Name'?: string;
  'Group ID'?: string;
  'Last Updated'?: string;
  'Active Group Member Count'?: string;
  Owner?: string;
}

type Props<T extends string> = {
  tapList?: Array<T> | undefined;
  talbeList?: Array<TalbeListType> | undefined;
  tabThead?: Array<T> | undefined;
}
function formatPubKey(pubKey: string | undefined, _length = 4, _preLength = 4) {
  if (!pubKey) {
    return;
  }
  if (!pubKey || typeof pubKey !== 'string' || pubKey.length < (_length * 2 + 1)) {
    return pubKey;
  }
  return pubKey.substr(0, _preLength || _length) + '...' + pubKey.substr(_length * -1, _length);
}

function tableList<T extends string>(props: Props<T>) {
  return (
    <>
      <Flex justifyContent="right">
        <Input
          _placeholder={{ color: 'rgba(0, 0, 0, 0.3)' }}
          fontWeight="400" fontSize="12px"
          borderColor="rgba(0, 46, 51, 0.1)"
          borderRadius="29px" width="344px" height="42px" placeholder="Search by Object Name or ID">
        </Input>
      </Flex>
      <TableContainer marginTop="16px" border="1px" borderRadius="12px" borderColor="rgba(0, 0, 0, 0.06);" padding="0 4px">
        <Table variant="bubble">
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
                  borderColor="rgba(0, 0, 0, 0.1)">{ value }</Th>
              )) }
            </Tr>
          </Thead>
          <Tbody>
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              props.talbeList?.map((title: any, key) => (
                <Tr _hover={{ bg: 'rgba(220, 212, 255, 0.24)' }} key={ key }>
                  {
                    Object.keys(title)?.map((value: string, index) => (
                      <Td
                        _last={{ borderRightRadius: '12px' }}
                        _first={{ borderLeftRadius: '12px' }}
                        key={ index }
                        fontWeight="500" fontSize="14px"
                        overflow="hidden"
                        color={ value === 'txnHash' ? '#8A55FD' : '#000000' }
                        p="12px 24px"
                      >
                        {
                          value === 'txnHash' ? (
                            <Tooltip label={ title[value] } placement="top" bg="#FFFFFF" color="#000000" >
                              <NextLink href={{ pathname: '/tx/[hash]', query: { hash: title[value] || '' } }}>
                                { formatPubKey(title[value]) }
                              </NextLink>
                            </Tooltip >
                          ) :
                            value === 'Owner' || value === 'Creator' || value === 'Creator' ? (
                              <NextLink href={{ pathname: '/address/[hash]', query: { hash: title[value] || '' } }}>
                                <Box overflow="hidden">{ title[value] }</Box>
                              </NextLink>
                            ) :
                              value === 'Last Updated' ? (
                                <NextLink href={{ pathname: '/block/[height_or_hash]', query: { height_or_hash: title[value] || '' } }}>
                                  { title[value] }
                                </NextLink>
                              ) :
                                value === 'Object Name' ? (
                                  <NextLink href={{ pathname: '/object-details/[address]', query: { address: title[value] || '' } }}>
                                    <Box overflow="hidden" color="#8A55FD">{ title[value] }</Box>
                                  </NextLink>
                                ) :
                                  value === 'Bucket Name' || value === 'Bucket' ? (
                                    <NextLink href={{ pathname: '/bucket-details/[address]', query: { address: title[value] || '' } }}>
                                      <Box color="#8A55FD">{ title[value] }</Box>
                                    </NextLink>
                                  ) :
                                    value === 'Group Name' ? (
                                      <NextLink href={{ pathname: '/group-details/[address]', query: { address: title[value] || '' } }}>
                                        <Box color="#8A55FD">{ title[value] }</Box>
                                      </NextLink>
                                    ) :
                                      <Box overflow="hidden">{ title[value] }</Box>
                        }
                      </Td>
                    ))
                  }
                </Tr>
              )) }
          </Tbody>
        </Table>

      </TableContainer>
    </>
  );
}

export default React.memo(tableList);