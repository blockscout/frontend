import { chakra, Icon, Input, InputGroup, InputLeftElement, InputRightElement, useColorModeValue } from '@chakra-ui/react';
import type { ChangeEvent } from 'react';
import React, { useCallback, useState } from 'react';

import searchIcon from 'icons/search.svg';
import InputClearButton from 'ui/shared/InputClearButton';

type Props = {
  onChange: (searchTerm: string) => void;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  placeholder: string;
}

const FilterInput = ({ onChange, className, size = 'sm', placeholder }: Props) => {
  const [ filterQuery, setFilterQuery ] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const iconColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');

  const handleFilterQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setFilterQuery(value);
    onChange(value);
  }, [ onChange ]);

  const handleFilterQueryClear = useCallback(() => {
    setFilterQuery('');
    onChange('');
    inputRef?.current?.focus();
  }, [ onChange ]);

  return (
    <InputGroup
      size={ size }
      className={ className }
    >
      <InputLeftElement
        pointerEvents="none"
      >
        <Icon as={ searchIcon } color={ iconColor }/>
      </InputLeftElement>

      <Input
        ref={ inputRef }
        size={ size }
        value={ filterQuery }
        onChange={ handleFilterQueryChange }
        placeholder={ placeholder }
        borderWidth="2px"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      />

      { filterQuery ? (
        <InputRightElement>
          <InputClearButton onClick={ handleFilterQueryClear }/>
        </InputRightElement>
      ) : null }
    </InputGroup>
  );
};

export default chakra(FilterInput);
