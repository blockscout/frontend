import type { StyleProps } from '@chakra-ui/react';
import { Box, Link, Table, Tbody, Td, Th, Tr, Flex, useColorModeValue, useBoolean, Tooltip } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { AddressMudRecords, AddressMudRecordsFilter, AddressMudRecordsSorting } from 'types/api/address';

import { route } from 'nextjs-routes';

import capitalizeFirstLetter from 'lib/capitalizeFirstLetter';
import dayjs from 'lib/date/dayjs';
import useIsMobile from 'lib/hooks/useIsMobile';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';
import { default as Thead } from 'ui/shared/TheadSticky';

import AddressMudRecordsKeyFilter from './AddressMudRecordsKeyFilter';
import { getNameTypeText, getValueString } from './utils';

const COL_MIN_WIDTH = 180;
const COL_MIN_WIDTH_MOBILE = 140;
const CUT_COL_WIDTH = 36;
const MIN_CUT_COUNT = 2;

type Props = {
  data: AddressMudRecords;
  top: number;
  sorting?: AddressMudRecordsSorting;
  toggleSorting: (key: AddressMudRecordsSorting['sort']) => void;
  setFilters: React.Dispatch<React.SetStateAction<AddressMudRecordsFilter>>;
  filters: AddressMudRecordsFilter;
  toggleTableHasHorizontalScroll: () => void;
  scrollRef?: React.RefObject<HTMLDivElement>;
  hash: string;
}

