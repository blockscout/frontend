import { Box, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TxStateChange, TxStateChangeTokenErc1155, TxStateChangeTokenErc1155Single, TxStateChangeTokenErc721 } from 'types/api/txStateChanges';
import type ArrayElement from 'types/utils/ArrayElement';

import appConfig from 'configs/app/config';
import { ZERO_ADDRESS } from 'lib/consts';
import { nbsp } from 'lib/html-entities';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import trimTokenSymbol from 'lib/token/trimTokenSymbol';
import AddressLink from 'ui/shared/address/AddressLink';
import Hint from 'ui/shared/Hint';

import TxStateTokenIdList from './TxStateTokenIdList';

export function getStateElements(data: TxStateChange) {
  const hint = (() => {
    if (data.is_miner) {
      return (
        <Flex align="center" columnGap={ 1 } flexDir={{ base: 'row-reverse', lg: 'row' }}>
          <Hint label="A block producer who successfully included the block into the blockchain"/>
          <Box color="text_secondary" textTransform="capitalize">{ getNetworkValidatorTitle() }</Box>
        </Flex>
      );
    }

    if (data.address.hash === ZERO_ADDRESS) {
      const changeDirection = Array.isArray(data.change) ? data.change[0].direction : null;
      if (changeDirection) {
        const text = changeDirection === 'from' ? 'Mint' : 'Burn';
        return (
          <Flex align="center" columnGap={ 1 } flexDir={{ base: 'row-reverse', lg: 'row' }}>
            <Hint label="Address used in tokens mintings and burnings"/>
            <Box color="text_secondary" whiteSpace="nowrap">{ text } address</Box>
          </Flex>
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
        hint,
      };
    }
    case 'token': {
      const tokenLink = <AddressLink type="token" hash={ data.token.address } alias={ trimTokenSymbol(data.token?.symbol || data.token.address) }/>;
      const before = Number(data.balance_before);
      const after = Number(data.balance_after);
      const difference = after - before;
      const changeColor = difference >= 0 ? 'green.500' : 'red.500';
      const changeSign = difference >= 0 ? '+' : '-';

      const change = (() => {
        if (!before && !after && data.address.hash === ZERO_ADDRESS) {
          const changeDirection = Array.isArray(data.change) ? data.change[0].direction : null;

          if (changeDirection) {
            return (
              <Flex color={ changeDirection === 'from' ? 'green.500' : 'red.500' } justifyContent={{ base: 'flex-start', lg: 'flex-end' }}>
                { changeDirection === 'from' ? 'Mint' : 'Burn' }
                { nbsp }
                { tokenLink }
              </Flex>
            );
          }
        }

        if (!difference) {
          return <Box>0</Box>;
        }

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
        hint,
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
