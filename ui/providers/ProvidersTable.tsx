import {
  Table,
  Tbody,
  Tr,
  Th,
  Hide,
  Show,
} from "@chakra-ui/react";
import React from "react";

import { PROVIDERS } from "stubs/providers";
import { generateListStubOfBool } from "stubs/utils";
import ActionBar from "ui/shared/ActionBar";
import DataListDisplay from "ui/shared/DataListDisplay";
import Pagination from "ui/shared/pagination/Pagination";
import useQueryWithPagesOfBool from "ui/shared/pagination/useQueryWithPagesOfBool";
import { default as Thead } from "ui/shared/TheadSticky";

import { tableColumns } from "./data";
import ProviderListItem from "./ProviderListItem";
import ProviderTableItem from "./ProviderTableItem";

const PAGE_SIZE = 50;

const ProvidersTable = () => {
  const { data, isError, pagination, isPlaceholderData } =
    useQueryWithPagesOfBool({
      resourceName: "providers",
      filters: { pageSize: PAGE_SIZE },
      options: {
        placeholderData: generateListStubOfBool<"providers">(PROVIDERS, 50, {
          hasNext: true,
          hasPrev: false,
          totalPage: 1,
          totalCount: "50",
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
          <ProviderTableItem
            key={ index }
            provider={ item }
            isLoaded={ !isPlaceholderData }
          />
        );
      }) }
    </Tbody>
  );

  const tableBodyForMobile = (
    <>
      { dataSource.map((item, index) => {
        return (
          <ProviderListItem
            key={ index }
            provider={ item }
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
    <div style={{ paddingTop: "24px" }}>
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
