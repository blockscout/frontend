// SPDX-License-Identifier: LicenseRef-Blockscout

import { createListCollection, Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import ContractMethodResultItem from 'src/slices/contract/pages/details/methods/form/resultPublicClient/Item';

import RawDataSnippet from 'src/shared/data/RawDataSnippet';
import type { DataType } from 'src/shared/data/RawInputData';
import hexToUtf8 from 'src/shared/data/transformers/hex-to-utf8';

import type { OnValueChangeHandler, SelectOption } from 'src/toolkit/chakra/select';
import { Select } from 'src/toolkit/chakra/select';

import { decodeLogData } from '../utils/decode-log-data';

type DisplayType = 'ABI' | DataType;

interface Props {
  data: Pick<schemas['Log'], 'decoded' | 'topics' | 'data'>;
  isLoading: boolean | undefined;
  defaultDataType: DataType | undefined;
}

const LogItemData = ({ data, isLoading, defaultDataType }: Props) => {
  const { decoded, topics, data: hex } = data;
  const [ pickedDisplayType, setPickedDisplayType ] = React.useState<DisplayType>();

  const abiInputs = React.useMemo(() => {
    const result = decodeLogData({ decoded, topics, data: hex });
    return result.ok ? result.inputs : undefined;
  }, [ decoded, topics, hex ]);

  const hasAbiView = Boolean(abiInputs);
  const hasUtf8View = Boolean(defaultDataType);

  const displayTypes = React.useMemo(() => {
    const types: Array<DisplayType> = [ 'Hex' ];
    hasAbiView && types.unshift('ABI');
    hasUtf8View && types.push('UTF-8');
    return types;
  }, [ hasAbiView, hasUtf8View ]);

  const collection = React.useMemo(() => createListCollection<SelectOption>({
    items: displayTypes.map((type) => ({ label: type, value: type })),
  }), [ displayTypes ]);

  const handleValueChange: OnValueChangeHandler = React.useCallback(({ value }) => {
    setPickedDisplayType(displayTypes.find((type) => type === value[0]));
  }, [ displayTypes ]);

  if (displayTypes.length === 1) {
    return (
      <RawDataSnippet
        isLoading={ isLoading }
        data={ hex }
        showCopy={ false }
      />
    );
  }

  const defaultDisplayType = hasAbiView ? 'ABI' : (defaultDataType ?? 'Hex');
  const displayType = pickedDisplayType && displayTypes.includes(pickedDisplayType) ? pickedDisplayType : defaultDisplayType;

  const content = (() => {
    if (displayType === 'ABI' && abiInputs) {
      return (
        <Flex flexDir="column" rowGap={ 2 }>
          { abiInputs.map(({ abiParameter, value }, index) => (
            <ContractMethodResultItem key={ index } abiParameter={ abiParameter } data={ value } mode="result"/>
          )) }
        </Flex>
      );
    }

    return displayType === 'UTF-8' ? hexToUtf8(hex) : hex;
  })();

  const rightSlot = (
    <Select
      collection={ collection }
      placeholder="Select type"
      value={ [ displayType ] }
      onValueChange={ handleValueChange }
      w="100px"
      mr="auto"
      loading={ isLoading }
    />
  );

  return (
    <RawDataSnippet
      data={ content }
      rightSlot={ rightSlot }
      isLoading={ isLoading }
      textareaMaxHeight={ displayType === 'ABI' ? 'none' : '220px' }
      textareaMinHeight="53px"
      w="100%"
    />
  );
};

export default React.memo(LogItemData);
