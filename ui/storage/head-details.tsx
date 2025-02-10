/* eslint-disable no-restricted-imports */

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
  // Wrap,
  // WrapItem,
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
  Skeleton,
  Tooltip,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React, { useState } from 'react';

import type { HeadProps } from 'types/storage';

import IconSvg from 'ui/shared/IconSvg';

import { formatPubKey } from './utils';

const Page = (props: HeadProps) => {
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
                <Td border="none" fontWeight="400" fontSize="14px" color="rgba(0, 0, 0, 0.6)" p="12px 0">
                  <Skeleton w={ !props.loading ? '100%' : '100px' } isLoaded={ !props.loading }>
                    { key }
                  </Skeleton>
                </Td>
                <Td border="none" fontWeight="500" fontSize="12px" color="#000000" p="12px 0" textAlign="right">
                  {
                    key === 'Deleted' ? (
                      <Skeleton w={ !props.loading ? '100%' : '100px' } float="right" isLoaded={ !props.loading }>
                        <Box bg="#30D3BF" display="inline-block" padding="4px 12px" color="#FFFFFF" borderRadius="23px">
                          { value || '-' }
                        </Box>
                      </Skeleton>
                    ) : key === 'Object Status' || key === 'Bucket Status' || key === 'Source Type' ? (
                      <Skeleton w={ !props.loading ? '100%' : '100px' } float="right" isLoaded={ !props.loading }>
                        <Box textTransform="capitalize" bg="#30D3BF" display="inline-block" padding="4px 12px" color="#FFFFFF" borderRadius="23px">
                          { value ? value.split('_').splice(-1).toString().toLowerCase() : '-' }
                        </Box>
                      </Skeleton>
                    ) :
                      key === 'Object Name' || key === 'Bucket Name' || key === 'Group Name' ? (
                        <Tooltip isDisabled={ value?.length <= 30 } label={ value } padding="8px" placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
                          <Box display="inline-block">
                            <Skeleton w={ !props.loading ? '100%' : '100px' } float="right" isLoaded={ !props.loading }>
                              { value?.length > 30 ? formatPubKey(value, 0, 30) : (value || '-') }
                            </Skeleton>
                          </Box>
                        </Tooltip>
                      ) :
                        key === 'Bucket ID' || key === 'Group ID' || key === 'Object ID' ? (
                          <Tooltip
                            isDisabled={ value?.length <= 12 }
                            label={ value } padding="8px" placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
                            <Box display="inline-block">
                              <Skeleton w={ !props.loading ? '100%' : '100px' } float="right" isLoaded={ !props.loading }>
                                { value?.length > 12 ? formatPubKey(value, 0, 12) : (value || '-') }
                              </Skeleton>
                            </Box>
                          </Tooltip>
                        ) :
                          key === 'Object Tags' || key === 'Bucket Tags' || key === 'Active Objects Count' || key === 'Group Tags' ? (
                            <Skeleton w={ !props.loading ? '100%' : '100px' } float="right" isLoaded={ !props.loading }>
                              { value || '0' }
                            </Skeleton>
                          ) :
                            (
                              <Skeleton w={ !props.loading ? '100%' : '100px' } float="right" isLoaded={ !props.loading }>
                                <Text >
                                  { value || '-' }
                                </Text>
                              </Skeleton>
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
                <Td fontWeight="400" fontSize="14px" color="rgba(0, 0, 0, 0.6)" p="12px 0">
                  <Flex>
                    { key }
                    {
                      ((key === 'Creator' || key === 'Primary SP' || key === 'Charge Size') && values.tip) && (
                        <Tooltip
                          maxW="330px"
                          color="#000000"
                          fontSize="12px"
                          label={ values.tip } padding="8px" placement="top" bg="#FFFFFF" borderRadius="8px">
                          <IconSvg
                            ml="4px"
                            name="tip"
                            w="20px"
                            h="20px">
                          </IconSvg>
                        </Tooltip>
                      )
                    }
                  </Flex>
                </Td>
                <Td
                  p="12px 0"
                  fontWeight="500"
                  fontSize="12px"
                  color={ values.status === 'none' || values.status === 'time' ? '#000000' : '#FF57B7' }
                  textAlign="right"
                >
                  {
                    values.status === 'copyLink' ? (
                      <Skeleton w={ !props.loading ? '100%' : '100px' } float="right" isLoaded={ !props.loading }>
                        <Flex alignItems="center" flex="right" justifyContent="right">
                          <NextLink href={{ pathname: '/address/[hash]', query: { hash: values.value || '' } }}>
                            { values.value }
                          </NextLink>
                          <IconSvg
                            color={ (creatorFlag && key === 'Creator') || (ownerFlag && key === 'Owner') ? '#FF57B7' : 'rgba(0, 0, 0, .4)' }
                            cursor="pointer"
                            ml="4px"
                            onClick={ copyAddress(values.value, key) }
                            name="copyAddress"
                            _hover={{ color: '#FF57B7' }}
                            w="14px"
                            h="14px">
                          </IconSvg>
                        </Flex>
                      </Skeleton>

                    ) :
                      values.status === 'link' || values.status === 'nodereal' || values.status === 'primary' ? (
                        <Skeleton w={ !props.loading ? '100%' : '100px' } float="right" isLoaded={ !props.loading }>
                          <NextLink
                            href={{ pathname: '/address/[hash]',
                              query: { hash: (values.status === 'primary' ? values.link : values.value) || '' } }}>
                            { values.value || '-' }
                          </NextLink>
                        </Skeleton>
                      ) :
                        values.status === 'bucketPage' ? (
                          <Tooltip
                            isDisabled={ values?.value ? values?.value?.length <= 30 : false }
                            label={ values.value } padding="8px" placement="top" bg="#FFFFFF" color="black" borderRadius="8px">
                            <Skeleton w={ !props.loading ? '100%' : '100px' } float="right" isLoaded={ !props.loading }>
                              <NextLink href={{ pathname: '/bucket-details/[address]', query: { address: values.value || '' } }}>
                                <Box display="inline-block">
                                  { (values.value && (values.value.length > 30)) ? formatPubKey(values.value, 0, 30) : (values.value || '-') }
                                </Box>
                              </NextLink>
                            </Skeleton>
                          </Tooltip>
                        ) :
                          values.status === 'block' ? (
                            <Skeleton w={ !props.loading ? '100%' : '100px' } float="right" isLoaded={ !props.loading }>
                              <Flex justifyContent="right">
                                <Text>Block</Text>&nbsp;
                                <NextLink href={{ pathname: '/block/[height_or_hash]', query: { height_or_hash: values.value || '' } }}>
                                  { values.value || '' }
                                </NextLink>
                              </Flex>
                            </Skeleton>
                          ) :
                            values.status === 'clickViewAll' ? (
                              <Skeleton w={ !props.loading ? '100%' : '100px' } float="right" isLoaded={ !props.loading }>
                                <Flex justifyContent="right">
                                  <Text color="#000000">
                                    { props?.groupFamilyId }&nbsp;&nbsp;
                                  </Text>
                                  <Popover closeOnBlur={ false }>
                                    <PopoverTrigger>
                                      <Button
                                        borderRadius="none"
                                        height="auto"
                                        fontWeight="500"
                                        fontSize="12px"
                                        padding="0px"
                                        variant="text">
                                        { values.value }
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent right="94px" w="auto">
                                      <PopoverHeader
                                        textAlign="left"
                                        border="none"
                                        color="#000000"
                                        p="24px"
                                        fontWeight="500"
                                        fontSize="12px"
                                        width="230px"
                                      >
                                        { values.titleNmae }
                                      </PopoverHeader>
                                      <PopoverCloseButton w="16px" h="16px" top="24px" right="24px"/>
                                      { props.secondaryAddresses?.map((value, index) => (
                                        <PopoverBody
                                          _last={{ paddingBottom: '24px' }}
                                          padding="0 24px"
                                          textAlign="left"
                                          key={ index }>
                                          <Flex align="center" color="#000000" fontWeight="500" fontSize="12px">
                                            { /* <NextLink href={{ pathname: '/address/[hash]', query: { hash: value || '' } }}>{ value }</NextLink> */ }
                                            global_virtual_group_id: { value }
                                            <IconSvg
                                              cursor="pointer"
                                              onClick={ copyAddress(value) }
                                              marginLeft="48px"
                                              w="14px"
                                              h="14px"
                                              color="#FF57B7"
                                              name="copyAddress">
                                            </IconSvg>
                                          </Flex>
                                          <Divider margin="10px 0" bg="rgba(0, 46, 51, 0.1)"/>
                                        </PopoverBody>
                                      ),
                                      ) }
                                    </PopoverContent>
                                  </Popover>
                                </Flex>

                              </Skeleton>
                            ) :
                              (
                                <Skeleton w={ !props.loading ? '' : '100px' } float="right" isLoaded={ !props.loading }>
                                  <Box
                                    fontWeight="500"
                                    fontSize="12px"
                                    color={ values.status === 'none' || values.status === 'time' ? '#000000' : '#FF57B7' }
                                    textAlign="right"
                                    justifyItems="right"
                                    display="flex"
                                  >
                                    { values.value || '-' }
                                  </Box>
                                </Skeleton>
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
