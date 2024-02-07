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
  hideLabel?: boolean;
  level?: number;
  basePath: string;
}

const ContractMethodFieldInputArray = ({ data, hideLabel, level, basePath }: Props) => {

  const [ registeredIndices, setRegisteredIndices ] = React.useState([ 0 ]);

  const handleAddButtonClick = React.useCallback(() => {
    setRegisteredIndices((prev) => [ ...prev, prev[prev.length - 1] + 1 ]);
  }, []);

  const handleRemoveButtonClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const itemIndex = event.currentTarget.getAttribute('data-index');
    if (itemIndex) {
      setRegisteredIndices((prev) => prev.filter((index) => index !== Number(itemIndex)));
    }
  }, [ ]);

  const type = data.type.slice(0, -2) as SmartContractMethodArgType;

  const content = (index: number) => {
    const itemData = { ...data, type, name: `item #${ (level ? `${ level }.` : '') + (index + 1) }` };

    if (data.components && type === 'tuple') {
      return <ContractMethodFieldInputTuple data={ itemData } basePath={ `${ basePath }:${ index }` }/>;
    }

    const arrayMatch = type.match(ARRAY_REGEXP);

    if (arrayMatch) {
      return (
        <Box outline="1px dashed lightskyblue" w="100%">
          <Box lineHeight={ type.includes('tuple') ? '45px' : '32px' }>item #{ index + 1 }({ type })</Box>
          <ContractMethodFieldInputArray data={ itemData } hideLabel level={ index + 1 } basePath={ `${ basePath }:${ index }` }/>
        </Box>
      );
    }

    return (
      <ContractMethodFieldInput data={ itemData } hideLabel path={ `${ basePath }:${ index }` }/>
    );
  };

  return (
    <Flex alignItems="flex-start" columnGap={ 3 }>
      { !hideLabel && (
        <Box w="200px" fontSize="sm" flexShrink={ 0 } my={ type.includes('tuple') ? '12px' : '6px' }>
          { data.name || '<arg w/o name>' } ({ data.type })
        </Box>
      ) }
      <Flex flexDir="column" rowGap={ 1 } w="100%">
        { registeredIndices.map((registeredIndex, index) => {
          return (
            <Flex key={ registeredIndex } alignItems="flex-start" columnGap={ 3 }>
              { content(registeredIndex) }
              { registeredIndices.length > 1 &&
                <ArrayButton index={ registeredIndex } onClick={ handleRemoveButtonClick } type="remove" my={ type.includes('tuple') ? 2 : 0 }/> }
              { index === registeredIndices.length - 1 &&
                <ArrayButton index={ registeredIndex } onClick={ handleAddButtonClick } type="add" my={ type.includes('tuple') ? 2 : 0 }/> }
            </Flex>
          );
        }) }
      </Flex>
    </Flex>
  );
};

export default ContractMethodFieldInputArray;
