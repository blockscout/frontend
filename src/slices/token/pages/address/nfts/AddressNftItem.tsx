// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { AddressNFT } from 'src/slices/address/types/api';
import { getTokenTypeName } from 'src/slices/token/utils/token-types';

import NftEntity from 'src/slices/token/components/entity/NftEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';
import NftMedia from 'src/slices/token/components/nft-media/NftMedia';

import { route } from 'src/shared/router/routes';
import calculateUsdValue from 'src/shared/values/entity/calculateUsdValue';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tag } from 'src/toolkit/chakra/tag';

import AddressNftItemContainer from './AddressNftItemContainer';

type Props = AddressNFT & { isLoading: boolean; withTokenLink?: boolean; chain?: ClusterChainConfig };

const AddressNftItem = ({ value, isLoading, withTokenLink, chain, ...tokenInstance }: Props) => {
  const { token } = tokenInstance;
  const valueResult = token.decimals && value ? calculateUsdValue({ amount: value, decimals: token.decimals, accuracy: 2 }).valueStr : value;
  const tokenInstanceLink = tokenInstance.id ?
    route({ pathname: '/token/[hash]/instance/[id]', query: { hash: token.address_hash, id: tokenInstance.id } }, chain ? { chain } : undefined) :
    undefined;

  return (
    <AddressNftItemContainer position="relative">
      <Skeleton loading={ isLoading } className="light">
        <Tag background="gray.50" zIndex={ 1 } position="absolute" top="18px" right="18px">{ getTokenTypeName(token.type) }</Tag>
      </Skeleton>
      <Link href={ isLoading ? undefined : tokenInstanceLink } display="inline">
        <NftMedia
          mb="18px"
          data={ tokenInstance }
          size="md"
          isLoading={ isLoading }
          autoplayVideo={ false }
        />
      </Link>
      <Flex justifyContent="space-between" w="100%" flexWrap="wrap">
        <Flex ml={ 1 } overflow="hidden">
          <Text whiteSpace="pre" color="text.secondary">ID# </Text>
          <NftEntity hash={ token.address_hash } id={ tokenInstance.id } isLoading={ isLoading } noIcon/>
        </Flex>
        <Skeleton loading={ isLoading } overflow="hidden" ml={ 1 }>
          { valueResult && (
            <Flex>
              <Text color="text.secondary" whiteSpace="pre">Qty </Text>
              <Text overflow="hidden" wordBreak="break-all">{ valueResult }</Text>
            </Flex>
          ) }
        </Skeleton>
      </Flex>
      { withTokenLink && (
        <TokenEntity
          mt={ 2 }
          token={ token }
          isLoading={ isLoading }
          noCopy
          noSymbol
          chain={ chain }
        />
      ) }
    </AddressNftItemContainer>
  );
};

export default AddressNftItem;
