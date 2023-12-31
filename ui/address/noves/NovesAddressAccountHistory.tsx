import { Box, Hide, Show, Skeleton, StackDivider, Table, TableContainer,
  Tbody, Td, Text, Th, Thead, Tr, VStack, useColorModeValue } from '@chakra-ui/react';
import utc from 'dayjs/plugin/utc';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React from 'react';

import type { NovesHistorySentReceivedFilter } from 'types/novesApi';
import { NovesHistorySentReceivedFilterValues } from 'types/novesApi';

import lightning from 'icons/lightning.svg';
import dayjs from 'lib/date/dayjs';
import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import { NOVES_TRANSLATE } from 'stubs/noves/Novestranslate';
import ActionBar from 'ui/shared/ActionBar';
import Icon from 'ui/shared/chakra/Icon';
import DataListDisplay from 'ui/shared/DataListDisplay';
import LinkInternal from 'ui/shared/LinkInternal';
import NovesFromToComponent from 'ui/shared/Noves/NovesFromToComponent';
import { NovesGetFromToValue } from 'ui/shared/Noves/utils';
import Pagination from 'ui/shared/pagination/Pagination';

import NovesAccountHistoryFilter from './NovesAccountHistoryFilter';
import useFetchHistoryWithPages from './NovesUseFetchHistoryWithPages';
import { generateHistoryStub } from './utils';

dayjs.extend(utc);

const getFilterValue = (getFilterValueFromQuery<NovesHistorySentReceivedFilter>).bind(null, NovesHistorySentReceivedFilterValues);

type Props = {
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const NovesAddressAccountHistory = ({ scrollRef }: Props) => {
  const router = useRouter();

  const currentAddress = getQueryParamString(router.query.hash).toLowerCase();

  const addressColor = useColorModeValue('gray.500', 'whiteAlpha.600');

  const [ filterValue, setFilterValue ] = React.useState<NovesHistorySentReceivedFilter>(getFilterValue(router.query.filter));
  const { data, isError, pagination, isPlaceholderData } = useFetchHistoryWithPages({
    address: currentAddress,
    scrollRef,
    options: {
      placeholderData: generateHistoryStub(NOVES_TRANSLATE, 10, { hasNextPage: true, pageSize: 10, pageNumber: 1 }),
    },
  });

  const handleFilterChange = React.useCallback((val: string | Array<string>) => {

    const newVal = getFilterValue(val);
    setFilterValue(newVal);
  }, [ ]);

  const actionBar = (
    <ActionBar mt={ -6 } pb={{ base: 6, md: 5 }}>
      <NovesAccountHistoryFilter
        defaultFilter={ filterValue }
        onFilterChange={ handleFilterChange }
        isActive={ Boolean(filterValue) }
        isLoading={ pagination.isLoading }
      />

      <Pagination ml={{ base: 'auto', lg: 8 }} { ...pagination }/>
    </ActionBar>
  );

  const filteredData = isPlaceholderData ? data?.items : data?.items.filter(i => filterValue ? NovesGetFromToValue(i, currentAddress) === filterValue : i);

  const content = (
    <Box position="relative">
      <Hide above="md">
        <VStack spacing={ 4 } divider={ <StackDivider borderColor="gray.200"/> }>
          { filteredData?.map((tx, i) => (
            <VStack spacing={ 3 } key={ i } align="start" w="full">
              <Skeleton borderRadius="sm" isLoaded={ !isPlaceholderData } w="full">
                <Box display="flex" justifyContent="space-between" w="full">
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
                  <Text color={ addressColor } fontSize="sm" fontWeight={ 500 }>
                    { dayjs(tx.rawTransactionData.timestamp * 1000).utc().fromNow() }
                  </Text>
                </Box>
              </Skeleton>
              <Skeleton borderRadius="sm" isLoaded={ !isPlaceholderData }>
                <LinkInternal href={ `/tx/${ tx.rawTransactionData.transactionHash }` }>
                  <Text as="span" color="link" fontWeight="bold" whiteSpace="break-spaces" wordBreak="break-word">
                    { tx.classificationData.description }
                  </Text>
                </LinkInternal>
              </Skeleton>
              <Skeleton borderRadius="sm" isLoaded={ !isPlaceholderData }>
                <NovesFromToComponent txData={ tx } currentAddress={ currentAddress }/>
              </Skeleton>
            </VStack>
          )) }
        </VStack>
      </Hide>

      <Show above="md">
        <TableContainer maxWidth="full">
          <Table variant="simple" style={{ tableLayout: 'auto' }} >
            <Thead>
              <Tr>
                <Th fontWeight="bold" fontFamily="inherit" minW={{ xl: '100px' }}>
                  Age
                </Th>
                <Th fontWeight="bold" fontFamily="inherit" maxW="full" w="full">
                  Action
                </Th>
                <Th fontWeight="bold" fontFamily="inherit">
                  From/To
                </Th>
              </Tr>
            </Thead>
            <Tbody maxWidth="full">
              <AnimatePresence initial={ false }>
                { filteredData?.map((tx, i) => (
                  <Tr key={ i } as={ motion.tr }
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transitionDuration="normal"
                    transitionTimingFunction="linear">
                    <Td px={ 3 } py="18px" color={ addressColor } fontSize="sm" borderColor="gray.200">
                      <Skeleton borderRadius="sm" flexShrink={ 0 } isLoaded={ !isPlaceholderData }>
                        <Text as="span">
                          { dayjs(tx.rawTransactionData.timestamp * 1000).utc().fromNow() }
                        </Text>
                      </Skeleton>
                    </Td>
                    <Td px={ 3 } py="18px" fontSize="sm" borderColor="gray.200" >
                      <Skeleton borderRadius="sm" isLoaded={ !isPlaceholderData }>
                        <Box display="flex">
                          <Icon
                            as={ lightning }
                            display="flex"
                            fontSize="xl"
                            mr="8px"
                            color="gray.500"
                            _dark={{ color: 'gray.400' }}
                          />
                          <LinkInternal href={ `/tx/${ tx.rawTransactionData.transactionHash }` }>
                            <Text as="span" color="link" fontWeight="bold" whiteSpace="break-spaces" wordBreak="break-word">
                              { tx.classificationData.description }
                            </Text>
                          </LinkInternal>
                        </Box>
                      </Skeleton>
                    </Td>
                    <Td px={ 3 } py="18px" fontSize="sm" borderColor="gray.200" >
                      <Skeleton borderRadius="sm" flexShrink={ 0 } isLoaded={ !isPlaceholderData }>
                        <NovesFromToComponent txData={ tx } currentAddress={ currentAddress }/>
                      </Skeleton>
                    </Td>
                  </Tr>
                )) }
              </AnimatePresence>
            </Tbody>
          </Table>
        </TableContainer>
      </Show>
    </Box>
  );

  return (
    <>
      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ scrollRef }></Box>

      <DataListDisplay
        isError={ isError }
        items={ filteredData }
        emptyText="There are no transactions."
        content={ content }
        actionBar={ actionBar }
        filterProps={{
          hasActiveFilters: Boolean(filterValue),
          emptyFilteredText: 'No match found for current filter',
        }}
      />
    </>
  );
};

export default NovesAddressAccountHistory;
