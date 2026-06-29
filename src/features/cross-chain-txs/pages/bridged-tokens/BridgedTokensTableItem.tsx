// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { StatsBridgedTokenItem, StatsBridgedTokenRow } from '@blockscout/interchain-indexer-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';
import { toTokenModel } from 'src/slices/token/utils/model';

import TokenAddToWallet from 'src/features/web3-wallet/components/TokenAddToWallet';

import getItemIndex from 'src/shared/lists/get-item-index';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

interface Props {
  data: StatsBridgedTokenRow;
  token: StatsBridgedTokenItem | undefined;
  index: number;
  page: number;
  isLoading?: boolean;
}

const BridgedTokensTableItem = ({ data, token, index, page, isLoading }: Props) => {

  const tokenInfo: schemas['Token'] | undefined = React.useMemo(() => {
    if (!token) {
      return;
    }

    return toTokenModel({
      ...token,
      decimals: String(token.decimals ?? '0'),
      address_hash: token.token_address,
      type: 'ERC-20',
    });
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
                <TokenAddToWallet
                  token={ tokenInfo }
                  isLoading={ isLoading }
                  iconSize={ 5 }
                  opacity={ 0 }
                  _groupHover={{ opacity: 1 }}
                />
              </Flex>
            </Flex>
          ) : <Skeleton loading={ isLoading } w="fit-content"><span>Unknown token</span></Skeleton> }
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
