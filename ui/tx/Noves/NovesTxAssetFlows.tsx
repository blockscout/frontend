import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Skeleton, Text, Show, Hide, VStack, StackDivider, Divider } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import _ from 'lodash';
import React, { useState } from 'react';

import type { NovesResponseData } from 'types/novesApi';
import type { PaginationParams } from 'ui/shared/pagination/types';

import lightning from 'icons/lightning.svg';
import ActionBar from 'ui/shared/ActionBar';
import Icon from 'ui/shared/chakra/Icon';
import DataListDisplay from 'ui/shared/DataListDisplay';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import NovesFromToComponent from 'ui/shared/Noves/NovesFromToComponent';
import Pagination from 'ui/shared/pagination/Pagination';
import type { NovesTranslateError } from 'ui/tx/Noves/NovesUseFetchTranslate';

import NovesActionCard from './components/NovesActionCard';
import { NovesGenerateFlowViewData } from './utils/NovesGenerateFlowViewData';

interface FlowViewProps {
  data: UseQueryResult<NovesResponseData, NovesTranslateError>;
}

export default function NovesTxAssetFlows(props: FlowViewProps) {
  const { data: queryData, isPlaceholderData, isError } = props.data;

  const [ page, setPage ] = useState<number>(1);

  const ViewData = queryData ? NovesGenerateFlowViewData(queryData) : [];
  const chunkedViewData = _.chunk(ViewData, 10);

  const paginationProps: PaginationParams = {
    onNextPageClick: () => setPage(page + 1),
    onPrevPageClick: () => setPage(page - 1),
    resetPage: () => setPage(1),
    canGoBackwards: true,
    isLoading: isPlaceholderData,
    page: page,
    hasNextPage: Boolean(chunkedViewData[page]),
    hasPages: true,
    isVisible: true,
  };

  const data = chunkedViewData [page - 1];

  const actionBar = (
    <ActionBar mt={ -6 } pb={{ base: 6, md: 5 }} flexDir={{ base: 'column', md: 'initial' }} gap={{ base: '2', md: 'initial' }}>
      <Skeleton borderRadius="sm" isLoaded={ !isPlaceholderData } >
        <Box display="flex" alignItems="center" gap={ 1 }>
          <Text fontWeight="400" mr={ 1 }>
                Wallet
          </Text>
          <Hide above="md">
            <AddressEntity
              address={{ hash: queryData?.accountAddress || '' }}
              fontWeight="400"
              truncate={ 12 }
            />
          </Hide>
          <Show above="md">
            <AddressEntity
              address={{ hash: queryData?.accountAddress || '' }}
              fontWeight="400"
            />
          </Show>
        </Box>
      </Skeleton>
      <Pagination ml={{ base: 'auto', lg: 8 }} { ...paginationProps }/>
    </ActionBar>
  );

  const content = (
    <Box position="relative">
      <div className="flow-root">
        <Box
          display="inline-block"
          minW="full"
          verticalAlign="middle"
        >
          <Hide above="md" >
            { data?.length && <Divider borderColor="gray.200" mb={ 4 }/> }
            <VStack spacing={ 4 } divider={ <StackDivider borderColor="gray.200"/> }>
              { data?.map((item, i) => (
                <VStack spacing={ 3 } key={ i } align="start" w="full">
                  <Skeleton borderRadius="sm" isLoaded={ !isPlaceholderData } w="full">

                    <Box display="flex" >
                      <Icon
                        as={ lightning }
                        display="flex"
                        fontSize="xl"
                        mr="5px"
                        color="gray.500"
                        _dark={{ color: 'gray.400' }}
                      />
                      <Text fontSize="sm" fontWeight={ 500 }>
                        Action
                      </Text>
                    </Box>

                  </Skeleton>
                  <Skeleton borderRadius="sm" isLoaded={ !isPlaceholderData } maxW="100vw" w="full">
                    <NovesActionCard item={ item }/>
                  </Skeleton>
                  <Skeleton borderRadius="sm" isLoaded={ !isPlaceholderData } maxW="100vw" >
                    <NovesFromToComponent item={ item }/>
                  </Skeleton>
                </VStack>
              )) }
            </VStack>
          </Hide>

          <Show above="md">
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th fontWeight="bold" fontFamily="inherit">
                    Actions
                    </Th>
                    <Th fontWeight="bold" fontFamily="inherit" >
                    From/To
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  { data?.map((item, i) => (
                    <Tr key={ i }>
                      <Td px={ 3 } py={ 5 } fontSize="sm" borderColor="gray.200">
                        <Skeleton borderRadius="sm" isLoaded={ !isPlaceholderData } >
                          <NovesActionCard item={ item }/>
                        </Skeleton>
                      </Td>
                      <Td px={ 3 } py="18px" fontSize="sm" borderColor="gray.200" >
                        <Skeleton borderRadius="sm" isLoaded={ !isPlaceholderData }>
                          <NovesFromToComponent item={ item }/>
                        </Skeleton>
                      </Td>
                    </Tr>
                  )) }
                </Tbody>
              </Table>
            </TableContainer>
          </Show>
        </Box>
      </div>
    </Box>
  );

  return (
    <DataListDisplay
      isError={ isError }
      items={ data }
      emptyText="There are no transactions."
      content={ content }
      actionBar={ actionBar }
    />
  );
}
