// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import getNextSortValue from 'src/shared/sort/get-next-sort-value';
import { collator } from 'src/shared/texts/collator';

import type { GridTableColumn } from 'src/toolkit/chakra/grid-table';
import {
  GridTableBody,
  GridTableCell,
  GridTableColumnHeader,
  GridTableFullWidthRow,
  GridTableHeader,
  GridTableRoot,
  GridTableRow,
  GridTableScrollBox,
} from 'src/toolkit/chakra/grid-table';
import { TableColumnHeader, TableHeaderSticky, TableRoot, TableRow, TableCell, TableBody, TableColumnHeaderSortable } from 'src/toolkit/chakra/table';

import { Section, Container, SectionHeader, SamplesStack, Sample } from '../parts';

const ITEMS = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99 },
  { id: 2, name: 'Coffee Maker', category: 'Home Appliances', price: 49.99 },
  { id: 3, name: 'Desk Chair', category: 'Furniture', price: 150.0 },
  { id: 4, name: 'Smartphone', category: 'Electronics', price: 799.99 },
  { id: 5, name: 'Headphones', category: 'Accessories', price: 199.99 },
];

type Item = typeof ITEMS[number];

interface GridColumn extends GridTableColumn {
  readonly name: string;
}

const GRID_COLUMNS: ReadonlyArray<GridColumn> = [
  { id: 'name', name: 'Product' },
  { id: 'description', name: 'Description', maxWidth: '240px' },
  { id: 'category', name: 'Category' },
  { id: 'price', name: 'Price', isNumeric: true },
];

const GRID_ROWS_NUM = 30;

const GRID_ITEMS = Array.from({ length: GRID_ROWS_NUM }, (_, index) => {
  const item = ITEMS[index % ITEMS.length];
  return {
    ...item,
    id: index + 1,
    description: `${ item.name } in the ${ item.category } category, with a description long enough to truncate in a capped column`,
  };
});

type SortField = 'category' | 'price';
type SortValue = 'category-asc' | 'category-desc' | 'price-asc' | 'price-desc' | 'default';

const SORT_SEQUENCE: Record<SortField, Array<SortValue>> = {
  category: [ 'category-desc', 'category-asc', 'default' ],
  price: [ 'price-desc', 'price-asc', 'default' ],
};

const TableShowcase = () => {
  const [ sort, setSort ] = React.useState<SortValue>('default');

  const handleSortToggle = React.useCallback((sortField: string) => {
    const value = getNextSortValue<SortField, SortValue>(SORT_SEQUENCE, sortField as SortField)(sort);
    setSort(value);
  }, [ sort, setSort ]);

  const sortFn = (a: Item, b: Item) => {
    if (sort === 'category-asc') {
      return collator.compare(a.category, b.category);
    }
    if (sort === 'category-desc') {
      return collator.compare(b.category, a.category);
    }
    if (sort === 'price-asc') {
      return a.price - b.price;
    }
    if (sort === 'price-desc') {
      return b.price - a.price;
    }
    return 0;
  };

  return (
    <Container value="table">
      <Section>
        <SectionHeader>Variant</SectionHeader>
        <SamplesStack >
          <Sample label="variant: line">
            <TableRoot>
              <TableHeaderSticky>
                <TableRow>
                  <TableColumnHeader>Product</TableColumnHeader>
                  <TableColumnHeaderSortable
                    sortField="category"
                    sortValue={ sort }
                    onSortToggle={ handleSortToggle }
                  >
                    Category
                  </TableColumnHeaderSortable>
                  <TableColumnHeaderSortable
                    sortField="price"
                    sortValue={ sort }
                    onSortToggle={ handleSortToggle }
                    isNumeric
                  >
                    Price
                  </TableColumnHeaderSortable>
                </TableRow>
              </TableHeaderSticky>
              <TableBody>
                { ITEMS.slice().sort(sortFn).map((item) => (
                  <TableRow key={ item.id }>
                    <TableCell>{ item.name }</TableCell>
                    <TableCell>{ item.category }</TableCell>
                    <TableCell isNumeric>{ item.price }</TableCell>
                  </TableRow>
                )) }
              </TableBody>
            </TableRoot>
          </Sample>
        </SamplesStack>
      </Section>
      <Section>
        <SectionHeader>Grid</SectionHeader>
        <SamplesStack>
          <Sample label="grid" justifySelf="stretch" w="500px">
            <GridTableScrollBox maxH="400px" w="100%">
              <GridTableRoot columns={ GRID_COLUMNS }>
                <GridTableHeader>
                  <GridTableRow>
                    { GRID_COLUMNS.map((column, index) => (
                      <GridTableColumnHeader key={ column.id } columnIndex={ index }>{ column.name }</GridTableColumnHeader>
                    )) }
                  </GridTableRow>
                </GridTableHeader>
                <GridTableBody>
                  <GridTableFullWidthRow>Full-width row spanning every column</GridTableFullWidthRow>
                  { GRID_ITEMS.map((item) => (
                    <GridTableRow key={ item.id }>
                      <GridTableCell columnIndex={ 0 }>{ item.name }</GridTableCell>
                      <GridTableCell columnIndex={ 1 }>
                        <Box truncate>{ item.description }</Box>
                      </GridTableCell>
                      <GridTableCell columnIndex={ 2 }>{ item.category }</GridTableCell>
                      <GridTableCell columnIndex={ 3 }>{ item.price }</GridTableCell>
                    </GridTableRow>
                  )) }
                </GridTableBody>
              </GridTableRoot>
            </GridTableScrollBox>
            <Box h="1000px"/>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(TableShowcase);
