import { Flex, Skeleton, Tooltip } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TxStateChange } from 'types/api/txStateChanges';

import appConfig from 'configs/app/config';
import { ZERO_ADDRESS } from 'lib/consts';
import { nbsp, space } from 'lib/html-entities';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import trimTokenSymbol from 'lib/token/trimTokenSymbol';
import AddressLink from 'ui/shared/address/AddressLink';
import Tag from 'ui/shared/chakra/Tag';
import TokenTransferNft from 'ui/shared/TokenTransfer/TokenTransferNft';

import TxStateTokenIdList from './TxStateTokenIdList';

export function getStateElements(data: TxStateChange, isLoading?: boolean) {
  const tag = (() => {
    if (data.is_miner) {
      return (
        <Tooltip label="A block producer who successfully included the block into the blockchain">
          <Tag textTransform="capitalize" colorScheme="yellow" isLoading={ isLoading }>
            { getNetworkValidatorTitle() }
          </Tag>
        </Tooltip>
      );
    }

    if (data.address.hash === ZERO_ADDRESS) {
      const changeDirection = (() => {
        if (Array.isArray(data.change)) {
          const firstChange = data.change[0];
          return firstChange.direction;
        }
        return Number(data.change) > 0 ? 'to' : 'from';
      })();

      if (changeDirection) {
        const text = changeDirection === 'from' ? 'Mint' : 'Burn';
        return (
          <Tooltip label="Address used in tokens mintings and burnings">
            <Tag textTransform="capitalize" colorScheme="yellow" isLoading={ isLoading }>{ text } address</Tag>
          </Tooltip>
        );
      }
    }

    return null;
  })();

  switch (data.type) {
    case 'coin': {
      const beforeBn = BigNumber(data.balance_before || '0').div(10 ** appConfig.network.currency.decimals);
      const afterBn = BigNumber(data.balance_after || '0').div(10 ** appConfig.network.currency.decimals);
      const differenceBn = afterBn.minus(beforeBn);
      const changeColor = beforeBn.lte(afterBn) ? 'green.500' : 'red.500';
      const changeSign = beforeBn.lte(afterBn) ? '+' : '-';

      return {
        before: <Skeleton isLoaded={ !isLoading } display="inline-block">{ beforeBn.toFormat() } { appConfig.network.currency.symbol }</Skeleton>,
        after: <Skeleton isLoaded={ !isLoading } display="inline-block">{ afterBn.toFormat() } { appConfig.network.currency.symbol }</Skeleton>,
        change: (
          <Skeleton isLoaded={ !isLoading } display="inline-block" color={ changeColor }>
            <span>{ changeSign }{ nbsp }{ differenceBn.abs().toFormat() }</span>
          </Skeleton>
        ),
        tag,
      };
    }
    case 'token': {
      const tokenLink = (
        <AddressLink
          type="token"
          hash={ data.token.address }
          alias={ trimTokenSymbol(data.token?.symbol || data.token.address) }
          isLoading={ isLoading }
        />
      );
      const before = Number(data.balance_before);
      const after = Number(data.balance_after);
      const change = (() => {
        const difference = typeof data.change === 'string' ? Number(data.change) : after - before;

        if (!difference) {
          return null;
        }

        const changeColor = difference >= 0 ? 'green.500' : 'red.500';
        const changeSign = difference >= 0 ? '+' : '-';

        return (
          <Skeleton isLoaded={ !isLoading } display="inline-block" color={ changeColor }>
            <span>{ changeSign }{ nbsp }{ Math.abs(difference).toLocaleString() }</span>
          </Skeleton>
        );
      })();

      const tokenId = (() => {
        if (!Array.isArray(data.change)) {
          if ('token_id' in data && data.token_id) {
            return (
              <TokenTransferNft
                hash={ data.token.address }
                id={ data.token_id }
                w="auto"
                truncation="constant"
                isLoading={ isLoading }
              />
            );
          } else {
            return null;
          }
        }

        return <TxStateTokenIdList items={ data.change } tokenAddress={ data.token.address } isLoading={ isLoading }/>;
      })();

      return {
        before: data.balance_before ? (
          <Flex whiteSpace="pre-wrap" justifyContent={{ base: 'flex-start', lg: 'flex-end' }}>
            <Skeleton isLoaded={ !isLoading }>{ before.toLocaleString() }</Skeleton>
            <span>{ space }</span>
            { tokenLink }
          </Flex>
        ) : null,
        after: data.balance_after ? (
          <Flex whiteSpace="pre-wrap" justifyContent={{ base: 'flex-start', lg: 'flex-end' }}>
            <Skeleton isLoaded={ !isLoading }>{ after.toLocaleString() }</Skeleton>
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
