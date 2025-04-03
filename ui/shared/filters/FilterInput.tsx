import type { ChangeEvent } from 'react';
import React, { useCallback, useState } from 'react';

import type { InputProps } from 'toolkit/chakra/input';
import { Input } from 'toolkit/chakra/input';
import { InputGroup } from 'toolkit/chakra/input-group';
import type { SkeletonProps } from 'toolkit/chakra/skeleton';
import { Skeleton } from 'toolkit/chakra/skeleton';
import ClearButton from 'ui/shared/ClearButton';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends Omit<SkeletonProps, 'onChange' | 'loading'> {
  onChange?: (searchTerm: string) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  placeholder: string;
  initialValue?: string;
  type?: React.HTMLInputTypeAttribute;
  name?: string;
  inputProps?: InputProps;
};

const FilterInput = ({ onChange, size = 'sm', placeholder, initialValue, type, name, loading = false, onFocus, onBlur, inputProps, ...rest }: Props) => {
  const [ filterQuery, setFilterQuery ] = useState(initialValue || '');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFilterQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setFilterQuery(value);
    onChange?.(value);
  }, [ onChange ]);

  const handleFilterQueryClear = useCallback(() => {
    setFilterQuery('');
    onChange?.('');
    inputRef?.current?.focus();
  }, [ onChange ]);

  const startElement = <IconSvg name="search" boxSize={ 5 }/>;

  const endElement = <ClearButton onClick={ handleFilterQueryClear } isVisible={ filterQuery.length > 0 }/>;

  return (
    <Skeleton
      minW="250px"
      borderRadius="base"
      loading={ loading }
      { ...rest }
    >
      <InputGroup
        startElement={ startElement }
        startElementProps={{ px: 2 }}
        endElement={ endElement }
        endElementProps={{ w: '32px' }}
      >
        <Input
          ref={ inputRef }
          size={ size }
          value={ filterQuery }
          onChange={ handleFilterQueryChange }
          onFocus={ onFocus }
          onBlur={ onBlur }
          placeholder={ placeholder }
          borderWidth="2px"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          type={ type }
          name={ name }
          { ...inputProps }
        />
      </InputGroup>
    </Skeleton>
  );
};

export default FilterInput;
