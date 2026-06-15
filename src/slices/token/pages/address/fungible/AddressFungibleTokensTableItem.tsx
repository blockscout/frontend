// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, HStack } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import type { AddressFungibleTokensItem } from '../types';
import { getTokenTypeName, isConfidentialTokenType } from 'src/slices/token/utils/token-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';
import NativeTokenTag from 'src/slices/token/components/NativeTokenTag';

import multichainConfig from 'src/features/multichain/chains-config';
import TokenAddToWallet from 'src/features/web3-wallet/components/TokenAddToWallet';

import config from 'src/config';
import calculateUsdValue from 'src/shared/values/entity/calculateUsdValue';
import ConfidentialValue from 'src/shared/values/entity/ConfidentialValue';
import SimpleValue from 'src/shared/values/entity/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'src/shared/values/entity/utils';

import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { Tag } from 'src/toolkit/chakra/tag';

type Props = AddressFungibleTokensItem & { isLoading: boolean; hasAdditionalTokenTypes?: boolean };

const AddressFungibleTokensTableItem = ({
  token,
  value,
  chain_values: chainValues,
  isLoading,
  hasAdditionalTokenTypes,
}: Props) => {

  const {
    valueBn: tokenQuantity,
    usdBn: tokenValue,
  } = calculateUsdValue({ amount: value, exchangeRate: token.exchange_rate, decimals: token.decimals });

  const isNativeToken = config.slices.address.nativeTokenAddress &&
    token.address_hash.toLowerCase() === config.slices.address.nativeTokenAddress.toLowerCase();

  const chainInfo = React.useMemo(() => {
    if (!chainValues) {
      return;
    }

    const chainId = Object.keys(chainValues)[0];
    const chain = multichainConfig()?.chains.find((chain) => chain.id === chainId);
    return chain;
  }, [ chainValues ]);

  const cellVerticalAlign = hasAdditionalTokenTypes ? 'top' : 'middle';

  return (
    <TableRow className="group" >
      <TableCell verticalAlign={ cellVerticalAlign }>
        <HStack gap={ 2 }>
          <TokenEntity
            token={ token }
            chain={ chainInfo }
            isLoading={ isLoading }
            noCopy
            jointSymbol
            fontWeight="700"
            width="auto"
          />
          { isNativeToken && <NativeTokenTag/> }
        </HStack>
        { hasAdditionalTokenTypes && <Tag loading={ isLoading } mt={ 2 }>{ getTokenTypeName(token.type) }</Tag> }
      </TableCell>
      <TableCell verticalAlign={ cellVerticalAlign }>
        <Flex alignItems="center" width="150px" justifyContent="space-between">
          <AddressEntity
            address={{ hash: token.address_hash }}
            isLoading={ isLoading }
            truncation="constant"
            noIcon
          />
          <TokenAddToWallet token={ token } ml={ 4 } isLoading={ isLoading } opacity="0" _groupHover={{ opacity: 1 }}/>
        </Flex>
      </TableCell>
      <TableCell isNumeric verticalAlign={ cellVerticalAlign }>
        { token.exchange_rate ? (
          <SimpleValue
            value={ BigNumber(token.exchange_rate) }
            prefix="$"
            loading={ isLoading }
            color={ isNativeToken ? 'text.secondary' : undefined }
          />
        ) : null }
      </TableCell>
      <TableCell isNumeric verticalAlign={ cellVerticalAlign }>
        { isConfidentialTokenType(token.type) ? (
          <ConfidentialValue loading={ isLoading }/>
        ) : (
          <SimpleValue
            value={ tokenQuantity }
            color={ isNativeToken ? 'text.secondary' : undefined }
            loading={ isLoading }
          />
        ) }
      </TableCell>
      <TableCell isNumeric verticalAlign={ cellVerticalAlign }>
        { isConfidentialTokenType(token.type) && (
          <ConfidentialValue loading={ isLoading }/>
        ) }
        { !isConfidentialTokenType(token.type) && token.exchange_rate && (
          <SimpleValue
            value={ tokenValue }
            prefix="$"
            color={ isNativeToken ? 'text.secondary' : undefined }
            loading={ isLoading }
            accuracy={ DEFAULT_ACCURACY_USD }
          />
        ) }
      </TableCell>
    </TableRow>
  );
};

export default React.memo(AddressFungibleTokensTableItem);
