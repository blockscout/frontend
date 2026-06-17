// SPDX-License-Identifier: LicenseRef-Blockscout

import { VStack } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import type { AddressTokenItem } from 'src/features/multichain/types/client';
import { getTokenTypeName, isConfidentialTokenType } from 'src/slices/token/utils/token-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';
import NativeTokenTag from 'src/slices/token/components/NativeTokenTag';

import multichainConfig from 'src/features/multichain/chains-config';

import calculateUsdValue from 'src/shared/values/entity/calculateUsdValue';
import ConfidentialValue from 'src/shared/values/entity/ConfidentialValue';
import SimpleValue from 'src/shared/values/entity/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'src/shared/values/entity/utils';

import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { Tag } from 'src/toolkit/chakra/tag';

interface Props {
  data: AddressTokenItem;
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

  const isNativeToken = chainInfo?.app_config.slices.address.nativeTokenAddress &&
    data.token.address_hash.toLowerCase() === chainInfo?.app_config.slices.address.nativeTokenAddress.toLowerCase();

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
