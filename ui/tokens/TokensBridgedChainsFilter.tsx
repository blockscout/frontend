import { CheckboxGroup, Checkbox, Text, Flex, Link, useCheckboxGroup, chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';

const feature = config.features.bridgedTokens;

interface Props {
  onChange: (nextValue: Array<string>) => void;
  defaultValue?: Array<string>;
}

const TokensBridgedChainsFilter = ({ onChange, defaultValue }: Props) => {
  const { value, setValue } = useCheckboxGroup({ defaultValue });

  const handleReset = React.useCallback(() => {
    if (value.length === 0) {
      return;
    }
    setValue([]);
    onChange([]);
  }, [ onChange, setValue, value ]);

  const handleChange = React.useCallback((nextValue: Array<string>) => {
    setValue(nextValue);
    onChange(nextValue);
  }, [ onChange, setValue ]);

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <>
      <Flex justifyContent="space-between" fontSize="sm">
        <Text fontWeight={ 600 } variant="secondary">Show bridged tokens from</Text>
        <Link
          onClick={ handleReset }
          color={ value.length > 0 ? 'link' : 'text_secondary' }
          _hover={{
            color: value.length > 0 ? 'link_hovered' : 'text_secondary',
          }}
        >
          Reset
        </Link>
      </Flex>
      <CheckboxGroup size="lg" onChange={ handleChange } value={ value }>
        { feature.chains.map(({ title, id, short_title: shortTitle }) => (
          <Checkbox key={ id } value={ id } fontSize="md" whiteSpace="pre-wrap">
            <span>{ title }</span>
            <chakra.span color="text_secondary"> ({ shortTitle })</chakra.span>
          </Checkbox>
        )) }
      </CheckboxGroup>
    </>
  );
};

export default React.memo(TokensBridgedChainsFilter);
