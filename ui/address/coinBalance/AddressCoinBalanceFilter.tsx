import { createListCollection } from '@chakra-ui/react';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';
import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';
import type { SelectOption } from 'toolkit/chakra/select';
import { Select } from 'toolkit/chakra/select';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import NativeTokenIcon from 'ui/shared/NativeTokenIcon';

export const ALL_ASSETS_FILTER = 'all';
export const NATIVE_ASSET_FILTER = 'native';

export type AddressCoinBalanceFilterValue = typeof ALL_ASSETS_FILTER | typeof NATIVE_ASSET_FILTER | string;

interface Props {
  value: AddressCoinBalanceFilterValue;
  tokenBalances: Array<AddressTokenBalance> | undefined;
  isLoading?: boolean;
  onChange: (value: AddressCoinBalanceFilterValue) => void;
}

export function getCoinBalanceFilterValue(value: unknown): AddressCoinBalanceFilterValue {
  return typeof value === 'string' && value.length > 0 ? value : ALL_ASSETS_FILTER;
}

export function getUniqueBalanceTokens(tokenBalances: Array<AddressTokenBalance> | undefined) {
  const tokensByAddress = new Map<string, TokenInfo>();

  tokenBalances?.forEach(({ token }) => {
    tokensByAddress.set(token.address_hash.toLowerCase(), token);
  });

  return Array.from(tokensByAddress.values());
}

const AddressCoinBalanceFilter = ({ value, tokenBalances, isLoading, onChange }: Props) => {
  const collection = React.useMemo(() => {
    const tokenOptions: Array<SelectOption> = getUniqueBalanceTokens(tokenBalances).map((token) => ({
      value: token.address_hash,
      label: token.symbol || token.name || token.address_hash,
      icon: <TokenEntity.Icon token={ token }/>,
    }));

    return createListCollection<SelectOption>({
      items: [
        {
          value: ALL_ASSETS_FILTER,
          label: 'All assets',
        },
        {
          value: NATIVE_ASSET_FILTER,
          label: config.chain.currency.symbol || 'Native coin',
          icon: <NativeTokenIcon boxSize={ 5 } mr={ 2 }/>,
        },
        ...tokenOptions,
      ],
    });
  }, [ tokenBalances ]);

  const handleValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    onChange(getCoinBalanceFilterValue(value[0]));
  }, [ onChange ]);

  return (
    <Select
      collection={ collection }
      placeholder="Asset"
      value={ [ value ] }
      onValueChange={ handleValueChange }
      loading={ isLoading }
      size="sm"
      w={{ base: '100%', lg: '280px' }}
      mb={ 6 }
    />
  );
};

export default React.memo(AddressCoinBalanceFilter);
