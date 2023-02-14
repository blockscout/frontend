import { CheckboxGroup, Checkbox, Text } from '@chakra-ui/react';
import React from 'react';

import type { TokenType } from 'types/api/token';

import TOKEN_TYPE from 'lib/token/tokenTypes';

type Props = {
  onChange: (nextValue: Array<TokenType>) => void;
  defaultValue?: Array<TokenType>;
}

const TokenTypeFilter = ({ onChange, defaultValue }: Props) => {
  return (
    <CheckboxGroup size="lg" onChange={ onChange } defaultValue={ defaultValue }>
      { TOKEN_TYPE.map(({ title, id }) => (
        <Checkbox key={ id } value={ id }>
          <Text fontSize="md">{ title }</Text>
        </Checkbox>
      )) }
    </CheckboxGroup>
  );
};

export default TokenTypeFilter;
