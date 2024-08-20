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
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Button,
  Divider,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React, { useState } from 'react';

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
  secondaryAddresses?: Array<string>;
}

const Page = (props: Props) => {
  const toast = useToast();
  const [ creatorFlag, setCreatorFlag ] = useState<boolean>(false);
  const [ ownerFlag, setOwnerFlag ] = useState<boolean>(false);

  const copyAddress = (value: string | undefined, index?: string) => () => {
    if (value) {
      if (index === 'Creator') {
        setCreatorFlag(true);
      } else if (index === 'Owner') {
        setOwnerFlag(true);
      }
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
    <Flex>
      <TableContainer flex="1" border="1px" borderRadius="12px" borderColor="rgba(0, 0, 0, 0.06);" p="16px 24px 0px 16px">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th pl="0" bg="none" color="#000000" fontWeight="700" fontSize="16px" mb="8px">Overview</Th>
            </Tr>
          </Thead>
          <Tbody>
            { Object.entries(props.overview || {}).map(([ key, value ]) => (
              <Tr borderBottom="1px solid rgba(0, 46, 51, 0.1)" key={ key } _last={{
                borderColor: '#FFFFFF',
              }}>
                <Td border="none" fontWeight="400" fontSize="14px" color="rgba(0, 0, 0, 0.4)" p="12px 0">{ key }</Td>
                <Td border="none" fontWeight="500" fontSize="12px" color="#000000" p="12px 0" textAlign="right">
                  {
                    key === 'Bucket Status' || key === 'Deleted' || key === 'Object Status' || key === 'Source Type' ? (
                      <Box bg="#30D3BF" display="inline-block" padding="4px 12px" color="#FFFFFF" borderRadius="23px">
                        { value }
                      </Box>
                    ) : (
                      <Text>
                        { value }
                      </Text>
                    ) }
                </Td>
              </Tr>
            )) }
          </Tbody>
        </Table>
      </TableContainer>

      <Square size="20px"></Square>

      <TableContainer flex="1" border="1px" borderRadius="12px" borderColor="rgba(0, 0, 0, 0.06);" p="16px 24px">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th pl="0" bg="none" color="#000000" fontWeight="700" fontSize="16px" marginBottom="8px">More</Th>
            </Tr>
          </Thead>
          <Tbody>
            { Object.entries(props.more || {}).map(([ key, values ]) => (
              <Tr key={ key }>
                <Td fontWeight="400" fontSize="14px" color="rgba(0, 0, 0, 0.4)" p="12px 0">{ key }</Td>
                <Td
                  p="12px 0"
                  fontWeight="500"
                  fontSize="12px"
                  color={ values.status === 'none' || values.status === 'time' ? '#000000' : '#8A55FD' }
                  textAlign="right"
                >
                  {
                    values.status === 'copyLink' ? (
                      <Flex alignItems="center" flex="right" justifyContent="right">
                        <NextLink href={{ pathname: '/address/[hash]', query: { hash: values.value || '' } }}>
                          { values.value }
                        </NextLink>
                        <IconSvg
                          color={ (creatorFlag && key === 'Creator') || (ownerFlag && key === 'Owner') ? '#A07EFF' : 'rgba(0, 0, 0, .4)' }
                          cursor="pointer"
                          ml="4px"
                          onClick={ copyAddress(values.value, key) }
                          name="copyAddress"
                          _hover={{ color: '#A07EFF' }}
                          w="14px"
                          h="14px">
                        </IconSvg>
                        <Wrap>
                          <WrapItem></WrapItem>
                        </Wrap>
                      </Flex>
                    ) :
                      values.status === 'link' || values.status === 'nodereal' ? (
                        <NextLink
                          href={{ pathname: '/address/[hash]',
                            query: { hash: values.value || '' } }}>
                          { values.status === 'nodereal' ? values.value : '' }
                        </NextLink>
                      ) :
                        values.status === 'bucketPage' ?
                          <NextLink href={{ pathname: '/bucket-details/[address]', query: { address: values.value || '' } }}>{ values.value }</NextLink> :
                          values.status === 'clickViewAll' ? (
                            <Popover closeOnBlur={ false }>
                              <PopoverTrigger>
                                <Button
                                  borderRadius="none"
                                  height="auto"
                                  fontWeight="500"
                                  fontSize="12px"
                                  padding="0px"
                                  variant="text">{ values.value }</Button>
                              </PopoverTrigger>
                              <PopoverContent right="94px" w="auto">
                                <PopoverHeader
                                  textAlign="left"
                                  border="none"
                                  color="#000000"
                                  p="24px"
                                  fontWeight="500"
                                  fontSize="12px"
                                >
                                  All Secondary SP Addresses!
                                </PopoverHeader>
                                <PopoverCloseButton w="16px" h="16px" top="24px" right="24px"/>
                                { props.secondaryAddresses?.map((value, index) => (
                                  <PopoverBody
                                    _last={{ paddingBottom: '24px' }}
                                    padding="0 24px"
                                    textAlign="left"
                                    key={ index }>
                                    <Flex align="center" color="#8A55FD" fontWeight="500" fontSize="12px">
                                      <NextLink href={{ pathname: '/address/[hash]', query: { hash: value || '' } }}>{ value }</NextLink>
                                      <IconSvg
                                        cursor="pointer"
                                        onClick={ copyAddress(values.value) }
                                        marginLeft="48px"
                                        w="14px"
                                        h="14px"
                                        name="copyAddress">
                                      </IconSvg>
                                    </Flex>
                                    <Divider margin="10px 0" bg="rgba(0, 46, 51, 0.1)"/>
                                  </PopoverBody>
                                ),
                                ) }
                              </PopoverContent>
                            </Popover>
                          ) :
                            (
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
