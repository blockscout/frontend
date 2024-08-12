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
  txnHash: string;
  Block: string;
  Age?: string;
  Type?: string;
  objectSize?: string;
  Visibility?: string;
  lastTime?: string;
  Creator?: string;
}

type Props<T extends string> = {
  tapList?: Array<T> | undefined;
  talbeList?: Array<TalbeListType> | undefined;
  tabThead?: Array<T> | undefined;
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
  const changeTap = (value: string) => {
    setTapSelect(value);
    return undefined;
  };

  return (
    <TableContainer marginTop="24px" border="1px" borderRadius="12px" borderColor="rgba(0, 0, 0, 0.06);" padding="24px 0">
      <Table variant="simple">
        <Thead>
          <Tr padding="0 24px" display="table-row">
            { props.tapList?.map((value, key) => (
              <Th
                key={ key }
                onClick={ changeTap(value) }
                borderBottom={ tapSelect === value ? '2px' : '0px' }
                borderColor="#8A55FD"
                display="inline-block"
                cursor="pointer"
                color={ tapSelect === value ? '#8A55FD' : 'rgba(0, 0, 0, 0.4)' }
                fontWeight={ tapSelect === value ? '700' : '400' }
                fontSize="16px"
                padding="0 0 10px 0"
                margin="0 24px"
                marginLeft={ !key ? '24px' : '0px' }
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
                padding="24px"
                bg="#FFFF"
                borderTop="1px" borderBottom="1px" borderColor="rgba(0, 0, 0, 0.06)">{ value }</Th>
            )) }
          </Tr>
        </Thead>
        <Tbody>
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            props.talbeList?.map((title: any, key) => (
              <Tr key={ key }>
                {
                  Object.keys(title)?.map((value: string) => (
                    <>
                      <div></div>
                      {
                        value === 'txnHash' ? (
                          <Td fontWeight="400" fontSize="14px" color="#8A55FD" padding="24px">
                            <Tooltip label={ title[value] } placement="top" bg="#FFFF" color="#000000">
                              <NextLink href={{ pathname: '/tx/[hash]', query: { hash: title[value] || '' } }}>
                                { formatPubKey(title[value]) }
                              </NextLink>
                            </Tooltip >
                          </Td>
                        ) :
                          value === 'Block' ? (
                            <Td fontWeight="400" fontSize="14px" color="#8A55FD" padding="24px">
                              <NextLink href={{ pathname: '/block/[height_or_hash]', query: { height_or_hash: title[value] || '' } }}>
                                { title[value] }
                              </NextLink>
                            </Td>
                          ) :
                            <Td fontWeight="400" fontSize="14px" color="#000000" padding="24px">{ title[value] }</Td>
                      }
                    </>
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
