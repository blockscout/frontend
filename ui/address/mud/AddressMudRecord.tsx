import { Box, Td, Tr, Flex, useColorModeValue, Table } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import getQueryParamString from 'lib/router/getQueryParamString';
import ContentLoader from 'ui/shared/ContentLoader';
import TruncatedValue from 'ui/shared/TruncatedValue';

import AddressMudBreadcrumbs from './AddressMudBreadcrumbs';

type Props ={
  scrollRef?: React.RefObject<HTMLDivElement>;
  isQueryEnabled?: boolean;
  tableId: string;
  recordId: string;
}

const AddressMudRecord = ({ tableId, recordId, isQueryEnabled = true, scrollRef }: Props) => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);

  const valuesBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  const { data, isLoading, isError } = useApiQuery('address_mud_record', {
    pathParams: { hash, table_id: tableId, record_id: recordId },
    queryOptions: {
      enabled: isQueryEnabled,
    },
  });

  if (isLoading) {
    return <ContentLoader/>;
  }

  if (isError) {
    return <Box>error message</Box>;
  }

  return (
    <>
      { data && (
        <AddressMudBreadcrumbs
          hash={ hash }
          tableId={ tableId }
          tableName={ data?.table.table_name }
          recordId={ recordId }
          recordName={ data.record.id }
          mb={ 6 }
          scrollRef={ scrollRef }
        />
      ) }

      <Table borderRadius="8px">
        { data?.schema.key_names.length && data?.schema.key_names.map((keyName, index) => (
          <Tr key={ keyName }>
            <Td fontWeight={ 600 }>
              { keyName } ({ data.schema.key_types[index] })
            </Td>
            <Td colSpan={ 2 }>
              <Flex justifyContent="space-between">
                <TruncatedValue value={ data.record.decoded[keyName] } mr={ 2 }/>
                { index === 0 && <Box color="text_secondary">{ dayjs(data.record.timestamp).format('llll') }</Box> }
              </Flex>
            </Td>
          </Tr>
        )) }
        { data?.schema.value_names.length && (
          <>
            <Tr backgroundColor={ valuesBgColor } borderBottomStyle="hidden">
              <Td fontWeight={ 600 }>Field</Td>
              <Td fontWeight={ 600 }>Type</Td>
              <Td fontWeight={ 600 }>Value</Td>
            </Tr>
            { data?.schema.value_names.map((valName, index) => (
              <Tr key={ valName } backgroundColor={ valuesBgColor } borderBottomStyle="hidden">
                <Td>{ valName }</Td>
                <Td>{ data.schema.value_types[index] }</Td>
                <Td>{ data.record.decoded[valName] }</Td>
              </Tr>
            )) }
          </>
        ) }
      </Table>
    </>
  );
};

export default AddressMudRecord;
