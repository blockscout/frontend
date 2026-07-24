// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { ChainInfo, StatsBridgedTokenItem, StatsBridgedTokenRow } from '@blockscout/interchain-indexer-types';

import AddressEntityInterchain from 'src/slices/address/components/entity/AddressEntityInterchain';
import TokenEntityInterchain from 'src/slices/token/components/entity/TokenEntityInterchain';
import { toTokenModel } from 'src/slices/token/utils/model';

import TokenAddToWallet from 'src/features/web3-wallet/components/TokenAddToWallet';

import config from 'src/config';
import getItemIndex from 'src/shared/lists/get-item-index';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

interface Props {
  data: StatsBridgedTokenRow;
  tokenInfo?: StatsBridgedTokenItem;
  chainInfo?: ChainInfo;
  index: number;
  page: number;
  isLoading?: boolean;
}

const BridgedTokensTableItem = ({ data, tokenInfo, chainInfo, index, page, isLoading }: Props) => {

  const tokenModel = React.useMemo(() => {
    if (!tokenInfo) {
      return undefined;
    }

    return toTokenModel({
      ...tokenInfo,
      decimals: String(tokenInfo.decimals ?? '0'),
      address_hash: tokenInfo.token_address,
      type: 'ERC-20',
    });
  }, [ tokenInfo ]);

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
          { tokenModel ? (
            <Flex overflow="hidden" flexDir="column" rowGap={ 2 }>
              <TokenEntityInterchain
                token={ tokenModel }
                chain={ chainInfo }
                isLoading={ isLoading }
                jointSymbol
                noCopy
                noLink={ !chainInfo }
                textStyle="sm"
                fontWeight="700"
              />
              <Flex columnGap={ 2 } py="5px" alignItems="center">
                <AddressEntityInterchain
                  address={{ hash: tokenModel.address_hash }}
                  chain={ chainInfo }
                  isLoading={ isLoading }
                  noIcon
                  textStyle="sm"
                  fontWeight={ 500 }
                  link={{ variant: 'secondary' }}
                  noLink={ !chainInfo }
                />
                { chainInfo?.id === config.chain.id && (
                  <TokenAddToWallet
                    token={ tokenModel }
                    isLoading={ isLoading }
                    iconSize={ 5 }
                    opacity={ 0 }
                    _groupHover={{ opacity: 1 }}
                  />
                ) }
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
