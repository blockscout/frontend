import {
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Thead,
  Box,
  Text,
  Tag,
  TagCloseButton,
  chakra,
  Flex,
  TagLabel,
  HStack,
  Link,
  // Alert,
  // Spinner
} from '@chakra-ui/react';
import omit from 'lodash/omit';
import { useRouter } from 'next/router';
import React from 'react';
// import ReCaptcha from 'react-google-recaptcha';

import type { AdvancedFilterParams } from 'types/api/advancedFilter';
import { ADVANCED_FILTER_TYPES, ADVANCED_FILTER_AGES } from 'types/api/advancedFilter';

// import useApiFetch from 'lib/api/useApiFetch';
import useApiQuery from 'lib/api/useApiQuery';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import dayjs from 'lib/date/dayjs';
import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import getValuesArrayFromQuery from 'lib/getValuesArrayFromQuery';
// import useToast from 'lib/hooks/useToast';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ADVANCED_FILTER_ITEM } from 'stubs/advancedFilter';
import { generateListStub } from 'stubs/utils';
import ColumnsButton from 'ui/advancedFilter/ColumnsButton';
import FilterByColumn from 'ui/advancedFilter/FilterByColumn';
import ItemByColumn from 'ui/advancedFilter/ItemByColumn';
import { getDurationFromAge, getFilterTags } from 'ui/advancedFilter/lib';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import IconSvg from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
// import config from 'configs/app';

export type ColumnsIds = 'tx_hash' | 'type' | 'method' | 'age' | 'from' | 'or_and' | 'to' | 'amount' | 'asset' | 'fee';

type TxTableColumn = {
  id: ColumnsIds;
  name: string;
  width: string;
  isNumeric?: boolean;
}
export const TABLE_COLUMNS: Array<TxTableColumn> = [
  {
    id: 'tx_hash',
    name: 'Tx hash',
    width: '180px',
  },
  {
    id: 'type',
    name: 'Type',
    width: '160px',
  },
  {
    id: 'method',
    name: 'Method',
    width: '160px',
  },
  {
    id: 'age',
    name: 'Age',
    width: '80px',
  },
  {
    id: 'from',
    name: 'From',
    width: '160px',
  },
  {
    id: 'or_and',
    name: '',
    width: '60px',
  },
  {
    id: 'to',
    name: 'To',
    width: '160px',
  },
  {
    id: 'amount',
    name: 'Amount',
    isNumeric: true,
    width: '150px',
  },
  {
    id: 'asset',
    name: 'Asset',
    width: '120px',
  },
  {
    id: 'fee',
    name: 'Fee',
    width: '120px',
  },
] as const;

const COLUMNS_CHECKED = {} as Record<ColumnsIds, boolean>;
TABLE_COLUMNS.forEach(c => COLUMNS_CHECKED[c.id] = true);

