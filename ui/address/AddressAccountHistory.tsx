import { Box, Hide, Show, Skeleton, StackDivider, Table, TableContainer,
  Tbody, Td, Text, Th, Thead, Tr, VStack, useColorModeValue } from '@chakra-ui/react';
import utc from 'dayjs/plugin/utc';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React from 'react';

import type { HistorySentReceivedFilter } from 'types/translateApi';
import { HistorySentReceivedFilterValues } from 'types/translateApi';

import lightning from 'icons/lightning.svg';
import dayjs from 'lib/date/dayjs';
import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TRANSLATE } from 'stubs/translate';
import { getFromTo } from 'ui/shared/accountHistory/FromToComponent';
import ActionBar from 'ui/shared/ActionBar';
import Icon from 'ui/shared/chakra/Icon';
import DataListDisplay from 'ui/shared/DataListDisplay';
import LinkInternal from 'ui/shared/LinkInternal';
import Pagination from 'ui/shared/pagination/Pagination';

import AccountHistoryFilter from './history/AccountHistoryFilter';
import useFetchHistoryWithPages from './history/useFetchHistoryWithPages';
import { generateHistoryStub } from './history/utils';

dayjs.extend(utc);

const getFilterValue = (getFilterValueFromQuery<HistorySentReceivedFilter>).bind(null, HistorySentReceivedFilterValues);

type Props = {
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const AddressAccountHistory = ({ scrollRef }: Props) => {
  const router = useRouter();

  const currentAddress = getQueryParamString(router.query.hash).toLowerCase();

  const addressColor = useColorModeValue('gray.500', 'whiteAlpha.600');

  const [ filterValue, setFilterValue ] = React.useState<HistorySentReceivedFilter>(getFilterValue(router.query.filter));
  const { data, isError, pagination, isPlaceholderData } = useFetchHistoryWithPages({
    address: currentAddress,
    scrollRef,
    options: {
      placeholderData: generateHistoryStub(TRANSLATE, 10, { hasNextPage: true, pageSize: 10, pageNumber: 1 }),
    },
  });

  const handleFilterChange = React.useCallback((val: string | Array<string>) => {

    const newVal = getFilterValue(val);
    setFilterValue(newVal);
  }, [ ]);

  const actionBar = (
    <ActionBar mt={ -6 } pb={{ base: 6, md: 5 }}>
      <AccountHistoryFilter
        defaultFilter={ filterValue }
        onFilterChange={ handleFilterChange }
        isActive={ Boolean(filterValue) }
        isLoading={ pagination.isLoading }
      />

      <Pagination ml={{ base: 'auto', lg: 8 }} { ...pagination }/>
    </ActionBar>
  );

  const filteredData = isPlaceholderData ? data?.items : data?.items.filter(i => filterValue ? getFromTo(i, currentAddress, true) === filterValue : i);

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
                      color="#718096"
                      _dark={{ color: '#92a2bb' }}
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
                { getFromTo(tx, currentAddress) }
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
                            color="#718096"
                            _dark={{ color: '#92a2bb' }}
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
                        { getFromTo(tx, currentAddress) }
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

export default AddressAccountHistory;
