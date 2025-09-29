import { chakra } from '@chakra-ui/react';
import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useRef, useState } from 'react';

import { Input } from 'toolkit/chakra/input';
import { InputGroup } from 'toolkit/chakra/input-group';
import { ClearButton } from 'toolkit/components/buttons/ClearButton';
import IconSvg from 'ui/shared/IconSvg';

export default function SearchInput({ onSubmit }: { onSubmit: (value: string) => void }) {
  const [ inputValue, setInputValue ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(inputValue);
    setInputValue('');
    inputRef.current?.blur();
  }, [ onSubmit, inputValue ]);

  const handleValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);
  }, []);

  const handleFilterQueryClear = useCallback(() => {
    setInputValue('');
    inputRef?.current?.focus();
  }, []);

  const startElement = <IconSvg boxSize={ 5 } name="search"/>;
  const endElement = <ClearButton onClick={ handleFilterQueryClear } visible={ inputValue.length > 0 }/>;

  return (
    <chakra.form
      onSubmit={ handleSubmit }
      noValidate
      w="full"
    >
      <InputGroup
        startElement={ startElement }
        startElementProps={{ px: 2 }}
        endElement={ endElement }
        endElementProps={{ w: '32px' }}
      >
        <Input
          ref={ inputRef }
          size="sm"
          value={ inputValue }
          onChange={ handleValueChange }
          placeholder="Search accounts by address..."
          borderWidth="2px"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        />
      </InputGroup>
    </chakra.form>
  );
}
