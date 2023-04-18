import { Box, Flex, Tag, Tooltip } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TxStateChange, TxStateChangeTokenErc1155, TxStateChangeTokenErc1155Single, TxStateChangeTokenErc721 } from 'types/api/txStateChanges';
import type { ArrayElement } from 'types/utils';

import appConfig from 'configs/app/config';
import { ZERO_ADDRESS } from 'lib/consts';
import { nbsp } from 'lib/html-entities';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import trimTokenSymbol from 'lib/token/trimTokenSymbol';
import AddressLink from 'ui/shared/address/AddressLink';

import TxStateTokenIdList from './TxStateTokenIdList';

export function getStateElements(data: TxStateChange) {
  const tag = (() => {
    if (data.is_miner) {
      return (
        <Tooltip label="A block producer who successfully included the block into the blockchain">
          <Tag textTransform="capitalize" colorScheme="yellow">{ getNetworkValidatorTitle() }</Tag>
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
            <Tag textTransform="capitalize" colorScheme="yellow">{ text } address</Tag>
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
        before: <Box>{ beforeBn.toFormat() } { appConfig.network.currency.symbol }</Box>,
        after: <Box>{ afterBn.toFormat() } { appConfig.network.currency.symbol }</Box>,
        change: <Box color={ changeColor }>{ changeSign }{ nbsp }{ differenceBn.abs().toFormat() }</Box>,
        tag,
      };
    }
    case 'token': {
      const tokenLink = <AddressLink type="token" hash={ data.token.address } alias={ trimTokenSymbol(data.token?.symbol || data.token.address) }/>;
      const before = Number(data.balance_before);
      const after = Number(data.balance_after);
      const change = (() => {
        const difference = typeof data.change === 'string' ? Number(data.change) : after - before;

        if (!difference) {
          return null;
        }

        const changeColor = difference >= 0 ? 'green.500' : 'red.500';
        const changeSign = difference >= 0 ? '+' : '-';

        return <Box color={ changeColor }>{ changeSign }{ nbsp }{ Math.abs(difference).toLocaleString() }</Box>;
      })();

      const tokenId = (() => {
        if (!Array.isArray(data.change)) {
          return null;
        }

        const items = (data.change as Array<TxStateChangeNftItem>).reduce(flattenTotal, []);
        return <TxStateTokenIdList items={ items } tokenAddress={ data.token.address }/>;
      })();

      return {
        before: data.balance_before ? (
          <Flex whiteSpace="pre-wrap" justifyContent={{ base: 'flex-start', lg: 'flex-end' }}>
            <span>{ before.toLocaleString() } </span>
            { tokenLink }
          </Flex>
        ) : null,
        after: data.balance_after ? (
          <Flex whiteSpace="pre-wrap" justifyContent={{ base: 'flex-start', lg: 'flex-end' }}>
            <span>{ after.toLocaleString() } </span>
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

export type TxStateChangeNftItem = ArrayElement<TxStateChangeTokenErc721['change'] | TxStateChangeTokenErc1155['change']>;
export type TxStateChangeNftItemFlatten = ArrayElement<TxStateChangeTokenErc721['change'] | TxStateChangeTokenErc1155Single['change']>;

function flattenTotal(result: Array<TxStateChangeNftItemFlatten>, item: TxStateChangeNftItem): Array<TxStateChangeNftItemFlatten> {
  if (Array.isArray(item.total)) {
    result.push(...item.total.map((total) => ({ ...item, total })));
  } else {
    result.push({ ...item, total: item.total });
  }

  return result;
}
