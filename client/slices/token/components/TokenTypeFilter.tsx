// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, useCheckboxGroup, Fieldset } from '@chakra-ui/react';
import React from 'react';

import type { NFTTokenType, TokenType } from 'client/slices/token/types/api';
import { getTokenTypes } from 'client/slices/token/utils/token-types';
import type { ClusterChainConfig } from 'types/multichain';

import { Button } from 'toolkit/chakra/button';
import { Checkbox, CheckboxGroup } from 'toolkit/chakra/checkbox';

type Props<T extends TokenType | NFTTokenType> = {
  onChange: (nextValue: Array<T>) => void;
  defaultValue?: Array<T>;
  nftOnly: T extends NFTTokenType ? true : false;
  chainConfig?: Array<ClusterChainConfig['app_config']> | ClusterChainConfig['app_config'];
  title?: React.ReactNode;
};
const TokenTypeFilter = <T extends TokenType | NFTTokenType>({ nftOnly, onChange, defaultValue, chainConfig, title }: Props<T>) => {
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

  const tokenTypes = React.useMemo(() => {
    return getTokenTypes(nftOnly, chainConfig);
  }, [ chainConfig, nftOnly ]);

  return (
    <>
      <Flex justifyContent="space-between" textStyle="sm">
        <Box fontWeight={ 600 } color="text.secondary">{ title || 'Type' }</Box>
        <Button
          variant="link"
          onClick={ handleReset }
          disabled={ value.length === 0 }
          textStyle="sm"
          ml={ 3 }
        >
          Reset
        </Button>
      </Flex>
      <Fieldset.Root>
        <CheckboxGroup defaultValue={ defaultValue } onValueChange={ handleChange } value={ value } name="token_type">
          <Fieldset.Content>
            { Object.keys(tokenTypes).map((id) => (
              <Checkbox key={ id } value={ id }>
                { tokenTypes[id as keyof typeof tokenTypes] }
              </Checkbox>
            )) }
          </Fieldset.Content>
        </CheckboxGroup>
      </Fieldset.Root>
    </>
  );
};

export default TokenTypeFilter;
