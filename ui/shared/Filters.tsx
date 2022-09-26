// DEPRECATED
// migrate to separate components
//    ui/shared/FilterButton.tsx + custom filter
//    ui/shared/FilterInput.tsx
import { Flex, Icon, Button, Circle, InputGroup, InputLeftElement, Input, useColorModeValue } from '@chakra-ui/react';
import type { ChangeEvent } from 'react';
import React from 'react';

import filterIcon from 'icons/filter.svg';
import searchIcon from 'icons/search.svg';

const FilterIcon = <Icon as={ filterIcon } boxSize={ 5 }/>;

const Filters = () => {
  const [ isActive, setIsActive ] = React.useState(false);
  const [ value, setValue ] = React.useState('');

  const handleClick = React.useCallback(() => {
    setIsActive(flag => !flag);
  }, []);

  const handleChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);

  const badgeColor = useColorModeValue('white', 'black');
  const badgeBgColor = useColorModeValue('blue.700', 'gray.50');
  const searchIconColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');
  const inputBorderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');

  return (
    <Flex>
      <Button
        leftIcon={ FilterIcon }
        rightIcon={ isActive ? <Circle bg={ badgeBgColor } size={ 5 } color={ badgeColor }>2</Circle> : undefined }
        size="sm"
        variant="outline"
        colorScheme="gray-dark"
        borderWidth="1px"
        onClick={ handleClick }
        isActive={ isActive }
        px={ 1.5 }
      >
        Filter
      </Button>
      <InputGroup size="xs" ml={ 3 } maxW="360px">
        <InputLeftElement ml={ 1 }>
          <Icon as={ searchIcon } boxSize={ 5 } color={ searchIconColor }/>
        </InputLeftElement>
        <Input
          paddingInlineStart="38px"
          placeholder="Search by addresses, hash, method..."
          ml="1px"
          borderWidth="2px"
          textOverflow="ellipsis"
          onChange={ handleChange }
          borderColor={ inputBorderColor }
          value={ value }
          size="xs"
        />
      </InputGroup>
    </Flex>
  );
};

export default Filters;
