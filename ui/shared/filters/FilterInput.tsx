import { chakra, Icon, Input, InputGroup, InputLeftElement, InputRightElement, Skeleton, useColorModeValue } from '@chakra-ui/react';
import type { ChangeEvent } from 'react';
import React, { useCallback, useState } from 'react';

import searchIcon from 'icons/search.svg';
import ClearButton from 'ui/shared/ClearButton';

type Props = {
  onChange: (searchTerm: string) => void;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  placeholder: string;
  initialValue?: string;
  isLoading?: boolean;
}

const FilterInput = ({ onChange, className, size = 'sm', placeholder, initialValue, isLoading }: Props) => {
  const [ filterQuery, setFilterQuery ] = useState(initialValue || '');
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
    <Skeleton
      isLoaded={ !isLoading }
      className={ className }
      minW="250px"
    >
      <InputGroup
        size={ size }
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
            <ClearButton onClick={ handleFilterQueryClear }/>
          </InputRightElement>
        ) : null }
      </InputGroup>
    </Skeleton>
  );
};

export default chakra(FilterInput);
