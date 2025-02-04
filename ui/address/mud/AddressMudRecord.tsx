import { Box, Td, Tr, Flex, Text, Table, Show, Hide, Divider, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import getQueryParamString from 'lib/router/getQueryParamString';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import TruncatedValue from 'ui/shared/TruncatedValue';

import AddressMudBreadcrumbs from './AddressMudBreadcrumbs';
import AddressMudRecordValues from './AddressMudRecordValues';
import { getValueString } from './utils';

type Props = {
  scrollRef?: React.RefObject<HTMLDivElement>;
  isQueryEnabled?: boolean;
  tableId: string;
  recordId: string;
};

const AddressMudRecord = ({ tableId, recordId, isQueryEnabled = true, scrollRef }: Props) => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);

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
    return <DataFetchAlert/>;
  }

  return (
    <>
      { data && (
        <AddressMudBreadcrumbs
          hash={ hash }
          tableId={ tableId }
          tableName={ data?.table.table_full_name }
          recordId={ recordId }
          recordName={ data.record.id }
          mb={ 6 }
          scrollRef={ scrollRef }
        />
      ) }
      <Show above="lg" ssr={ false }>
        <Table borderRadius="8px" style={{ tableLayout: 'auto' }} width="100%" overflow="hidden">
          { data?.schema.key_names.length && data?.schema.key_names.map((keyName, index) => (
            <Tr key={ keyName } borderBottomStyle={ index === data.schema.key_names.length - 1 ? 'hidden' : 'solid' }>
              <Td fontWeight={ 600 } whiteSpace="nowrap" fontSize="sm">
                { keyName } ({ data.schema.key_types[index] })
              </Td>
              <Td colSpan={ 2 } fontSize="sm">
                <Flex justifyContent="space-between">
                  <TruncatedValue value={ getValueString(data.record.decoded[keyName]) } mr={ 2 }/>
                  { index === 0 && <Box color="text_secondary">{ dayjs(data.record.timestamp).format('lll') }</Box> }
                </Flex>
              </Td>
            </Tr>
          )) }
          <AddressMudRecordValues data={ data }/>
        </Table>
      </Show>
      <Hide above="lg" ssr={ false }>
        <>
          { data?.schema.key_names.length && data?.schema.key_names.map((keyName, index) => (
            <VStack gap={ 1 } key={ keyName } alignItems="start" fontSize="sm">
              <Divider/>
              <Text fontWeight={ 600 } whiteSpace="nowrap">
                { keyName } ({ data.schema.key_types[index] })
              </Text>
              <Text wordBreak="break-word">{ getValueString(data.record.decoded[keyName]) }</Text>
              { index === 0 && <Box color="text_secondary">{ dayjs(data.record.timestamp).format('lll') }</Box> }
            </VStack>
          )) }
          <Table borderRadius="8px" style={{ tableLayout: 'auto' }} width="100%" mt={ 2 } overflow="hidden">
            <AddressMudRecordValues data={ data }/>
          </Table>
        </>
      </Hide>
    </>
  );
};

export default AddressMudRecord;