const AddressMudRecordsTable = ({
  data,
  top,
  sorting,
  toggleSorting,
  filters,
  setFilters,
  toggleTableHasHorizontalScroll,
  scrollRef,
  hash,
}: Props) => {
  const totalColsCut = data.schema.key_names.length + data.schema.value_names.length;
  const isMobile = useIsMobile(false);
  const [ colsCutCount, setColsCutCount ] = React.useState<number>(isMobile ? MIN_CUT_COUNT : 0);
  const [ isOpened, setIsOpened ] = useBoolean(false);
  const [ hasCut, setHasCut ] = useBoolean(isMobile ? totalColsCut > MIN_CUT_COUNT : true);

  const containerRef = React.useRef<HTMLTableElement>(null);
  const tableRef = React.useRef<HTMLTableElement>(null);

  const router = useRouter();

  const toggleIsOpen = React.useCallback(() => {
    isOpened && tableRef.current?.scroll({ left: 0 });
    setIsOpened.toggle();
    toggleTableHasHorizontalScroll();
  }, [ setIsOpened, toggleTableHasHorizontalScroll, isOpened ]);

  const onRecordClick = React.useCallback((e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) {
      // Allow opening in a new tab/window with right-click or ctrl/cmd+click
      return;
    }

    e.preventDefault();

    const recordId = e.currentTarget.getAttribute('data-id');
    if (recordId) {
      router.push(
        { pathname: '/address/[hash]', query: { hash, tab: 'mud', table_id: data.table.table_id, record_id: recordId } },
        undefined,
        { shallow: true },
      );
    }
    scrollRef?.current?.scrollIntoView();
  }, [ router, scrollRef, hash, data.table.table_id ]);

  const handleFilterChange = React.useCallback((field: keyof AddressMudRecordsFilter) => (val: string) => {
    setFilters(prev => {
      const newVal = { ...prev };
      newVal[field] = val;
      return newVal;
    });
  }, [ setFilters ]);

  const onKeySortClick = React.useCallback(
    (e: React.MouseEvent) => toggleSorting('key' + e.currentTarget.getAttribute('data-id') as AddressMudRecordsSorting['sort']),
    [ toggleSorting ],
  );

  const keyBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  React.useEffect(() => {
    if (hasCut && !colsCutCount && containerRef.current) {
      const count = Math.floor((containerRef.current.getBoundingClientRect().width - CUT_COL_WIDTH) / COL_MIN_WIDTH);
      if (totalColsCut > MIN_CUT_COUNT && count - 1 < totalColsCut) {
        setColsCutCount(count - 1);
      } else {
        setHasCut.off();
      }
    }
  }, [ colsCutCount, data.schema, hasCut, setHasCut, totalColsCut ]);

  const colW = isMobile ? COL_MIN_WIDTH_MOBILE : COL_MIN_WIDTH;

  const keys = (isOpened || !hasCut) ? data.schema.key_names : data.schema.key_names.slice(0, colsCutCount);
  const values = (isOpened || !hasCut) ? data.schema.value_names : data.schema.value_names.slice(0, colsCutCount - data.schema.key_names.length);
  const colsCount = (isOpened || !hasCut) ? totalColsCut : colsCutCount;

  const tdStyles: StyleProps = {
    wordBreak: 'break-word',
    whiteSpace: 'normal',
    minW: `${ colW }px`,
    w: `${ 100 / colsCount }%`,
    verticalAlign: 'top',
    lineHeight: '20px',
  };

  const hasHorizontalScroll = isMobile || isOpened;

  if (hasCut && !colsCutCount) {
    return <Box w="100%" ref={ containerRef }></Box>;
  }

  const cutButton = (
    <Th width={ `${ CUT_COL_WIDTH }px ` } verticalAlign="baseline">
      <Tooltip label={ isOpened ? 'Hide columns' : 'Show all columns' }>
        <Link onClick={ toggleIsOpen } aria-label="show/hide columns">...</Link>
      </Tooltip>
    </Th>
  );

  return (
    // can't implement both horizontal table scroll and sticky header
    <Box maxW="100%" overflowX={ hasHorizontalScroll ? 'scroll' : 'unset' } whiteSpace="nowrap" ref={ tableRef }>
      <Table variant="simple" size="sm" style={{ tableLayout: 'fixed' }}>
        <Thead top={ hasHorizontalScroll ? 0 : top } display={ hasHorizontalScroll ? 'table' : 'table-header-group' } w="100%">
          <Tr >
            { keys.map((keyName, index) => {
              const text = getNameTypeText(keyName, data.schema.key_types[index]);
              return (
                <Th key={ keyName } { ...tdStyles }>
                  { index < 2 ? (
                    <Flex alignItems="center">
                      <Link
                        onClick={ onKeySortClick }
                        data-id={ index }
                        display="flex"
                        alignItems="start"
                        lineHeight="20px"
                        mr={ 2 }
                      >
                        { sorting?.sort === `key${ index }` && sorting.order && (
                          <Box minW="24px" w="24px" mr={ 2 }>
                            <IconSvg
                              name="arrows/east"
                              boxSize={ 5 }
                              transform={ sorting.order === 'asc' ? 'rotate(-90deg)' : 'rotate(90deg)' }
                            />
                          </Box>
                        ) }
                        { text }
                      </Link>
                      <Box minW="20px" w="20px">
                        <AddressMudRecordsKeyFilter
                          value={ filters[index === 0 ? 'filter_key0' : 'filter_key1'] }
                          title={ text }
                          columnName={ keyName }
                          handleFilterChange={ handleFilterChange(index === 0 ? 'filter_key0' : 'filter_key1') }
                        />
                      </Box>
                    </Flex>
                  ) : text }
                </Th>
              );
            }) }
            { values.map((valName, index) => (
              <Th key={ valName } { ...tdStyles }>
                { capitalizeFirstLetter(valName) } ({ data.schema.value_types[index] })
              </Th>
            )) }
            { hasCut && !isOpened && cutButton }
            <Th { ...tdStyles } w={ `${ colW }px` }>Modified</Th>
            { hasCut && isOpened && cutButton }
          </Tr>
        </Thead>
        <Tbody display={ hasHorizontalScroll ? 'table' : 'table-row-group' } w="100%">
          { data.items.map((item) => (
            <Tr key={ item.id }>
              { keys.map((keyName, index) => (
                <Td key={ keyName } backgroundColor={ keyBgColor } { ...tdStyles }>
                  { index === 0 ? (
                    <LinkInternal
                      onClick={ onRecordClick }
                      data-id={ item.id }
                      fontWeight={ 700 }
                      href={ route({ pathname: '/address/[hash]', query: { hash, tab: 'mud', table_id: data.table.table_id, record_id: item.id } }) }
                    >
                      { getValueString(item.decoded[keyName]) }
                    </LinkInternal>
                  ) : getValueString(item.decoded[keyName]) }
                  <CopyToClipboard text={ item.decoded[keyName] }/>
                </Td>
              )) }
              { values.map((valName) =>
                <Td key={ valName } { ...tdStyles }>{ getValueString(item.decoded[valName]) }</Td>) }
              { hasCut && !isOpened && <Td width={ `${ CUT_COL_WIDTH }px ` }></Td> }
              <Td { ...tdStyles } color="text_secondary" w={ `${ colW }px` }>{ dayjs(item.timestamp).format('lll') }</Td>
              { hasCut && isOpened && <Td width={ `${ CUT_COL_WIDTH }px ` }></Td> }
            </Tr>
          )) }
        </Tbody>
      </Table>
    </Box>
  );
};

export default AddressMudRecordsTable;
