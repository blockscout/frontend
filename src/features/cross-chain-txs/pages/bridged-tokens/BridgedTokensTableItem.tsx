// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { ChainInfo, StatsBridgedTokenItem, StatsBridgedTokenRow } from '@blockscout/interchain-indexer-types';
import { getTokenTypeName } from 'src/slices/token/utils/token-types';

import AddressEntityInterchain from 'src/slices/address/components/entity/AddressEntityInterchain';
import TokenEntityInterchain from 'src/slices/token/components/entity/TokenEntityInterchain';
import { toTokenModel } from 'src/slices/token/utils/model';

import { isNativeToken, toCoreTokenType } from 'src/features/cross-chain-txs/utils/token-type';
import TokenAddToWallet from 'src/features/web3-wallet/components/TokenAddToWallet';

import config from 'src/config';
import getItemIndex from 'src/shared/lists/get-item-index';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { Tag } from 'src/toolkit/chakra/tag';

interface Props {
  data: StatsBridgedTokenRow;
  tokenInfo?: StatsBridgedTokenItem;
  chainInfo?: ChainInfo;
  index: number;
  page: number;
  isLoading?: boolean;
}

const BridgedTokensTableItem = ({ data, tokenInfo, chainInfo, index, page, isLoading }: Props) => {

  const isNative = isNativeToken(tokenInfo?.type);
  const tokenType = toCoreTokenType(tokenInfo?.type);

  const tokenModel = React.useMemo(() => {
    if (!tokenInfo) {
      return undefined;
    }

    // The core token model has no native kind; only the entity (which accepts any kind) gets it.
    return toTokenModel({
      ...tokenInfo,
      decimals: String(tokenInfo.decimals ?? '0'),
      address_hash: tokenInfo.token_address,
      type: tokenType === 'NATIVE' ? undefined : tokenType,
    });
  }, [ tokenInfo, tokenType ]);

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
                token={{ ...tokenModel, type: tokenType }}
                chain={ chainInfo }
                isLoading={ isLoading }
                jointSymbol
                noCopy
                noLink={ !chainInfo || isNative }
                textStyle="sm"
                fontWeight="700"
              />
              { !isNative && (
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
              ) }
              <Tag loading={ isLoading } w="fit-content">{ getTokenTypeName(tokenType) }</Tag>
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
