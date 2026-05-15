// SPDX-License-Identifier: LicenseRef-Blockscout

import { Grid } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import type { AddressTokensErc20Item } from 'client/slices/token/pages/address/types';
import { getTokenTypeName, isConfidentialTokenType } from 'client/slices/token/utils/token-types';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';
import TokenEntity from 'client/slices/token/components/entity/TokenEntity';

import multichainConfig from 'configs/multichain';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import NativeTokenTag from 'ui/shared/celo/NativeTokenTag';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import calculateUsdValue from 'ui/shared/value/calculateUsdValue';
import ConfidentialValue from 'ui/shared/value/ConfidentialValue';
import SimpleValue from 'ui/shared/value/SimpleValue';

interface Props {
  data: AddressTokensErc20Item;
  isLoading: boolean;
}

const MultichainAddressTokensListItem = ({ data, isLoading }: Props) => {
  const chainInfo = React.useMemo(() => {
    if (!data.chain_values) {
      return;
    }

    const chainId = Object.keys(data.chain_values)[0];
    const chain = multichainConfig()?.chains.find((chain) => chain.id === chainId);
    return chain;
  }, [ data.chain_values ]);

  const isNativeToken = chainInfo?.app_config.UI.views.address.nativeTokenAddress &&
    data.token.address_hash.toLowerCase() === chainInfo?.app_config.UI.views.address.nativeTokenAddress.toLowerCase();

  const {
    valueBn: tokenQuantity,
    usdBn: tokenValue,
  } = calculateUsdValue({ amount: data.value, exchangeRate: data.token.exchange_rate, decimals: data.token.decimals });

  return (
    <ListItemMobile py={ 3 } rowGap={ 3 } textStyle="sm">
      { isNativeToken ?
        <NativeTokenTag chainConfig={ chainInfo?.app_config }/> :
        <Tag loading={ isLoading }>{ getTokenTypeName(data.token.type, chainInfo?.app_config) }</Tag> }
      <TokenEntity
        token={ data.token }
        chain={ chainInfo }
        isLoading={ isLoading }
        noCopy
        jointSymbol
        fontWeight="600"
        width="auto"
        maxW="100%"
        noLink={ data.token.type === 'NATIVE' }
      />
      { data.token.type !== 'NATIVE' && (
        <AddressEntity
          address={{ hash: data.token.address_hash }}
          isLoading={ isLoading }
          noIcon
          link={{ variant: 'secondary' }}
          w="full"
        />
      ) }
      <Grid
        gridTemplateColumns="minmax(auto, 100px) 1fr"
        rowGap={ 3 }
      >
        { data.token.exchange_rate ? (
          <>
            <Skeleton loading={ isLoading } fontWeight="500">
              <span>Price</span>
            </Skeleton>
            <SimpleValue
              value={ BigNumber(data.token.exchange_rate) }
              prefix="$"
              loading={ isLoading }
              color={ isNativeToken ? 'text.secondary' : undefined }
            />
          </>
        ) : null }
        <Skeleton loading={ isLoading } fontWeight="500">
          <span>Quantity</span>
        </Skeleton>
        { isConfidentialTokenType(data.token.type) ? (
          <ConfidentialValue loading={ isLoading }/>
        ) : (
          <SimpleValue
            value={ tokenQuantity }
            loading={ isLoading }
            color={ isNativeToken ? 'text.secondary' : undefined }
          />
        ) }
        { data.token.exchange_rate && (
          <>
            <Skeleton loading={ isLoading } fontWeight="500">
              <span>Value</span>
            </Skeleton>
            { isConfidentialTokenType(data.token.type) ? (
              <ConfidentialValue loading={ isLoading }/>
            ) : (
              <SimpleValue
                value={ tokenValue }
                prefix="$"
                loading={ isLoading }
                color={ isNativeToken ? 'text.secondary' : undefined }
              />
            ) }
          </>
        ) }
      </Grid>
    </ListItemMobile>
  );
};

export default React.memo(MultichainAddressTokensListItem);
