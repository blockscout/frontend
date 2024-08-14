/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
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
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React, { useState } from 'react';

interface TalbeListType {
  Block: string;
  Age?: string;
  Type?: string;
  objectSize?: string;
  Visibility?: string;
  lastTime?: string;
  Creator?: string;
  'Txn Hash'?: string;
}

type Props<T extends string> = {
  tapList?: Array<T> | undefined;
  talbeList?: Array<TalbeListType> | undefined;
  tabThead?: Array<T> | undefined;
  changeTable: (value: string) => void;
}
function formatPubKey(pubKey: string, _length = 4, _preLength = 4) {
  if (!pubKey) {
    return;
  }
  if (!pubKey || typeof pubKey !== 'string' || pubKey.length < (_length * 2 + 1)) {
    return pubKey;
  }
  return pubKey.substr(0, _preLength || _length) + '...' + pubKey.substr(_length * -1, _length);
}

function Page<T extends string>(props: Props<T>) {
  const [ tapSelect, setTapSelect ] = useState<string>(props.tapList![0]);
  const handleChange = (event: string) => () => {
    setTapSelect(event);
    props.changeTable(event);
  };

  return (
    <TableContainer marginTop="24px" border="1px" borderRadius="12px" borderColor="rgba(0, 0, 0, 0.06);" padding="24px 0">
      <Table variant="simple">
        <Thead>
          <Tr padding="0 24px" display="table-row">
            { props.tapList?.map((value, key) => (
              <Th
                key={ key }
                onClick={ handleChange(value) }
                borderBottom={ tapSelect === value ? '2px' : '0px' }
                borderColor="#8A55FD"
                display="inline-block"
                cursor="pointer"
                color={ tapSelect === value ? '#8A55FD' : 'rgba(0, 0, 0, 0.4)' }
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
            props.talbeList?.map((title: any, key) => (
              <Tr key={ key } >
                {
                  Object.keys(title)?.map((value: string, index) => (
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
                              { formatPubKey(title[value]) }
                            </NextLink>
                          </Tooltip >
                        ) :
                          value === 'Block' ? (
                            <NextLink href={{ pathname: '/block/[height_or_hash]', query: { height_or_hash: title[value] || '' } }}>
                              { title[value] }
                            </NextLink>
                          ) :
                            value === 'Block' ? (
                              <NextLink href={{ pathname: '/block/[height_or_hash]', query: { height_or_hash: title[value] || '' } }}>
                                { title[value] }
                              </NextLink>
                            ) :
                              <div>{ title[value] }</div>
                      }
                    </Td>
                  ))
                }
              </Tr>
            )) }
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default Page;
