import { VStack } from '@chakra-ui/react';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import type { AddressTokensErc20Item } from 'ui/address/tokens/types';

import multichainConfig from 'configs/multichain';
import { getTokenTypeName } from 'lib/token/tokenTypes';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { Tag } from 'toolkit/chakra/tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import calculateUsdValue from 'ui/shared/value/calculateUsdValue';
import SimpleValue from 'ui/shared/value/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'ui/shared/value/utils';

interface Props {
  data: AddressTokensErc20Item;
  isLoading: boolean;
}

const OpSuperchainAddressTokensTableItem = ({ data, isLoading }: Props) => {

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
          <Tag loading={ isLoading }>{ getTokenTypeName(data.token.type, chainInfo?.app_config) }</Tag>
        </VStack>
      </TableCell>
      <TableCell isNumeric>
        { data.token.exchange_rate ? (
          <SimpleValue
            value={ BigNumber(data.token.exchange_rate) }
            prefix="$"
            loading={ isLoading }
          />
        ) : null }
      </TableCell>
      <TableCell isNumeric>
        <SimpleValue
          value={ tokenQuantity }
          loading={ isLoading }
        />
      </TableCell>
      <TableCell isNumeric>
        { data.token.exchange_rate && (
          <SimpleValue
            value={ tokenValue }
            prefix="$"
            loading={ isLoading }
            accuracy={ DEFAULT_ACCURACY_USD }
          />
        ) }
      </TableCell>
    </TableRow>
  );
};

export default React.memo(OpSuperchainAddressTokensTableItem);
