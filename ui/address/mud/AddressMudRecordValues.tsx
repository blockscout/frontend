import { Box, Td, Tr, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { AddressMudRecord } from 'types/api/address';

type Props ={
  data?: AddressMudRecord;
}

const AddressMudRecordValues = ({ data }: Props) => {
  const valuesBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  if (!data?.schema.value_names.length) {
    return null;
  }

  return (
    <>
      <Tr backgroundColor={ valuesBgColor } borderBottomStyle="hidden">
        <Td fontWeight={ 600 }>Field</Td>
        <Td fontWeight={ 600 }>Type</Td>
        <Td fontWeight={ 600 } w="100%" wordBreak="break-all">Value</Td>
      </Tr>
      {
        data?.schema.value_names.map((valName, index) => (
          <Tr key={ valName } backgroundColor={ valuesBgColor } borderBottomStyle="hidden">
            <Td whiteSpace="nowrap" py={ 0 } pb={ 4 }>{ valName }</Td>
            <Td py={ 0 } pb={ 4 }>{ data.schema.value_types[index] }</Td>
            <Td w="100%" wordBreak="break-all" py={ 0 } pb={ 4 }>
              <Box>
                { data.record.decoded[valName] }
              </Box>
            </Td>
          </Tr>
        ))
      }
    </>
  );
};

export default AddressMudRecordValues;
