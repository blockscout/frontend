// SPDX-License-Identifier: LicenseRef-Blockscout

import { VStack } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import type { AddressTokensErc20Item } from 'client/slices/token/pages/address/types';
import { getTokenTypeName, isConfidentialTokenType } from 'client/slices/token/utils/token-types';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';
import TokenEntity from 'client/slices/token/components/entity/TokenEntity';

import multichainConfig from 'configs/multichain';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { Tag } from 'toolkit/chakra/tag';
import NativeTokenTag from 'ui/shared/celo/NativeTokenTag';
import calculateUsdValue from 'ui/shared/value/calculateUsdValue';
import ConfidentialValue from 'ui/shared/value/ConfidentialValue';
import SimpleValue from 'ui/shared/value/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'ui/shared/value/utils';

interface Props {
  data: AddressTokensErc20Item;
  isLoading: boolean;
}

const MultichainAddressTokensTableItem = ({ data, isLoading }: Props) => {

  const {
    valueBn: tokenQuantity,
    usdBn: tokenValue,
  } = calculateUsdValue({ amount: data.value, exchangeRate: data.token.exchange_rate, decimals: data.token.decimals });

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

  return (
    <TableRow>
      <TableCell>
        <VStack alignItems="flex-start" rowGap={ 2.5 }>
          <TokenEntity
            token={ data.token }
            chain={ chainInfo }
            isLoading={ isLoading }
            noCopy
            jointSymbol
            fontWeight="700"
            width="auto"
            noLink={ data.token.type === 'NATIVE' }
          />
          { data.token.type !== 'NATIVE' && (
            <AddressEntity
              address={{ hash: data.token.address_hash }}
              isLoading={ isLoading }
              noIcon
              link={{ variant: 'secondary' }}
            />
          ) }
          { isNativeToken ?
            <NativeTokenTag chainConfig={ chainInfo?.app_config }/> :
            <Tag loading={ isLoading }>{ getTokenTypeName(data.token.type, chainInfo?.app_config) }</Tag> }
        </VStack>
      </TableCell>
      <TableCell isNumeric>
        { data.token.exchange_rate ? (
          <SimpleValue
            value={ BigNumber(data.token.exchange_rate) }
            prefix="$"
            loading={ isLoading }
            color={ isNativeToken ? 'text.secondary' : undefined }
          />
        ) : null }
      </TableCell>
      <TableCell isNumeric>
        { isConfidentialTokenType(data.token.type) ? (
          <ConfidentialValue loading={ isLoading }/>
        ) : (
          <SimpleValue
            value={ tokenQuantity }
            loading={ isLoading }
            color={ isNativeToken ? 'text.secondary' : undefined }
          />
        ) }
      </TableCell>
      <TableCell isNumeric>
        { data.token.exchange_rate && (
          isConfidentialTokenType(data.token.type) ? (
            <ConfidentialValue loading={ isLoading }/>
          ) : (
            <SimpleValue
              value={ tokenValue }
              prefix="$"
              loading={ isLoading }
              accuracy={ DEFAULT_ACCURACY_USD }
              color={ isNativeToken ? 'text.secondary' : undefined }
            />
          )) }
      </TableCell>
    </TableRow>
  );
};

export default React.memo(MultichainAddressTokensTableItem);
