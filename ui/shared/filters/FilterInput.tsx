import type { ChangeEvent } from 'react';
import React, { useCallback, useState } from 'react';

import { Input } from 'toolkit/chakra/input';
import { InputGroup } from 'toolkit/chakra/input-group';
import type { SkeletonProps } from 'toolkit/chakra/skeleton';
import { Skeleton } from 'toolkit/chakra/skeleton';
import ClearButton from 'ui/shared/ClearButton';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends Omit<SkeletonProps, 'onChange' | 'loading'> {
  onChange?: (searchTerm: string) => void;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  placeholder: string;
  initialValue?: string;
  type?: React.HTMLInputTypeAttribute;
  name?: string;
};

const FilterInput = ({ onChange, size = 'sm', placeholder, initialValue, type, name, loading = false, ...rest }: Props) => {
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

  const startElement = <IconSvg name="search" color={{ _light: 'blackAlpha.600', _dark: 'whiteAlpha.600' }} boxSize={ 4 }/>;

  const endElement = filterQuery ? <ClearButton onClick={ handleFilterQueryClear }/> : null;

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
        startOffset="32px"
        endElement={ endElement }
        endElementProps={{ px: 0, w: '32px' }}
        endOffset="32px"
      >
        <Input
          ref={ inputRef }
          size={ size }
          value={ filterQuery }
          onChange={ handleFilterQueryChange }
          placeholder={ placeholder }
          borderWidth="2px"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          type={ type }
          name={ name }
        />
      </InputGroup>
    </Skeleton>
  );
};

export default FilterInput;