const AdvancedFilter = () => {
  const router = useRouter();
  // const apiFetch = useApiFetch();
  // const toast = useToast();

  const [ filters, setFilters ] = React.useState<AdvancedFilterParams>(() => {
    const age = getFilterValueFromQuery(ADVANCED_FILTER_AGES, router.query.age);
    return {
      tx_types: getFilterValuesFromQuery(ADVANCED_FILTER_TYPES, router.query.tx_types),
      methods: getValuesArrayFromQuery(router.query.methods),
      methods_names: getValuesArrayFromQuery(router.query.methods_names),
      amount_from: getQueryParamString(router.query.amount_from),
      amount_to: getQueryParamString(router.query.amount_to),
      age,
      age_to: age ? dayjs().toISOString() : getQueryParamString(router.query.age_to),
      age_from: age ? dayjs((dayjs().valueOf() - getDurationFromAge(age))).toISOString() : getQueryParamString(router.query.age_from),
      token_contract_address_hashes_to_exclude: getValuesArrayFromQuery(router.query.token_contract_address_hashes_to_exclude),
      token_contract_symbols_to_exclude: getValuesArrayFromQuery(router.query.token_contract_symbols_to_exclude),
      token_contract_address_hashes_to_include: getValuesArrayFromQuery(router.query.token_contract_address_hashes_to_include),
      token_contract_symbols_to_include: getValuesArrayFromQuery(router.query.token_contract_symbols_to_include),
      to_address_hashes_to_include: getValuesArrayFromQuery(router.query.to_address_hashes_to_include),
      from_address_hashes_to_include: getValuesArrayFromQuery(router.query.from_address_hashes_to_include),
      to_address_hashes_to_exclude: getValuesArrayFromQuery(router.query.to_address_hashes_to_exclude),
      from_address_hashes_to_exclude: getValuesArrayFromQuery(router.query.from_address_hashes_to_exclude),
    };
  });

  const [ columns, setColumns ] = React.useState<Record<ColumnsIds, boolean>>(COLUMNS_CHECKED);
  const { data, isError, isLoading, pagination, onFilterChange, isPlaceholderData } = useQueryWithPages({
    resourceName: 'advanced_filter',
    filters,
    options: {
      placeholderData: generateListStub<'advanced_filter'>(
        ADVANCED_FILTER_ITEM,
        50,
        {
          next_page_params: {
            block_number: 5867485,
            internal_transaction_index: 0,
            items_count: 50,
            token_transfer_index: null,
            transaction_index: 2,
          },
          search_params: {
            tokens: {},
            methods: {},
          },
        },
      ),
    },
  });

  // maybe don't need to prefetch, but on dev sepolia those requests take several seconds.
  useApiQuery('tokens', { queryParams: { limit: '7', q: '' }, queryOptions: { refetchOnMount: false } });
  useApiQuery('advanced_filter_methods', { queryParams: { q: '' }, queryOptions: { refetchOnMount: false } });

  // const downloadCSV = React.useCallback((reCaptchaToken: string) => {
  //   apiFetch<'advanced_filter_csv', unknown, unknown>('advanced_filter_csv', {
  //     queryParams: { recaptcha_response: reCaptchaToken },
  //   })
  //     .then(() => {
  //       toast({
  //         title: 'Please wait',
  //         description: 'Download will start when data is ready',
  //         status: 'warning',
  //       });
  //     })
  //     .catch(() => {
  //       toast({
  //         title: 'Error',
  //         description: 'Unable to download CSV',
  //         status: 'warning',
  //       });
  //     });
  // }, [ apiFetch, toast ]);

  // const handleReCaptchaChange = React.useCallback((token: string | null) => {
  //   if (token) {
  //     downloadCSV(token);
  //   }
  // }, [ downloadCSV ]);

  const handleFilterChange = React.useCallback((field: keyof AdvancedFilterParams, val: unknown) => {
    setFilters(prevState => {
      const newState = { ...prevState };
      // fixme
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:
      newState[field] = val;
      onFilterChange(newState.age ? omit(newState, [ 'age_from', 'age_to' ]) : newState);
      return newState;
    });
  }, [ onFilterChange ]);

  const onClearFilter = React.useCallback((key: keyof AdvancedFilterParams) => () => {
    if (key === 'methods') {
      handleFilterChange('methods_names', undefined);
    }
    if (key === 'token_contract_address_hashes_to_exclude') {
      handleFilterChange('token_contract_symbols_to_exclude', undefined);
    }
    if (key === 'token_contract_address_hashes_to_include') {
      handleFilterChange('token_contract_symbols_to_include', undefined);
    }
    if (key === 'age') {
      handleFilterChange('age_from', undefined);
      handleFilterChange('age_to', undefined);
    }
    handleFilterChange(key, undefined);
  }, [ handleFilterChange ]);

  const clearAllFilters = React.useCallback(() => {
    setFilters({});
    onFilterChange({});
  }, [ onFilterChange ]);

  const columnsToShow = React.useMemo(() => {
    return TABLE_COLUMNS.filter(c => columns[c.id]);
  }, [ columns ]);

  if (isLoading) {
    return null;
  }

  const filterTags = getFilterTags(filters);

  const content = (
    <AddressHighlightProvider>
      <Box maxW="100%" overflowX="scroll" whiteSpace="nowrap">
        <Table variant="simple" style={{ tableLayout: 'fixed' }} minWidth="950px" size="xs" w="100%">
          <Thead w="100%" display="table">
            <Tr>
              { columnsToShow.map(column => {
                return (
                  <Th
                    key={ column.id }
                    isNumeric={ column.isNumeric }
                    minW={ column.width }
                    w={ column.width }
                    wordBreak="break-word"
                    whiteSpace="normal"
                  >
                    { Boolean(column.name) && <chakra.span mr={ 2 } lineHeight="24px">{ column.name }</chakra.span> }
                    <FilterByColumn
                      column={ column.id }
                      columnName={ column.name }
                      handleFilterChange={ handleFilterChange }
                      filters={ filters }
                      searchParams={ data?.search_params }
                      isLoading={ isPlaceholderData }
                    />
                  </Th>
                );
              }) }
            </Tr>
          </Thead>
          <Tbody w="100%" display="table">
            { data?.items.map((item, index) => (
              <Tr key={ item.hash + String(index) }>
                { columnsToShow.map(column => (
                  <Td
                    key={ item.hash + column.id }
                    isNumeric={ column.isNumeric }
                    minW={ column.width }
                    maxW={ column.width }
                    w={ column.width }
                    wordBreak="break-word"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textAlign={ column.id === 'or_and' ? 'center' : 'start' }
                  >
                    <ItemByColumn item={ item } column={ column.id } isLoading={ isPlaceholderData }/>
                  </Td>
                )) }
              </Tr>
            )) }
          </Tbody>
        </Table>
      </Box>
    </AddressHighlightProvider>
  );

  const actionBar = (
    <ActionBar mt={ -6 }>
      <ColumnsButton columns={ columns } onChange={ setColumns }/>
      { /* { config.services.reCaptcha.siteKey && (
        <ReCaptcha
          className="recaptcha"
          sitekey={ config.services.reCaptcha.siteKey }
          onChange={ handleReCaptchaChange }
        />
      ) } */ }
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  return (
    <>
      <PageTitle
        title="Advanced filter"
        withTextAd
      />
      <Flex mb={ 4 } justifyContent="space-between" alignItems="start">
        <Text fontSize="lg" mr={ 3 } lineHeight="24px" w="100px">Filtered by:</Text>
        { filterTags.length !== 0 && (
          <Link onClick={ clearAllFilters } display="flex" alignItems="center" justifyContent="end" gap={ 2 } fontSize="sm" w="150px">
            <IconSvg name="repeat" boxSize={ 5 }/>
            Reset filters
          </Link>
        ) }
      </Flex>
      <HStack gap={ 2 } flexWrap="wrap" mb={ 6 }>
        { filterTags.map(t => (
          <Tag key={ t.name } colorScheme="blue" display="inline-flex">
            <TagLabel>
              <chakra.span color="text_secondary">{ t.name }: </chakra.span>
              <chakra.span color="text">{ t.value }</chakra.span>
            </TagLabel>
            <TagCloseButton onClick={ onClearFilter(t.key) }/>
          </Tag>
        )) }
        { filterTags.length === 0 && (
          <>
            <Tag colorScheme="blue" display="inline-flex">
              <TagLabel>
                <chakra.span color="text_secondary">Type: </chakra.span>
                <chakra.span color="text">All</chakra.span>
              </TagLabel>
            </Tag>
            <Tag colorScheme="blue" display="inline-flex">
              <TagLabel>
                <chakra.span color="text_secondary">Age: </chakra.span>
                <chakra.span color="text">7d</chakra.span>
              </TagLabel>
            </Tag>
          </>
        ) }
      </HStack>
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no transactions."
        content={ content }
        actionBar={ actionBar }
        filterProps={{
          hasActiveFilters: Object.values(filters).some(Boolean),
          emptyFilteredText: 'No match found for current filter',
        }}
      />
    </>
  );
};

export default AdvancedFilter;
