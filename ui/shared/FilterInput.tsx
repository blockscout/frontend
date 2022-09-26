import { Input, InputGroup, InputLeftElement, Icon, useColorModeValue, chakra } from '@chakra-ui/react';
import type { ChangeEvent } from 'react';
import React, { useCallback, useState } from 'react';

import searchIcon from 'icons/search.svg';

type Props = {
  onChange: (searchTerm: string) => void;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  placeholder: string;
}

const FilterInput = ({ onChange, className, size = 'sm', placeholder }: Props) => {
  const [ filterQuery, setFilterQuery ] = useState('');

  const handleFilterQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setFilterQuery(value);
    onChange(value);
  }, [ onChange ]);

  return (
    <InputGroup
      size={ size }
      className={ className }
    >
      <InputLeftElement
        pointerEvents="none"
      >
        <Icon as={ searchIcon } color={ useColorModeValue('blackAlpha.600', 'whiteAlpha.600') }/>
      </InputLeftElement>

      <Input
        size={ size }
        value={ filterQuery }
        onChange={ handleFilterQueryChange }
        placeholder={ placeholder }
        borderWidth="2px"
        textOverflow="ellipsis"
      />
    </InputGroup>
  );
};

export default chakra(FilterInput);
