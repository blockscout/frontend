import {
  Table,
  Tbody,
  Tr,
  Th,
  Hide,
  Td,
  Skeleton,
  Show,
  HStack,
} from '@chakra-ui/react';
import React from 'react';

import { PROVIDERS } from 'stubs/providers';
import { generateListStubOfBool } from 'stubs/utils';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPagesOfBool from 'ui/shared/pagination/useQueryWithPagesOfBool';
import { default as Thead } from 'ui/shared/TheadSticky';

import { tableColumns } from './data';

const PAGE_SIZE = 50;

const ProvidersTable = () => {
  const { data, isError, pagination, isPlaceholderData } =
    useQueryWithPagesOfBool({
      resourceName: 'providers',
      filters: { pageSize: PAGE_SIZE },
      options: {
        placeholderData: generateListStubOfBool<'providers'>(PROVIDERS, 50, {
          hasNext: true,
          hasPrev: false,
          totalPage: 1,
          totalCount: '50',
        } as any),
      },
    });

  const actionBar = pagination.isVisible && (
    <ActionBar>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
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
        return (
          <Tr key={ index }>
            { tableColumns.map((col) => {
              return (
                <Td key={ col.id } width={ col.width } textAlign={ col.textAlgin }>
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
      }) }
    </Tbody>
  );

  const tableBodyForMobile = (
    <>
      { dataSource.map((item, index) => {
        return (
          <ListItemMobile key={ index } rowGap={ 3 }>
            { tableColumns.map((col) => {
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
                    <span>{ col.render?.(item) }</span>
                  </Skeleton>
                </HStack>
              );
            }) }
          </ListItemMobile>
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
      <DataListDisplay
        isError={ isError }
        items={ dataSource }
        emptyText="There are no providers."
        content={ content }
        actionBar={ actionBar }
      />
    </div>
  );
};

export default ProvidersTable;
