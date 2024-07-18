import type { StyleProps } from '@chakra-ui/react';
import { Box, Link, Table, Tbody, Td, Th, Tr, Flex, useColorModeValue, useBoolean } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { AddressMudRecords, AddressMudRecordsFilter, AddressMudRecordsSorting } from 'types/api/address';

import capitalizeFirstLetter from 'lib/capitalizeFirstLetter';
import dayjs from 'lib/date/dayjs';
import IconSvg from 'ui/shared/IconSvg';
import { default as Thead } from 'ui/shared/TheadSticky';

import AddressMudRecordsKeyFilter from './AddressMudRecordsKeyFilter';
import { getNameTypeText } from './utils';

const COL_MIN_WIDTH = 180;
const CUT_COL_WIDTH = 36;

type Props = {
  data: AddressMudRecords;
  top: number;
  sorting?: AddressMudRecordsSorting;
  toggleSorting: (key: AddressMudRecordsSorting['sort']) => void;
  setFilters: React.Dispatch<React.SetStateAction<AddressMudRecordsFilter>>;
  filters: AddressMudRecordsFilter;
}

const AddressMudRecordsTable = ({ data, top, sorting, toggleSorting, filters, setFilters }: Props) => {
  const [ colsCutCount, setColsCutCount ] = React.useState<number>(0);
  const [ isOpened, setIsOpened ] = useBoolean(false);
  const [ hasCut, setHasCut ] = useBoolean(true);

  const tableRef = React.useRef<HTMLTableElement>(null);

  const router = useRouter();
  const onRecordClick = React.useCallback((e: React.MouseEvent) => {
    const newQuery = {
      ...router.query,
      record_id: e.currentTarget.getAttribute('data-id') as string,
    };
    router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
  }, [ router ]);

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
    if (hasCut && !colsCutCount && tableRef.current) {
      const count = Math.floor((tableRef.current.getBoundingClientRect().width - CUT_COL_WIDTH) / COL_MIN_WIDTH);
      const total = data.schema.key_names.length + data.schema.value_names.length;
      if (total > 2 && count - 1 < total) {
        setColsCutCount(count - 1);
      } else {
        setHasCut.off();
      }
    }
  }, [ colsCutCount, data.schema, hasCut, setHasCut ]);

  const cutWidth = `${ CUT_COL_WIDTH }px `;

  const tdStyles: StyleProps = {
    wordBreak: 'break-all',
    whiteSpace: 'normal',
    minW: `${ COL_MIN_WIDTH }px`,
    w: `${ COL_MIN_WIDTH }px`,
  };

  const thStyles: StyleProps = {
    wordBreak: 'break-word',
    whiteSpace: 'normal',
    minW: `${ COL_MIN_WIDTH }px`,
    w: `${ COL_MIN_WIDTH }px`,
  };

  const keys = (isOpened || !hasCut) ? data.schema.key_names : data.schema.key_names.slice(0, colsCutCount);
  const values = (isOpened || !hasCut) ? data.schema.value_names : data.schema.value_names.slice(0, colsCutCount - data.schema.key_names.length);

  return (
    <Box maxW="100%" overflowX="scroll" whiteSpace="nowrap">
      <Table variant="simple" size="sm" style={{ tableLayout: 'fixed' }} ref={ tableRef }>
        <Thead top={ top } display="table" w="100%">
          <Tr >
            { keys.map((keyName, index) => {
              const text = getNameTypeText(keyName, data.schema.key_types[index]);
              return (
                <Th key={ keyName } { ...thStyles }>
                  { index < 2 ? (
                    <Flex>
                      <Link onClick={ onKeySortClick } data-id={ index } display="flex" alignItems="start" lineHeight="20px" mr={ 2 }>
                        { sorting?.sort === `key${ index }` && sorting.order &&
                        <IconSvg name="arrows/east" boxSize={ 5 } mr={ 2 } transform={ sorting.order === 'asc' ? 'rotate(-90deg)' : 'rotate(90deg)' }/>
                        }
                        { text }
                      </Link>
                      <AddressMudRecordsKeyFilter
                        value={ filters[index === 0 ? 'filter_key0' : 'filter_key1'] }
                        title={ text }
                        columnName={ keyName }
                        handleFilterChange={ handleFilterChange(index === 0 ? 'filter_key0' : 'filter_key1') }
                      />
                    </Flex>
                  ) : text }
                </Th>
              );
            }) }
            { values.map((valName, index) => (
              <Th key={ valName } { ...thStyles }>
                { capitalizeFirstLetter(valName) } ({ data.schema.value_types[index] })
              </Th>
            )) }
            { hasCut && !isOpened && <Th width={ cutWidth }><Link onClick={ setIsOpened.on }>...</Link></Th> }
            <Th { ...thStyles }>Modified</Th>
            { hasCut && isOpened && <Th width={ cutWidth }><Link onClick={ setIsOpened.off }>...</Link></Th> }
          </Tr>
        </Thead>
        <Tbody display="table" w="100%">
          { data.items.map((item) => (
            <Tr key={ item.id }>
              { keys.map((keyName, index) => (
                <Td key={ keyName } backgroundColor={ keyBgColor } { ...tdStyles }>
                  { index === 0 ?
                    <Link onClick={ onRecordClick } data-id={ item.id }>{ item.decoded[keyName].toString() }</Link> :
                    item.decoded[keyName].toString()
                  }
                </Td>
              )) }
              { values.map((valName) =>
                <Td key={ valName } { ...tdStyles }>{ item.decoded[valName].toString() }</Td>) }
              { hasCut && !isOpened && <Td width={ cutWidth }></Td> }
              <Td { ...tdStyles }>{ dayjs(item.timestamp).format('llll') }</Td>
              { hasCut && isOpened && <Td width={ cutWidth }></Td> }
            </Tr>
          )) }
        </Tbody>
      </Table>
    </Box>
  );
};

export default AddressMudRecordsTable;
