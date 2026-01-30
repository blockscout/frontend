// eslint-disable-next-line no-restricted-imports
import { Checkbox } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { clamp } from 'es-toolkit';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import multichainConfig from 'configs/multichain';
import { CheckboxGroup } from 'toolkit/chakra/checkbox';

import OpSuperchainAddressPortfolioCard from './OpSuperchainAddressPortfolioCard';

interface Props {
  isLoading: boolean;
  value: Array<string>;
  onChange: (nextValue: Array<string>) => void;
  data?: multichain.AddressPortfolio;
}

const OpSuperchainAddressPortfolioCards = ({ isLoading, value, onChange, data }: Props) => {
  const chains = multichainConfig()?.chains;

  const columnNum = clamp(chains?.length || 0, 3, 5);

  const items = React.useMemo(() => {
    const totalValue = BigNumber(data?.total_value ?? '0');
    return data?.chain_values ?
      Object.entries(data.chain_values)
        .map(([ chainId, value ]) => {
          const chain = chains?.find((chain) => chain.id === chainId);
          if (!chain) {
            return null;
          }

          const valueBn = BigNumber(value);
          return {
            chain,
            value: valueBn,
            share: totalValue.gt(0) ? valueBn.div(totalValue).toNumber() : undefined,
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.value.minus(a.value).toNumber()) :
      [];
  }, [ data?.chain_values, data?.total_value, chains ]);

  if (items.length === 0) {
    return null;
  }

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
      { items.map((item) => {
        return (
          <Checkbox.Root
            key={ item.chain.id }
            value={ item.chain.id }
            flexBasis={{
              base: (items?.length || 0) > 1 ? 'calc(50% - 4px)' : '100%',
              lg: `calc((100% - ${ (columnNum - 1) * 8 }px) / ${ columnNum })`,
            }}
          >
            <Checkbox.HiddenInput/>
            <OpSuperchainAddressPortfolioCard
              chain={ item.chain }
              value={ item.value }
              share={ item.share }
              loading={ isLoading }
              selected={ value.includes(item.chain.id) }
              noneSelected={ value.length === 0 }
            />
          </Checkbox.Root>
        );
      }) }
    </CheckboxGroup>
  );
};

export default React.memo(OpSuperchainAddressPortfolioCards);
