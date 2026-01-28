// eslint-disable-next-line no-restricted-imports
import { Checkbox } from '@chakra-ui/react';
import { clamp } from 'es-toolkit';
import React from 'react';

import multichainConfig from 'configs/multichain';
import { CheckboxGroup } from 'toolkit/chakra/checkbox';

import OpSuperchainAddressPortfolioCard from './OpSuperchainAddressPortfolioCard';

interface Props {
  isLoading: boolean;
  value: Array<string>;
  onChange: (nextValue: Array<string>) => void;
  chainIds: Array<string>;
}

const OpSuperchainAddressPortfolioCards = ({ isLoading, value, onChange, chainIds }: Props) => {
  const chains = multichainConfig()?.chains;

  const columnNum = clamp(chains?.length || 0, 3, 5);

  return (
    <CheckboxGroup
      onValueChange={ onChange }
      value={ value }
      name="chains"
      orientation="horizontal"
      gap={ 2 }
      flexWrap="wrap"
      mt={ 2 }
      mb={ 6 }
    >
      { chainIds.map((chainId) => {
        const chain = chains?.find((chain) => chain.id === chainId);

        if (!chain) {
          return null;
        }

        return (
          <Checkbox.Root
            key={ chain.id }
            value={ chain.id }
            flexBasis={{
              base: (chainIds?.length || 0) > 1 ? 'calc(50% - 4px)' : '100%',
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
        );
      }) }
    </CheckboxGroup>
  );
};

export default React.memo(OpSuperchainAddressPortfolioCards);
