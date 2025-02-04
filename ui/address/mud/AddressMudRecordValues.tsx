import { Box, Td, Tr, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { AddressMudRecord } from 'types/api/address';

import { getValueString } from './utils';

type Props = {
  data?: AddressMudRecord;
};

const AddressMudRecordValues = ({ data }: Props) => {
  const valuesBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  if (!data?.schema.value_names.length) {
    return null;
  }

  return (
    <>
      <Tr backgroundColor={ valuesBgColor } borderBottomStyle="hidden" >
        <Td fontWeight={ 600 } w="100px" fontSize="sm">Field</Td>
        <Td fontWeight={ 600 } w="90px" fontSize="sm">Type</Td>
        <Td fontWeight={ 600 } fontSize="sm">Value</Td>
      </Tr>
      {
        data?.schema.value_names.map((valName, index) => (
          <Tr key={ valName } backgroundColor={ valuesBgColor } borderBottomStyle="hidden">
            <Td fontWeight={ 400 } w="100px" py={ 0 } pb={ 4 } pr={ 0 }wordBreak="break-all">{ valName }</Td>
            <Td fontWeight={ 400 } w="90px" py={ 0 } pb={ 4 } wordBreak="break-all">{ data.schema.value_types[index] }</Td>
            <Td fontWeight={ 400 } wordBreak="break-word" py={ 0 } pb={ 4 }>
              <Box>
                { getValueString(data.record.decoded[valName]) }
              </Box>
            </Td>
          </Tr>
        ))
      }
    </>
  );
};

export default AddressMudRecordValues;
