/* eslint-disable no-nested-ternary */
import {
  Table,
  Tbody,
  Tr,
  Td,
  Th,
  TableContainer,
  Flex,
  Thead,
  Text,
  Square,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

interface PropsMoreValueType {
  value: string | undefined;
  status: string;
}

type Props = {
  overview?: {
    'Object Name'?: string;
    'Object Tags'?: string;
    'Object ID'?: string;
    'Object No.'?: string;
    'Type'?: string;
    'Object Size'?: string;
    'Object Status'?: string;
    'Bucket Name'?: string;
    'Bucket Tags'?: string;
    'Bucket ID'?: string;
    'Bucket No.'?: string;
    'Active Objects Count'?: string;
    'Bucket Status'?: string;
    'Deleted'?: string;
    'Group Name'?: string;
    'Group Tags'?: string;
    'Group ID'?: string;
    'Extra'?: string;
    'Source Type'?: string;
  } | undefined;
  more?: {
    'Visibility'?: PropsMoreValueType;
    'Bucket Name'?: PropsMoreValueType;
    'Last Updated Time'?: PropsMoreValueType;
    'Creator'?: PropsMoreValueType;
    'Owner'?: PropsMoreValueType;
    'Primary SP'?: PropsMoreValueType;
    'Secondary SP Addresses'?: PropsMoreValueType;
    'Storage Size'?: PropsMoreValueType;
    'Charge Size'?: PropsMoreValueType;
    'Active Objects Count'?: PropsMoreValueType;
    'Bucket Status'?: PropsMoreValueType;
  } | undefined;
}

const Page = (props: Props) => {

  return (
    <Flex>
      <TableContainer flex="1" border="1px" borderRadius="12px" borderColor="rgba(0, 0, 0, 0.06);" padding="16px 24px">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th paddingLeft="0" bg="none" color="#000000" fontWeight="700" fontSize="16px" marginBottom="8px">Overview</Th>
            </Tr>
          </Thead>
          <Tbody>
            { Object.entries(props.overview || {}).map(([ key, value ]) => (
              <Tr key={ key }>
                <Td fontWeight="400" fontSize="14px" color="rgba(0, 0, 0, 0.4)" padding="12px 0">{ key }</Td>
                <Td fontWeight="500" fontSize="12px" color="#000000" padding="12px 0" textAlign="right">{ value }</Td>
              </Tr>
            )) }
          </Tbody>
        </Table>
      </TableContainer>

      <Square size="20px"></Square>

      <TableContainer flex="1" border="1px" borderRadius="12px" borderColor="rgba(0, 0, 0, 0.06);" padding="16px 24px">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th paddingLeft="0" bg="none" color="#000000" fontWeight="700" fontSize="16px" marginBottom="8px">More</Th>
            </Tr>
          </Thead>
          <Tbody>
            { Object.entries(props.more || {}).map(([ key, values ]) => (
              <Tr key={ key }>
                <Td fontWeight="400" fontSize="14px" color="rgba(0, 0, 0, 0.4)" padding="12px 0">{ key }</Td>
                <Td
                  padding="12px 0"
                  fontWeight="500"
                  fontSize="12px" color={ values.status === 'none' || values.status === 'time' ? '#000000' : '#8A55FD' } textAlign="right">
                  {
                    values.status === 'copyLink' ? (
                      <NextLink href={{ pathname: '/address/[hash]', query: { hash: values.value || '' } }}>
                        <Flex alignItems="center" flex="right" justifyContent="right">
                          { values.value }
                          <IconSvg name="copyAddress" color="red" width="14px" height="14px"></IconSvg>
                        </Flex>
                      </NextLink>
                    ) :
                      values.status === 'link' ?
                        <NextLink href={{ pathname: '/address/[hash]', query: { hash: values.value || '' } }}>{ values.value }</NextLink> : (
                          <Text
                            fontWeight="500"
                            fontSize="12px"
                            color={ values.status === 'none' || values.status === 'time' ? '#000000' : '#8A55FD' } textAlign="right">{ values.value }</Text>
                        ) }
                </Td>
              </Tr>
            )) }
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default Page;
