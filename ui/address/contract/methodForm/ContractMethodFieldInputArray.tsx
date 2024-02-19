import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { SmartContractMethodInput, SmartContractMethodArgType } from 'types/api/contract';

import ContractMethodArrayButton from './ContractMethodArrayButton';
import type { Props as AccordionProps } from './ContractMethodFieldAccordion';
import ContractMethodFieldAccordion from './ContractMethodFieldAccordion';
import ContractMethodFieldInput from './ContractMethodFieldInput';
import ContractMethodFieldInputTuple from './ContractMethodFieldInputTuple';
import ContractMethodFieldLabel from './ContractMethodFieldLabel';

interface Props extends Pick<AccordionProps, 'onAddClick' | 'onRemoveClick' | 'index'> {
  data: SmartContractMethodInput;
  level: number;
  basePath: string;
  isDisabled: boolean;
}

const ContractMethodFieldInputArray = ({ data, level, basePath, onAddClick, onRemoveClick, index: parentIndex, isDisabled }: Props) => {

  const [ registeredIndices, setRegisteredIndices ] = React.useState([ 0 ]);

  const handleAddButtonClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setRegisteredIndices((prev) => [ ...prev, prev[prev.length - 1] + 1 ]);
  }, []);

  const handleRemoveButtonClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const itemIndex = event.currentTarget.getAttribute('data-index');
    if (itemIndex) {
      setRegisteredIndices((prev) => prev.filter((index) => index !== Number(itemIndex)));
    }
  }, [ ]);

  const childrenType = data.type.slice(0, -2) as SmartContractMethodArgType;
  const getItemData = (index: number) => ({
    ...data,
    type: childrenType,
    name: `#${ (parentIndex !== undefined ? `${ parentIndex + 1 }.` : '') + (index + 1) }`,
  });
  const isNestedArray = data.type.includes('[][]');

  if (isNestedArray) {
    return (
      <ContractMethodFieldAccordion
        level={ level }
        label={ `${ data.name || '<arg w/o name>' } (${ data.type }) level: ${ level }` }
      >
        { registeredIndices.map((registeredIndex, index) => {
          const itemData = getItemData(index);

          return (
            <ContractMethodFieldInputArray
              key={ registeredIndex }
              data={ itemData }
              basePath={ `${ basePath }:${ registeredIndex }` }
              level={ level + 1 }
              onAddClick={ index === registeredIndices.length - 1 ? handleAddButtonClick : undefined }
              onRemoveClick={ registeredIndices.length > 1 ? handleRemoveButtonClick : undefined }
              index={ registeredIndex }
              isDisabled={ isDisabled }
            />
          );
        }) }
      </ContractMethodFieldAccordion>
    );
  }

  const isTupleArray = data.type.includes('tuple');

  if (isTupleArray) {
    return (
      <ContractMethodFieldAccordion
        level={ level }
        label={ `${ data.name || '<arg w/o name>' } (${ data.type }) level: ${ level }` }
        onAddClick={ onAddClick }
        onRemoveClick={ onRemoveClick }
        index={ parentIndex }
      >
        { registeredIndices.map((registeredIndex, index) => {
          const itemData = getItemData(index);

          return (
            <ContractMethodFieldInputTuple
              key={ registeredIndex }
              data={ itemData }
              basePath={ `${ basePath }:${ registeredIndex }` }
              level={ level + 1 }
              onAddClick={ index === registeredIndices.length - 1 ? handleAddButtonClick : undefined }
              onRemoveClick={ registeredIndices.length > 1 ? handleRemoveButtonClick : undefined }
              index={ registeredIndex }
              isDisabled={ isDisabled }
            />
          );
        }) }
      </ContractMethodFieldAccordion>
    );
  }

  // primitive value array
  return (
    <Flex flexDir={{ base: 'column', md: 'row' }} alignItems="flex-start" columnGap={ 3 } px="6px">
      <ContractMethodFieldLabel data={ data } level={ level }/>
      <Flex flexDir="column" rowGap={ 1 } w="100%">
        { registeredIndices.map((registeredIndex, index) => {
          const itemData = getItemData(index);

          return (
            <Flex key={ registeredIndex } alignItems="flex-start" columnGap={ 3 }>
              <ContractMethodFieldInput
                data={ itemData }
                hideLabel
                path={ `${ basePath }:${ index }` }
                level={ level }
                px={ 0 }
                isDisabled={ isDisabled }
              />
              { registeredIndices.length > 1 &&
                <ContractMethodArrayButton index={ registeredIndex } onClick={ handleRemoveButtonClick } type="remove" my="6px"/> }
              { index === registeredIndices.length - 1 &&
                <ContractMethodArrayButton index={ registeredIndex } onClick={ handleAddButtonClick } type="add" my="6px"/> }
            </Flex>
          );
        }) }
      </Flex>
    </Flex>
  );
};

export default React.memo(ContractMethodFieldInputArray);
