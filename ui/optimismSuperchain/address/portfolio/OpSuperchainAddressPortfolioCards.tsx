// eslint-disable-next-line no-restricted-imports
import { Checkbox, useCheckboxGroup } from '@chakra-ui/react';
import { clamp } from 'es-toolkit';
import React from 'react';

import multichainConfig from 'configs/multichain';
import { CheckboxGroup } from 'toolkit/chakra/checkbox';

import OpSuperchainAddressPortfolioCard from './OpSuperchainAddressPortfolioCard';

interface Props {
  isLoading: boolean;
}

const OpSuperchainAddressPortfolioCards = ({ isLoading }: Props) => {
  const chains = multichainConfig()?.chains;

  const { value, setValue } = useCheckboxGroup();

  const handleChange = React.useCallback((nextValue: Array<string>) => {
    setValue(nextValue);
  }, [ setValue ]);

  const columnNum = clamp(chains?.length || 0, 3, 5);

  return (
    <CheckboxGroup
      onValueChange={ handleChange }
      value={ value }
      name="chains"
      orientation="horizontal"
      gap={ 2 }
      flexWrap="wrap"
      mt={ 2 }
      mb={ 6 }
    >
      { chains?.map((chain) => (
        <Checkbox.Root
          key={ chain.id }
          value={ chain.id }
          flexBasis={{
            base: (chains?.length || 0) > 1 ? 'calc(50% - 4px)' : '100%',
            lg: `calc((100% - ${ (columnNum - 1) * 8 }px) / ${ columnNum })`,
          }}
        >
          <Checkbox.HiddenInput/>
          <OpSuperchainAddressPortfolioCard
            chain={ chain }
            loading={ isLoading }
            selected={ value.includes(chain.id) }
            noneSelected={ value.length === 0 }
          />
        </Checkbox.Root>
      )) }
    </CheckboxGroup>
  );
};

export default React.memo(OpSuperchainAddressPortfolioCards);
