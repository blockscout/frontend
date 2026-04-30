import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { StatsBridgedTokenItem, StatsBridgedTokenRow } from '@blockscout/interchain-indexer-types';
import type { TokenInfo } from 'types/api/token';

import getItemIndex from 'lib/getItemIndex';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';

interface Props {
  data: StatsBridgedTokenRow;
  token: StatsBridgedTokenItem | undefined;
  index: number;
  page: number;
  isLoading?: boolean;
}

const BridgedTokensTableItem = ({ data, token, index, page, isLoading }: Props) => {

  const tokenInfo: TokenInfo | undefined = React.useMemo(() => {
    if (!token) {
      return;
    }

    return {
      symbol: token.symbol ?? null,
      address_hash: token.token_address,
      type: 'ERC-20',
      name: token.name ?? null,
      decimals: String(token.decimals ?? '0'),
      holders_count: null,
      exchange_rate: null,
      total_supply: null,
      icon_url: token.icon_url ?? null,
      circulating_market_cap: null,
      reputation: null,
    };
  }, [ token ]);

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
          { tokenInfo ? (
            <Flex overflow="hidden" flexDir="column" rowGap={ 2 }>
              <TokenEntity
                token={ tokenInfo }
                isLoading={ isLoading }
                jointSymbol
                noCopy
                textStyle="sm"
                fontWeight="700"
              />
              <Flex columnGap={ 2 } py="5px" alignItems="center">
                <AddressEntity
                  address={{ hash: tokenInfo.address_hash }}
                  isLoading={ isLoading }
                  noIcon
                  textStyle="sm"
                  fontWeight={ 500 }
                  link={{ variant: 'secondary' }}
                />
                <AddressAddToWallet
                  token={ tokenInfo }
                  isLoading={ isLoading }
                  iconSize={ 5 }
                  opacity={ 0 }
                  _groupHover={{ opacity: 1 }}
                />
              </Flex>
            </Flex>
          ) : <span>Unknown token</span> }
        </Flex>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading } w="fit-content" ml="auto">
          { Number(data.input_transfers_count).toLocaleString() }
        </Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading } w="fit-content" ml="auto">
          { Number(data.output_transfers_count).toLocaleString() }
        </Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading } w="fit-content" ml="auto">
          { Number(data.total_transfers_count).toLocaleString() }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(BridgedTokensTableItem);
