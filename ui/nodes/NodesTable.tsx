import {
  Table,
  Tbody,
  Tr,
  Th,
  Hide,
  Skeleton,
  Show,
  HStack,
  Td,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import getQueryParamString from 'lib/router/getQueryParamString';
import { NODES } from 'stubs/nodes';
import { generateListStubOfBool } from 'stubs/utils';
import DataListDisplay from 'ui/shared/DataListDisplay';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import useQueryWithPagesOfBool from 'ui/shared/pagination/useQueryWithPagesOfBool';
import { default as Thead } from 'ui/shared/TheadSticky';

import { tableColumns } from './data';
import NodesTableBar from './NodesTableBar';
import NodesTableItem from './NodesTableItem';
import NodesTableItemMobile from './NodesTableItemMobile';

const PAGE_SIZE = 10;

const NodesTable: React.FC = () => {
  const router = useRouter();
  const searchStr = getQueryParamString(router.query.searchStr);

  const [ validatorStatus, setValidatorStatus ] = React.useState(
    getQueryParamString(router.query.validatorStatus) || 'All',
  );
  const [ searchTerm, setSearchTerm ] = React.useState<string>(searchStr ?? '');

  const { data, isError, pagination, isPlaceholderData, onFilterChange } =
    useQueryWithPagesOfBool({
      resourceName: 'nodes',
      filters: {
        pageSize: PAGE_SIZE,
        searchStr: searchTerm,
        validatorStatus:
          validatorStatus === 'All' ? undefined : validatorStatus,
      },
      options: {
        placeholderData: generateListStubOfBool<'nodes'>(NODES, 50, {
          hasNext: true,
          hasPrev: false,
          totalPage: 1,
          totalCount: '50',
        } as any),
      },
    });

  const handleSearchTermChange = React.useCallback(
    (val: string) => {
      onFilterChange({ searchStr: val });
      setSearchTerm(val);
    },
    [ onFilterChange ],
  );
  const handValidatorStatusChange = React.useCallback(
    (id: string) => {
      onFilterChange({ validatorStatus: id === 'All' ? undefined : id });
      setValidatorStatus(id);
    },
    [ onFilterChange ],
  );

  const dataSource = React.useMemo(() => {
    return data?.items ?? [];
  }, [ data?.items ]);

  const tableCol = (
    <Thead top={ pagination.isVisible ? 80 : 0 }>
      <Tr>
        { tableColumns.map((item) => {
          return (
            <Th key={ item.id } width={ item.width } textAlign={ item.textAlgin }>
              { item.label }
            </Th>
          );
        }) }
      </Tr>
    </Thead>
  );

  const tableBody = (
    <Tbody>
      { dataSource.map((item, index) => {
        if (!item.validatorAddress.trim()) {
          return (
            <Tr key={ index } >
              { tableColumns.map((col) => {
                return (
                  <Td
                    key={ col.id }
                    width={ col.width }
                    textAlign={ col.textAlgin }
                  >
                    <Skeleton
                      isLoaded={ !isPlaceholderData }
                      display="inline-block"
                      minW={ 10 }
                      lineHeight="24px"
                    >
                      { col.render?.(item, index) }
                    </Skeleton>
                  </Td>
                );
              }) }
            </Tr>
          );
        }
        return (
          <NodesTableItem
            key={ index }
            data={ item }
            index={ index }
            isLoaded={ !isPlaceholderData }
          ></NodesTableItem>
        );
      }) }
    </Tbody>
  );

  const tableBodyForMobile = (
    <>
      { dataSource.map((item, index) => {
        if (!item.validatorAddress.trim()) {
          return (
            <ListItemMobile key={ index } rowGap={ 3 }>
              { tableColumns.map((col) => {
                const text = col.render?.(item, index);

                return (
                  <HStack key={ col.id } spacing={ 3 }>
                    <Skeleton
                      isLoaded={ !isPlaceholderData }
                      fontSize="sm"
                      fontWeight={ 500 }
                    >
                      { col.label }
                    </Skeleton>
                    <Skeleton
                      isLoaded={ !isPlaceholderData }
                      fontSize="sm"
                      ml="auto"
                      minW={ 10 }
                      color="text_secondary"
                    >
                      <span>{ text }</span>
                    </Skeleton>
                  </HStack>
                );
              }) }
            </ListItemMobile>
          );
        }
        return (
          <NodesTableItemMobile
            key={ index }
            data={ item }
            index={ index }
            isLoaded={ !isPlaceholderData }
          />
        );
      }) }
    </>
  );

  const content = (
    <>
      <Hide below="lg" ssr={ false }>
        <Table variant="simple" size="sm">
          { tableCol }
          { tableBody }
        </Table>
      </Hide>
      <Show below="lg" ssr={ false }>
        <Table variant="simple" size="sm">
          { tableBodyForMobile }
        </Table>
      </Show>
    </>
  );

  return (
    <div style={{ paddingTop: '24px' }}>
      <NodesTableBar
        pagination={ pagination }
        searchTerm={ searchTerm }
        onSearchChange={ handleSearchTermChange }
        validatorStatus={ validatorStatus ?? 'All' }
        onValidatorStatusChange={ handValidatorStatusChange }
      />
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no nodes."
        content={ content }
      />
    </div>
  );
};

export default NodesTable;
