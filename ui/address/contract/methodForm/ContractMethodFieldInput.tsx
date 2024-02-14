import { Flex, FormControl, Input, InputGroup, InputRightElement, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { SmartContractMethodInput } from 'types/api/contract';

import ClearButton from 'ui/shared/ClearButton';

import { INT_REGEXP, getIntBoundaries } from '../utils';
import ContractMethodFieldLabel from './ContractMethodFieldLabel';
import ContractMethodMultiplyButton from './ContractMethodMultiplyButton';

interface Props {
  data: SmartContractMethodInput;
  hideLabel?: boolean;
  path: string;
  className?: string;
  isDisabled: boolean;
}

const ContractMethodFieldInput = ({ data, hideLabel, path: name, className, isDisabled }: Props) => {
  const ref = React.useRef<HTMLInputElement>(null);

  const { control, setValue, getValues } = useFormContext();
  const { field } = useController({ control, name });

  const inputBgColor = useColorModeValue('white', 'black');
  const nativeCoinRowBgColor = useColorModeValue('gray.100', 'gray.700');
  const isNativeCoin = data.fieldType === 'native_coin';

  const argType = data.type;
  const intMatch = React.useMemo(() => {
    const match = argType.match(INT_REGEXP);
    if (!match) {
      return null;
    }

    const [ , isUnsigned, power = '256' ] = match;
    const [ min, max ] = getIntBoundaries(Number(power), Boolean(isUnsigned));

    return { isUnsigned, power, min, max };
  }, [ argType ]);
  const hasMultiplyButton = intMatch && Number(intMatch.power) >= 64;

  const handleClear = React.useCallback(() => {
    setValue(name, '');
    // onChange();
    ref.current?.focus();
  }, [ name, setValue ]);

  const handleAddZeroesClick = React.useCallback((power: number) => {
    const zeroes = Array(power).fill('0').join('');
    const value = getValues(name);
    const newValue = value ? value + zeroes : '1' + zeroes;
    setValue(name, newValue);
    // onChange();
  }, [ getValues, name, setValue ]);

  return (
    <Flex
      className={ className }
      alignItems="center"
      columnGap={ 3 }
      w="100%"
      bgColor={ isNativeCoin ? nativeCoinRowBgColor : undefined }
      borderRadius="base"
      px="6px"
      py={ isNativeCoin ? 1 : 0 }
    >
      { !hideLabel && <ContractMethodFieldLabel data={ data }/> }
      <FormControl>
        <InputGroup size="xs">
          <Input
            { ...field }
            ref={ ref }
            placeholder={ data.type }
            autoComplete="off"
            bgColor={ inputBgColor }
          />
          <InputRightElement w="auto" right={ 1 }>
            { typeof field.value === 'string' && field.value.replace('\n', '') && <ClearButton onClick={ handleClear } isDisabled={ isDisabled }/> }
            { hasMultiplyButton && <ContractMethodMultiplyButton onClick={ handleAddZeroesClick } isDisabled={ isDisabled }/> }
          </InputRightElement>
        </InputGroup>
      </FormControl>
    </Flex>
  );
};

export default React.memo(chakra(ContractMethodFieldInput));
