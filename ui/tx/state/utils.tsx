import { Box, Flex, Stat, StatArrow, StatHelpText } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TxStateChange } from 'types/api/txStateChanges';

import appConfig from 'configs/app/config';
import { ZERO_ADDRESS } from 'lib/consts';
import { nbsp } from 'lib/html-entities';
import getNetworkValidatorTitle from 'lib/networks/getNetworkValidatorTitle';
import trimTokenSymbol from 'lib/token/trimTokenSymbol';
import AddressLink from 'ui/shared/address/AddressLink';
import Hint from 'ui/shared/Hint';
import TokenTransferNft from 'ui/shared/TokenTransfer/TokenTransferNft';

export function getStateElements(data: TxStateChange) {
  const hint = (() => {
    if (data.is_miner) {
      return (
        <Flex align="center" columnGap={ 1 }>
          <Hint label="A block producer who successfully included the block into the blockchain"/>
          <Box color="text_secondary" textTransform="capitalize">{ getNetworkValidatorTitle() }</Box>
        </Flex>
      );
    }

    if (data.address.hash === ZERO_ADDRESS) {
      return (
        <Flex align="center" columnGap={ 1 }>
          <Hint label="Address used in tokens mintings and burnings"/>
          <Box color="text_secondary" whiteSpace="nowrap">Burn address</Box>
        </Flex>
      );
    }

    return null;
  })();

  switch (data.type) {
    case 'coin': {
      const beforeBn = BigNumber(data.balance_before || '0').div(10 ** appConfig.network.currency.decimals);
      const afterBn = BigNumber(data.balance_after || '0').div(10 ** appConfig.network.currency.decimals);
      const differenceBn = afterBn.minus(beforeBn);

      return {
        before: <Box>{ beforeBn.toFormat() } { appConfig.network.currency.symbol }</Box>,
        after: <Box>{ afterBn.toFormat() } { appConfig.network.currency.symbol }</Box>,
        change: (
          <Stat>
            { differenceBn.toFormat() }
            <StatArrow ml={ 2 } type={ beforeBn.lte(afterBn) ? 'increase' : 'decrease' }/>
          </Stat>
        ),
        hint,
      };
    }
    case 'token': {
      const tokenLink = <AddressLink type="token" hash={ data.token.address } alias={ trimTokenSymbol(data.token?.symbol || data.token.address) }/>;

      const change = (() => {
        const difference = Number(data.balance_after) - Number(data.balance_before);

        switch (data.token.type) {
          case 'ERC-20': {
            return (
              <Stat>
                <StatHelpText display="flex" justifyContent={{ base: 'flex-start', lg: 'flex-end' }} alignItems="center" flexWrap="nowrap">
                  { difference }{ nbsp }
                  { tokenLink }
                  <StatArrow ml={ 2 } type={ difference > 0 ? 'increase' : 'decrease' }/>
                </StatHelpText>
              </Stat>
            );
          }
          case 'ERC-721':
          case 'ERC-1155': {
            if (typeof data.change === 'string') {
              return null;
            }

            return data.change.map((item, index) => {
              if (Array.isArray(item.total)) {
                return item.total.map((element, index) => {
                  return (
                    <Stat key={ index }>
                      <StatHelpText display="flex" justifyContent={{ base: 'flex-start', lg: 'flex-end' }} alignItems="center" flexWrap="nowrap">
                        <TokenTransferNft hash={ data.token.address } id={ element.token_id } w="auto"/>
                        <StatArrow ml={ 2 } type={ item.direction === 'to' ? 'increase' : 'decrease' }/>
                      </StatHelpText>
                    </Stat>
                  );
                });
              }

              return (
                <Stat key={ index }>
                  <StatHelpText display="flex" justifyContent={{ base: 'flex-start', lg: 'flex-end' }} alignItems="center" flexWrap="nowrap">
                    <TokenTransferNft hash={ data.token.address } id={ item.total.token_id } w="auto"/>
                    <StatArrow ml={ 2 } type={ item.direction === 'to' ? 'increase' : 'decrease' }/>
                  </StatHelpText>
                </Stat>
              );
            });
          }
        }
      })();

      return {
        before: data.balance_before ? (
          <Flex whiteSpace="pre-wrap" justifyContent={{ base: 'flex-start', lg: 'flex-end' }}>
            <span>{ Number(data.balance_before).toLocaleString() } </span>
            { tokenLink }
          </Flex>
        ) : null,
        after: data.balance_after ? (
          <Flex whiteSpace="pre-wrap" justifyContent={{ base: 'flex-start', lg: 'flex-end' }}>
            <span>{ Number(data.balance_after).toLocaleString() } </span>
            { tokenLink }
          </Flex>
        ) : null,
        change,
        hint,
      };
    }
  }
}
