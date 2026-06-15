// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AggregatedTokenInfo } from 'src/features/multichain/types/client';
import type { TokenInfo } from 'src/slices/token/types/api';
import { getTokenTypeName } from 'src/slices/token/utils/token-types';

import type { EntityProps as AddressEntityProps } from 'src/slices/address/components/entity/AddressEntity';
import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';

import multichainConfig from 'src/features/multichain/chains-config';
import TokenAddToWallet from 'src/features/web3-wallet/components/TokenAddToWallet';

import config from 'src/config';
import getItemIndex from 'src/shared/lists/get-item-index';
import SimpleValue from 'src/shared/values/entity/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'src/shared/values/entity/utils';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { Tag } from 'src/toolkit/chakra/tag';

type Props = {
  token: TokenInfo | AggregatedTokenInfo;
  index: number;
  page: number;
  isLoading?: boolean;
};

const bridgedTokensFeature = config.features.bridgedTokens;

const TokensTableItem = ({
  token,
  page,
  index,
  isLoading,
}: Props) => {

  const {
    address_hash: addressHash,
    exchange_rate: exchangeRate,
    type,
    holders_count: holdersCount,
    circulating_market_cap: marketCap,
  } = token;

  const filecoinRobustAddress = 'filecoin_robust_address' in token ? token.filecoin_robust_address : undefined;
  const originalChainId = 'origin_chain_id' in token ? token.origin_chain_id : undefined;
  const chainInfos = 'chain_infos' in token ? token.chain_infos : undefined;

  const bridgedChainTag = bridgedTokensFeature.isEnabled ?
    bridgedTokensFeature.chains.find(({ id }) => id === originalChainId)?.short_title :
    undefined;

  const tokenAddress: AddressEntityProps['address'] = {
    hash: addressHash,
    filecoin: {
      robust: filecoinRobustAddress ?? null,
      actor_type: null,
      id: null,
    },
    name: '',
    is_contract: true,
    is_verified: false,
    ens_domain_name: null,
    implementations: [],
  };

  const chainInfo = React.useMemo(() => {
    if (!chainInfos) {
      return;
    }

    const chainId = Object.keys(chainInfos)[0];
    const chain = multichainConfig()?.chains.find((chain) => chain.id === chainId);
    return chain;
  }, [ chainInfos ]);

  return (
    <TableRow className="group">
      <TableCell>
        <Flex alignItems="flex-start">
          <Skeleton
            loading={ isLoading }
            textStyle="sm"
            fontWeight={ 600 }
            mr={ 3 }
            minW="28px"
          >
            { getItemIndex(index, page) }
          </Skeleton>
          <Flex overflow="hidden" flexDir="column" rowGap={ 2 }>
            <TokenEntity
              token={ token }
              chain={ chainInfo }
              isLoading={ isLoading }
              jointSymbol
              noCopy
              textStyle="sm"
              fontWeight="700"
              noLink={ type === 'NATIVE' }
            />
            { type !== 'NATIVE' && (
              <Flex columnGap={ 2 } py="5px" alignItems="center">
                <AddressEntity
                  address={ tokenAddress }
                  isLoading={ isLoading }
                  noIcon
                  textStyle="sm"
                  fontWeight={ 500 }
                  link={{ variant: 'secondary' }}
                />
                <TokenAddToWallet
                  token={ token }
                  isLoading={ isLoading }
                  iconSize={ 5 }
                  opacity={ 0 }
                  _groupHover={{ opacity: 1 }}
                  chainConfig={ chainInfo?.app_config }
                />
              </Flex>
            ) }
            <Flex columnGap={ 1 }>
              <Tag loading={ isLoading }>{ getTokenTypeName(type, chainInfo?.app_config) }</Tag>
              { bridgedChainTag && <Tag loading={ isLoading }>{ bridgedChainTag }</Tag> }
            </Flex>
          </Flex>
        </Flex>
      </TableCell>
      <TableCell isNumeric>
        { exchangeRate ? (
          <SimpleValue
            value={ BigNumber(exchangeRate) }
            accuracy={ 4 }
            loading={ isLoading }
            prefix="$"
          />
        ) : null }
      </TableCell>
      <TableCell isNumeric>
        { marketCap && (
          <SimpleValue
            value={ BigNumber(marketCap) }
            loading={ isLoading }
            prefix="$"
            accuracy={ DEFAULT_ACCURACY_USD }
          />
        ) }
      </TableCell>
      <TableCell isNumeric>
        <Skeleton
          loading={ isLoading }
          display="inline-block"
        >
          { Number(holdersCount).toLocaleString() }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default TokensTableItem;
