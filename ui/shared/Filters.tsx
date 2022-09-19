// DEPRECATED
// migrate to separate components
//    ui/shared/FilterButton.tsx + custom filter
//    ui/shared/FilterInput.tsx
import { Flex, Icon, Button, Circle, InputGroup, InputLeftElement, Input, useColorModeValue } from '@chakra-ui/react';
import type { ChangeEvent } from 'react';
import React from 'react';

import upDownArrow from 'icons/arrows/up-down.svg';
import filterIcon from 'icons/filter.svg';
import searchIcon from 'icons/search.svg';

const FilterIcon = <Icon as={ filterIcon } boxSize={ 5 }/>;

type Props = {
  isMobile?: boolean;
}

const Filters = ({ isMobile }: Props) => {
  const [ isFilterActive, setIsFilterActive ] = React.useState(false);
  const [ value, setValue ] = React.useState('');
  const [ isSortActive, setIsSortActive ] = React.useState(false);

  const handleClick = React.useCallback(() => {
    setIsFilterActive(flag => !flag);
  }, []);

  const handleChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);

  const handleSort = React.useCallback(() => {
    setIsSortActive(flag => !flag);
  }, []);

  const badgeColor = useColorModeValue('white', 'black');
  const badgeBgColor = useColorModeValue('blue.700', 'gray.50');
  const searchIconColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');
  const inputBorderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');

  return (
    <Flex>
      <Button
        leftIcon={ isMobile ? undefined : FilterIcon }
        rightIcon={ isFilterActive ? <Circle bg={ badgeBgColor } size={ 5 } color={ badgeColor }>2</Circle> : undefined }
        size="sm"
        variant="outline"
        colorScheme="gray-dark"
        onClick={ handleClick }
        isActive={ isFilterActive }
        px={ 1.5 }
      >
        { isMobile ? FilterIcon : 'Filter' }
      </Button>
      { isMobile && (
        <IconButton
          icon={ <Icon as={ upDownArrow } boxSize={ 5 }/> }
          aria-label="sort"
          size="sm"
          variant="outline"
          colorScheme="gray-dark"
          ml={ 2 }
          minWidth="36px"
          onClick={ handleSort }
          isActive={ isSortActive }
        />
      ) }
      <InputGroup size="xs" ml={ isMobile ? 2 : 3 } maxW="360px">
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
