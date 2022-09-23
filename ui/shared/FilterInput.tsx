import { SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement, useColorModeValue, chakra } from '@chakra-ui/react';
import type { ChangeEvent } from 'react';
import React, { useCallback, useState } from 'react';

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
        <SearchIcon color={ useColorModeValue('blackAlpha.600', 'whiteAlpha.600') }/>
      </InputLeftElement>

      <Input
        size={ size }
        value={ filterQuery }
        onChange={ handleFilterQueryChange }
        placeholder={ placeholder }
      />
    </InputGroup>
  );
};

export default chakra(FilterInput);
