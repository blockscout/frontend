import { Box, Flex, Td, Tr, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import Tag from 'ui/shared/chakra/Tag';
import type { EntityProps as AddressEntityProps } from 'ui/shared/entities/address/AddressEntity';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

type Props = {
  token: TokenInfo;
  index: number;
  page: number;
  isLoading?: boolean;
}

const PAGE_SIZE = 50;

const TokensTableItem = ({
  token,
  page,
  index,
  isLoading,
}: Props) => {

  const {
    address,
    exchange_rate: exchangeRate,
    type,
    holders,
    circulating_market_cap: marketCap,
    bridge_type: bridgeType,
  } = token;

  const tokenAddress: AddressEntityProps['address'] = {
    hash: address,
    name: '',
    implementation_name: null,
    is_contract: true,
    is_verified: false,
  };

  return (
    <Tr>
      <Td>
        <Flex alignItems="flex-start">
          <Skeleton
            isLoaded={ !isLoading }
            fontSize="sm"
            lineHeight="20px"
            fontWeight={ 600 }
            mr={ 3 }
            minW="28px"
          >
            { (page - 1) * PAGE_SIZE + index + 1 }
          </Skeleton>
          <Box overflow="hidden">
            <TokenEntity
              token={ token }
              isLoading={ isLoading }
              jointSymbol
              noCopy
              fontSize="sm"
              fontWeight="700"
            />
            <Box ml={ 7 } mt={ 2 }>
              <Flex>
                <AddressEntity
                  address={ tokenAddress }
                  isLoading={ isLoading }
                  noIcon
                  truncation="constant"
                  fontSize="sm"
                  fontWeight={ 500 }
                />
                <AddressAddToWallet token={ token } ml={ 2 } isLoading={ isLoading }/>
              </Flex>
              <Flex mt={ 3 } columnGap={ 1 }>
                <Tag isLoading={ isLoading }>{ type }</Tag>
                { bridgeType && <Tag isLoading={ isLoading }>{ bridgeType }</Tag> }
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={ !isLoading } fontSize="sm" lineHeight="24px" fontWeight={ 500 } display="inline-block">
          { exchangeRate && `$${ Number(exchangeRate).toLocaleString(undefined, { minimumSignificantDigits: 4 }) }` }
        </Skeleton>
      </Td>
      <Td isNumeric maxWidth="300px" width="300px">
        <Skeleton isLoaded={ !isLoading } fontSize="sm" lineHeight="24px" fontWeight={ 500 } display="inline-block">
          { marketCap && `$${ BigNumber(marketCap).toFormat() }` }
        </Skeleton>
      </Td>
      <Td isNumeric>
        <Skeleton
          isLoaded={ !isLoading }
          fontSize="sm"
          lineHeight="24px"
          fontWeight={ 500 }
          display="inline-block"
        >
          { Number(holders).toLocaleString() }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default TokensTableItem;
