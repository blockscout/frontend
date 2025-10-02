import { chakra } from '@chakra-ui/react';
import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useRef } from 'react';

import { Input } from 'toolkit/chakra/input';
import { InputGroup } from 'toolkit/chakra/input-group';
import { ClearButton } from 'toolkit/components/buttons/ClearButton';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
};

export default function SearchInput({ value, onChange, onSubmit }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(value);
    inputRef.current?.blur();
  }, [ onSubmit, value ]);

  const handleValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    onChange(value);
  }, [ onChange ]);

  const handleFilterQueryClear = useCallback(() => {
    onChange('');
    inputRef?.current?.focus();
  }, [ onChange ]);

  const startElement = <IconSvg boxSize={ 5 } name="search"/>;
  const endElement = <ClearButton onClick={ handleFilterQueryClear } visible={ value.length > 0 }/>;

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
          value={ value }
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
