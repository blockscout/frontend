import { CheckboxGroup, Text, Flex, useCheckboxGroup, Fieldset } from '@chakra-ui/react';
import React from 'react';

import type { NFTTokenType, TokenType } from 'types/api/token';

import { TOKEN_TYPES, TOKEN_TYPE_IDS, NFT_TOKEN_TYPE_IDS } from 'lib/token/tokenTypes';
import { Checkbox } from 'toolkit/chakra/checkbox';
import { Link } from 'toolkit/chakra/link';

type Props<T extends TokenType | NFTTokenType> = {
  onChange: (nextValue: Array<T>) => void;
  defaultValue?: Array<T>;
  nftOnly: T extends NFTTokenType ? true : false;
};
const TokenTypeFilter = <T extends TokenType | NFTTokenType>({ nftOnly, onChange, defaultValue }: Props<T>) => {
  const { value, setValue } = useCheckboxGroup({ defaultValue });

  const handleReset = React.useCallback(() => {
    if (value.length === 0) {
      return;
    }
    setValue([]);
    onChange([]);
  }, [ onChange, setValue, value.length ]);

  const handleChange = React.useCallback((nextValue: Array<string>) => {
    setValue(nextValue as Array<T>);
    onChange(nextValue as Array<T>);
  }, [ onChange, setValue ]);

  return (
    <>
      <Flex justifyContent="space-between" fontSize="sm">
        <Text fontWeight={ 600 } color="text.secondary">Type</Text>
        <Link
          onClick={ handleReset }
          cursor={ value.length > 0 ? 'pointer' : 'unset' }
          color={ value.length > 0 ? 'link' : 'text_secondary' }
          _hover={{
            color: value.length > 0 ? 'link_hovered' : 'text_secondary',
          }}
        >
          Reset
        </Link>
      </Flex>
      <Fieldset.Root>
        <CheckboxGroup defaultValue={ defaultValue } onValueChange={ handleChange } value={ value } name="token_type">
          <Fieldset.Content>
            { (nftOnly ? NFT_TOKEN_TYPE_IDS : TOKEN_TYPE_IDS).map((id) => (
              <Checkbox key={ id } value={ id }>
                { TOKEN_TYPES[id] }
              </Checkbox>
            )) }
          </Fieldset.Content>
        </CheckboxGroup>
      </Fieldset.Root>
      { /* <CheckboxGroup size="lg" onChange={ handleChange } value={ value }>
        { (nftOnly ? NFT_TOKEN_TYPE_IDS : TOKEN_TYPE_IDS).map((id) => (
          <Checkbox key={ id } value={ id }>
            <Text fontSize="md">{ TOKEN_TYPES[id] }</Text>
          </Checkbox>
        )) }
      </CheckboxGroup> */ }
    </>
  );
};

export default TokenTypeFilter;
