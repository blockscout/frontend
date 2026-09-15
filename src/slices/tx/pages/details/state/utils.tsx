// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';

import type { schemas } from '@blockscout/api-types';

import { currencyUnits } from 'src/slices/chain/units';
import getChainValidatorTitle from 'src/slices/chain/verification-type/utils/get-chain-validator-title';
import NftEntity from 'src/slices/token/components/entity/NftEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';
import TokenMultiplierTag from 'src/slices/token/components/TokenMultiplierTag';
import { getStateChangeUiMultiplier } from 'src/slices/tx/utils/get-state-change-ui-multiplier';

import config from 'src/config';
import AssetValue from 'src/shared/values/entity/AssetValue';

import { Badge } from 'src/toolkit/chakra/badge';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { ZERO_ADDRESS } from 'src/toolkit/utils/consts';
import { nbsp, space } from 'src/toolkit/utils/htmlEntities';

const FULL_PRECISION = 0;

export function getStateElements(data: schemas['StateChange'], isLoading?: boolean) {
  const tag = (() => {
    if (data.is_miner) {
      return (
        <Tooltip content="A block producer who successfully included the block into the blockchain">
          <Badge textTransform="capitalize" colorPalette="yellow" loading={ isLoading }>
            { getChainValidatorTitle() }
          </Badge>
        </Tooltip>
      );
    }

    if (data.address.hash === ZERO_ADDRESS) {
      const changeDirection = Number(data.change) > 0 ? 'to' : 'from';

      if (changeDirection) {
        const text = changeDirection === 'from' ? 'Mint' : 'Burn';
        return (
          <Tooltip content="Address used in tokens mintings and burnings">
            <Badge textTransform="capitalize" colorPalette="yellow" loading={ isLoading }>{ text } address</Badge>
          </Tooltip>
        );
      }
    }

    return null;
  })();

  switch (data.type) {
    case 'coin': {
      const beforeBn = BigNumber(data.balance_before || '0').div(10 ** config.chain.currency.decimals);
      const afterBn = BigNumber(data.balance_after || '0').div(10 ** config.chain.currency.decimals);
      const differenceBn = afterBn.minus(beforeBn);
      const changeColor = beforeBn.lte(afterBn) ? 'green.500' : 'red.500';
      const changeSign = beforeBn.lte(afterBn) ? '+' : '-';

      return {
        before: (
          <Skeleton loading={ isLoading } wordBreak="break-all" display="inline-block">
            { beforeBn.toFormat() } { currencyUnits.ether }
          </Skeleton>
        ),
        after: (
          <Skeleton loading={ isLoading } wordBreak="break-all" display="inline-block">
            { afterBn.toFormat() } { currencyUnits.ether }
          </Skeleton>
        ),
        change: (
          <Skeleton loading={ isLoading } display="inline-block" color={ changeColor }>
            <span>{ changeSign }{ nbsp }{ differenceBn.abs().toFormat() }</span>
          </Skeleton>
        ),
        tag,
      };
    }
    case 'token': {
      const tokenLink = data.token && (
        <TokenEntity
          token={ data.token }
          isLoading={ isLoading }
          noIcon
          noCopy
          onlySymbol
          w="auto"
        />
      );
      const decimals = data.token?.decimals;
      const multiplier = getStateChangeUiMultiplier(data);
      const multiplierTag = multiplier && <TokenMultiplierTag multiplier={ multiplier } loading={ isLoading } mr={ 2 } my="-2px"/>;

      const change = (() => {
        const differenceBn = typeof data.change === 'string' ?
          BigNumber(data.change || '0') :
          BigNumber(data.balance_after || '0').minus(BigNumber(data.balance_before || '0'));

        if (differenceBn.isEqualTo(0)) {
          return null;
        }

        const isIncrease = differenceBn.isGreaterThanOrEqualTo(0);

        return (
          <AssetValue
            amount={ differenceBn.abs().toFixed() }
            decimals={ decimals }
            multiplier={ multiplier }
            accuracy={ FULL_PRECISION }
            startElement={ <>{ multiplierTag }<span>{ isIncrease ? '+' : '-' }{ nbsp }</span></> }
            loading={ isLoading }
            color={ isIncrease ? 'green.500' : 'red.500' }
          />
        );
      })();

      const tokenId = (() => {
        if ('token_id' in data && data.token_id && data.token) {
          return (
            <NftEntity
              hash={ data.token.address_hash }
              id={ data.token_id }
              isLoading={ isLoading }
            />
          );
        } else {
          return null;
        }
      })();

      return {
        before: data.balance_before ? (
          <Flex whiteSpace="pre-wrap" justifyContent={{ base: 'flex-start', lg: 'flex-end' }} flexWrap="wrap">
            <AssetValue
              amount={ data.balance_before }
              decimals={ decimals }
              multiplier={ multiplier }
              accuracy={ FULL_PRECISION }
              startElement={ multiplierTag }
              loading={ isLoading }
            />
            <span>{ space }</span>
            { tokenLink }
          </Flex>
        ) : null,
        after: data.balance_after ? (
          <Flex whiteSpace="pre-wrap" justifyContent={{ base: 'flex-start', lg: 'flex-end' }} flexWrap="wrap">
            <AssetValue
              amount={ data.balance_after }
              decimals={ decimals }
              multiplier={ multiplier }
              accuracy={ FULL_PRECISION }
              startElement={ multiplierTag }
              loading={ isLoading }
            />
            <span>{ space }</span>
            { tokenLink }
          </Flex>
        ) : null,
        change,
        tag,
        tokenId,
      };
    }
  }
}
