import { CheckboxGroup, Checkbox, Text, Flex, Link, useCheckboxGroup } from '@chakra-ui/react';
import React from 'react';

const BRIDGED_TOKENS_CHAINS = [
  { id: '1', title: 'Ethereum' },
  { id: '56', title: 'Binance Smart Chain' },
  { id: '99', title: 'POA' },
];

interface Props {
  onChange: (nextValue: Array<string>) => void;
  defaultValue?: Array<string>;
}

const TokensBridgedChainsFilter = ({ onChange, defaultValue }: Props) => {
  const { value, setValue } = useCheckboxGroup({ defaultValue });

  const handleReset = React.useCallback(() => {
    setValue([]);
    onChange([]);
  }, [ onChange, setValue ]);

  const handleChange = React.useCallback((nextValue: Array<string>) => {
    setValue(nextValue);
    onChange(nextValue);
  }, [ onChange, setValue ]);

  return (
    <>
      <Flex justifyContent="space-between" fontSize="sm">
        <Text fontWeight={ 600 } variant="secondary">Show bridged tokens from</Text>
        <Link onClick={ handleReset }>Reset</Link>
      </Flex>
      <CheckboxGroup size="lg" onChange={ handleChange } value={ value }>
        { BRIDGED_TOKENS_CHAINS.map(({ title, id }) => (
          <Checkbox key={ id } value={ id }>
            <Text fontSize="md" whiteSpace="pre-wrap">{ title }</Text>
          </Checkbox>
        )) }
      </CheckboxGroup>
    </>
  );
};

export default React.memo(TokensBridgedChainsFilter);
