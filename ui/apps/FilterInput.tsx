import { SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import type { ChangeEvent } from 'react';
import React, { useCallback, useState } from 'react';

type Props = {
  onChange: (q: string) => void;
}

const FilterInput = ({ onChange }: Props) => {
  const [ filterQuery, setFilterQuery ] = useState('');

  const handleFilterQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setFilterQuery(value);
    onChange(value);
  }, [ onChange ]);

  return (
    <InputGroup
      size="sm"
    >
      <InputLeftElement
        pointerEvents="none"
      >
        <SearchIcon color="gray.300"/>
      </InputLeftElement>

      <Input
        size="sm"
        value={ filterQuery }
        onChange={ handleFilterQueryChange }
        marginBottom={{ base: '4', lg: '6' }}
      />
    </InputGroup>
  );
};

export default FilterInput;
