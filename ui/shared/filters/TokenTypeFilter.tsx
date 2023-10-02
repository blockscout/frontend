import { CheckboxGroup, Checkbox, Text, Flex, Link, useCheckboxGroup } from '@chakra-ui/react';
import React from 'react';

import type { TokenType } from 'types/api/token';

import { TOKEN_TYPES } from 'lib/token/tokenTypes';

type Props = {
  onChange: (nextValue: Array<TokenType>) => void;
  defaultValue?: Array<TokenType>;
}

const TokenTypeFilter = ({ onChange, defaultValue }: Props) => {
  const { value, setValue } = useCheckboxGroup({ defaultValue });

  const handleReset = React.useCallback(() => {
    setValue([]);
    onChange([]);
  }, [ onChange, setValue ]);

  const handleChange = React.useCallback((nextValue: Array<TokenType>) => {
    setValue(nextValue);
    onChange(nextValue);
  }, [ onChange, setValue ]);

  return (
    <>
      <Flex justifyContent="space-between" fontSize="sm">
        <Text fontWeight={ 600 } variant="secondary">Type</Text>
        <Link onClick={ handleReset }>Reset</Link>
      </Flex>
      <CheckboxGroup size="lg" onChange={ handleChange } value={ value }>
        { TOKEN_TYPES.map(({ title, id }) => (
          <Checkbox key={ id } value={ id }>
            <Text fontSize="md">{ title }</Text>
          </Checkbox>
        )) }
      </CheckboxGroup>
    </>
  );
};

export default TokenTypeFilter;
