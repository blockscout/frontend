import { CheckboxGroup, Text, Flex, useCheckboxGroup, chakra, Fieldset } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { Button } from 'toolkit/chakra/button';
import { Checkbox } from 'toolkit/chakra/checkbox';

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
        <Text fontWeight={ 600 } color="text.secondary">Show bridged tokens from</Text>
        <Button
          variant="link"
          onClick={ handleReset }
          disabled={ value.length === 0 }
        >
          Reset
        </Button>
      </Flex>
      <Fieldset.Root>
        <CheckboxGroup defaultValue={ defaultValue } onValueChange={ handleChange } value={ value } name="bridged_token_chain">
          <Fieldset.Content>
            { feature.chains.map(({ title, id, short_title: shortTitle }) => (
              <Checkbox key={ id } value={ id } textStyle="md" whiteSpace="pre-wrap">
                <span>{ title }</span>
                <chakra.span color="text_secondary"> ({ shortTitle })</chakra.span>
              </Checkbox>
            )) }
          </Fieldset.Content>
        </CheckboxGroup>
      </Fieldset.Root>
    </>
  );
};

export default React.memo(TokensBridgedChainsFilter);
