/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
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
  Wrap,
  WrapItem,
  useToast,
  Box,
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
            padding="10px 48px"
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
    <Flex>
      <TableContainer flex="1" border="1px" borderRadius="12px" borderColor="rgba(0, 0, 0, 0.06);" padding="16px 24px 0px 16px">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th paddingLeft="0" bg="none" color="#000000" fontWeight="700" fontSize="16px" marginBottom="8px">Overview</Th>
            </Tr>
          </Thead>
          <Tbody>
            { Object.entries(props.overview || {}).map(([ key, value ]) => (
              <Tr borderBottom="1px solid rgba(0, 46, 51, 0.1)" key={ key } _last={{
                borderColor: '#FFFFFF',
              }}>
                <Td border="none" fontWeight="400" fontSize="14px" color="rgba(0, 0, 0, 0.4)" padding="12px 0">{ key }</Td>
                <Td border="none" fontWeight="500" fontSize="12px" color="#000000" padding="12px 0" textAlign="right">{ value }</Td>
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
                      // <NextLink href={{ pathname: '/address/[hash]', query: { hash: values.value || '' } }}>
                      <Flex alignItems="center" flex="right" justifyContent="right">
                        { values.value }
                        <IconSvg
                          onClick={ copyAddress(values.value) }
                          name="copyAddress"
                          color="rgba(0, 0, 0, .4)"
                          _hover={{ color: '#A07EFF' }}
                          width="14px"
                          height="14px">
                        </IconSvg>
                        <Wrap>
                          <WrapItem></WrapItem>
                        </Wrap>
                      </Flex>
                      // </NextLink>
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
