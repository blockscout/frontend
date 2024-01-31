import { Box, chakra, Flex, IconButton } from '@chakra-ui/react';
import React from 'react';

import type { SmartContractMethodInput, SmartContractMethodArgType } from 'types/api/contract';

import IconSvg from 'ui/shared/IconSvg';

import { ARRAY_REGEXP } from '../utils';
import ContractMethodFieldInput from './ContractMethodFieldInput';
import ContractMethodFieldInputTuple from './ContractMethodFieldInputTuple';

interface ArrayButtonProps {
  index: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled?: boolean;
  type: 'add' | 'remove';
  className?: string;
}

const ArrayButton = chakra(({ className, index, onClick, isDisabled, type }: ArrayButtonProps) => {
  return (
    <IconButton
      className={ className }
      aria-label={ type }
      data-index={ index }
      variant="outline"
      w="30px"
      h="30px"
      flexShrink={ 0 }
      onClick={ onClick }
      icon={ <IconSvg name={ type === 'remove' ? 'minus' : 'plus' } boxSize={ 4 }/> }
      isDisabled={ isDisabled }
    />
  );
});

interface Props {
  data: SmartContractMethodInput;
}

const ContractMethodFieldInputArray = ({ data }: Props) => {

  const [ num, setNum ] = React.useState(1);

  const handleAddButtonClick = React.useCallback(() => {
    setNum((prev) => prev + 1);
  }, []);

  const handleRemoveButtonClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const itemIndex = event.currentTarget.getAttribute('data-index');
    if (itemIndex) {
      setNum((prev) => prev - 1);
    }
  }, [ ]);

  const type = data.type.slice(0, -2) as SmartContractMethodArgType;
  const itemData = { ...data, type };

  const content = (() => {
    if (data.components && type === 'tuple') {
      return <ContractMethodFieldInputTuple data={ itemData } hideLabel/>;
    }

    const arrayMatch = type.match(ARRAY_REGEXP);

    if (arrayMatch) {
      return (
        <Box outline="1px dashed lightskyblue" w="100%">
          <Box lineHeight={ type.includes('tuple') ? '45px' : '32px' }>{ type }</Box>
          <ContractMethodFieldInputArray data={ itemData }/>
        </Box>
      );
    }

    return (
      <ContractMethodFieldInput data={ itemData } hideLabel/>
    );
  })();

  return (
    <Flex alignItems="flex-start" columnGap={ 3 }>
      <Box w="200px" fontSize="sm" flexShrink={ 0 } my={ type.includes('tuple') ? '12px' : '6px' }>
        { data.name || '<arg w/o name>' } ({ data.type })
      </Box>
      <Flex flexDir="column" rowGap={ 1 } w="100%">
        { Array(num).fill(0).map((item, index) => {
          return (
            <Flex key={ index } alignItems="flex-start" columnGap={ 3 }>
              { content }
              { num > 1 && <ArrayButton index={ index } onClick={ handleRemoveButtonClick } type="remove" my={ type.includes('tuple') ? 2 : 0 }/> }
              { index === num - 1 && <ArrayButton index={ index } onClick={ handleAddButtonClick } type="add" my={ type.includes('tuple') ? 2 : 0 }/> }
            </Flex>
          );
        }) }
      </Flex>
    </Flex>
  );
};

export default ContractMethodFieldInputArray;
