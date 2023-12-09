import type { InputProps } from '@chakra-ui/react';
import { chakra, Icon, Input, InputGroup, InputLeftElement, InputRightElement, Skeleton } from '@chakra-ui/react';
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
  inputProps?: InputProps;
}

const FilterInput = ({ onChange, className, size = 'sm', placeholder, initialValue, isLoading, inputProps }: Props) => {
  const [ filterQuery, setFilterQuery ] = useState(initialValue || '');
  const inputRef = React.useRef<HTMLInputElement>(null);

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
          <Icon as={ searchIcon } color="text_secondary"/>
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
          _placeholder={{ color: 'text_secondary' }}
          { ...inputProps }
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
