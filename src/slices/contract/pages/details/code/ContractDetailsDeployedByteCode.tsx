// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, createListCollection } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import config from 'src/config';
import RawDataSnippet from 'src/shared/data/RawDataSnippet';
import hexToUtf8 from 'src/shared/data/transformers/hex-to-utf8';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';

import type { SelectOption } from 'src/toolkit/chakra/select';
import { Select } from 'src/toolkit/chakra/select';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

import ContractDetailsVerificationButton from './ContractDetailsVerificationButton';

const OPTIONS = [
  { label: 'Hex', value: 'Hex' as const },
  { label: 'UTF-8', value: 'UTF-8' as const },
];

const collection = createListCollection<SelectOption>({
  items: OPTIONS,
});

export type DataType = (typeof OPTIONS)[number]['value'];

const DEFAULT_HEX: Array<DataType> = [ 'Hex' ];
const DEFAULT_UTF8: Array<DataType> = [ 'UTF-8' ];

interface Props {
  bytecode: string;
  isLoading: boolean;
  addressData: schemas['AddressResponse'];
  showVerificationButton?: boolean;
}

// we don't want to decode the whole bytecode here
// the "scilla_version" should appear somewhere in the beginning of the bytecode
// but there could be some comments of arbitrary length before it
// adjust the value if needed
const SYMBOLS_TO_CHECK = 500;

const ContractDetailsDeployedByteCode = ({ bytecode, isLoading, addressData, showVerificationButton }: Props) => {
  const [ selectedDataType, setSelectedDataType ] = React.useState<Array<DataType> | null>(null);

  const isScillaSourceCode = React.useMemo(() => {
    if (isLoading || !config.slices.contract.decodedBytecodeEnabled || addressData.is_verified) {
      return false;
    }
    const decodedBytecode = hexToUtf8(bytecode.slice(0, SYMBOLS_TO_CHECK * 2 + 2));
    return decodedBytecode.includes('scilla_version 0');
  }, [ isLoading, bytecode, addressData.is_verified ]);

  const dataType = selectedDataType ?? (isScillaSourceCode ? DEFAULT_UTF8 : DEFAULT_HEX);

  const handleSelectValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSelectedDataType(value as Array<DataType>);
  }, []);

  const content = dataType[0] === 'UTF-8' ? hexToUtf8(bytecode) : bytecode;

  const beforeSlot = (
    <Flex alignItems="center" flexWrap="wrap" mb={ 3 } columnGap={ 3 } rowGap={ 1 }>
      <Skeleton fontWeight={ 500 } loading={ isLoading }>Deployed bytecode</Skeleton>
      <Flex alignItems="center" flexGrow={ 1 }>
        { isScillaSourceCode && (
          <Select
            collection={ collection }
            placeholder="Select type"
            value={ dataType }
            onValueChange={ handleSelectValueChange }
            w="100px"
            loading={ isLoading }
          />
        ) }
        { showVerificationButton && (
          <ContractDetailsVerificationButton
            isLoading={ isLoading }
            addressHash={ addressData.hash }
            ml="auto"
            mr={ 3 }
          />
        ) }
        <CopyToClipboard text={ content } isLoading={ isLoading } ml={ showVerificationButton ? 0 : 'auto' }/>
      </Flex>
    </Flex>

  );

  return (
    <RawDataSnippet
      data={ content }
      beforeSlot={ beforeSlot }
      textareaMaxHeight="300px"
      isLoading={ isLoading }
      showCopy={ false }
    />
  );
};

export default React.memo(ContractDetailsDeployedByteCode);
