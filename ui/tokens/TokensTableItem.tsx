import { Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';
import getItemIndex from 'lib/getItemIndex';
import { getTokenTypeName } from 'lib/token/tokenTypes';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { Tag } from 'toolkit/chakra/tag';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import type { EntityProps as AddressEntityProps } from 'ui/shared/entities/address/AddressEntity';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TruncatedValue from 'ui/shared/TruncatedValue';

type Props = {
  token: TokenInfo;
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
    filecoin_robust_address: filecoinRobustAddress,
    exchange_rate: exchangeRate,
    type,
    holders_count: holdersCount,
    circulating_market_cap: marketCap,
    origin_chain_id: originalChainId,
  } = token;

  const bridgedChainTag = bridgedTokensFeature.isEnabled ?
    bridgedTokensFeature.chains.find(({ id }) => id === originalChainId)?.short_title :
    undefined;

  const tokenAddress: AddressEntityProps['address'] = {
    hash: addressHash,
    filecoin: {
      robust: filecoinRobustAddress,
    },
    name: '',
    is_contract: true,
    is_verified: false,
    ens_domain_name: null,
    implementations: null,
  };

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
              isLoading={ isLoading }
              jointSymbol
              noCopy
              textStyle="sm"
              fontWeight="700"
            />
            <Flex columnGap={ 2 } py="5px" alignItems="center">
              <AddressEntity
                address={ tokenAddress }
                isLoading={ isLoading }
                noIcon
                textStyle="sm"
                fontWeight={ 500 }
                linkVariant="secondary"
              />
              <AddressAddToWallet
                token={ token }
                isLoading={ isLoading }
                iconSize={ 5 }
                opacity={ 0 }
                _groupHover={{ opacity: 1 }}
              />
            </Flex>
            <Flex columnGap={ 1 }>
              <Tag loading={ isLoading }>{ getTokenTypeName(type) }</Tag>
              { bridgedChainTag && <Tag loading={ isLoading }>{ bridgedChainTag }</Tag> }
            </Flex>
          </Flex>
        </Flex>
      </TableCell>
      <TableCell isNumeric>
        <TruncatedValue
          value={ exchangeRate ? `$${ Number(exchangeRate).toLocaleString(undefined, { minimumSignificantDigits: 4 }) }` : '' }
          isLoading={ isLoading }
          maxW="100%"
        />
      </TableCell>
      <TableCell isNumeric maxWidth="300px" width="300px">
        <TruncatedValue
          value={ marketCap ? `$${ BigNumber(marketCap).toFormat() }` : '' }
          isLoading={ isLoading }
          maxW="100%"
        />
      </TableCell>
      <TableCell isNumeric>
        <Skeleton
          loading={ isLoading }
          textStyle="sm"
          fontWeight={ 500 }
          display="inline-block"
        >
          { Number(holdersCount).toLocaleString() }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default TokensTableItem;
