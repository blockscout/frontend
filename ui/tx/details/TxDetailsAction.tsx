import { Flex, Link, Icon, chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { route } from 'nextjs-routes';
import React from 'react';

import type { TxAction, TxActionGeneral } from 'types/api/txAction';

import appConfig from 'configs/app/config';
import uniswapIcon from 'icons/uniswap.svg';
import AddressLink from 'ui/shared/address/AddressLink';
import TokenSnippet from 'ui/shared/TokenSnippet/TokenSnippet';

interface Props {
  action: TxAction;
}

function getActionText(actionType: TxActionGeneral['type']) {
  switch (actionType) {
    case 'mint': return [ 'Add', 'Liquidity to' ];
    case 'burn': return [ 'Remove', 'Liquidity from' ];
    case 'collect': return [ 'Collect', 'From' ];
    case 'swap': return [ 'Swap', 'On' ];
  }
}

const TxDetailsAction = ({ action }: Props) => {
  const { protocol, type, data } = action;

  if (protocol !== 'uniswap_v3') {
    return null;
  }

  switch (type) {
    case 'mint':
    case 'burn':
    case 'collect':
    case 'swap': {
      const amount0 = BigNumber(data.amount0).toFormat();
      const amount1 = BigNumber(data.amount1).toFormat();
      const [ text0, text1 ] = getActionText(type);
      const token0 = {
        address: data.symbol0 === 'Ether' ? appConfig.network.currency.address || '' : data.address0,
        name: data.symbol0 === 'Ether' ? appConfig.network.currency.symbol || null : data.symbol0,
        type: 'ERC-20',
        symbol: null,
        icon_url: null,
      };
      const token1 = {
        address: data.symbol1 === 'Ether' ? appConfig.network.currency.address || '' : data.address1,
        name: data.symbol1 === 'Ether' ? appConfig.network.currency.symbol || null : data.symbol1,
        type: 'ERC-20',
        symbol: null,
        icon_url: null,
      };

      return (
        <Flex flexWrap="wrap" columnGap={ 1 } rowGap={ 2 } alignItems="center">
          <chakra.span color="text_secondary">{ text0 }: </chakra.span>

          <chakra.span fontWeight={ 600 }>{ amount0 }</chakra.span>
          <TokenSnippet
            data={ token0 }
            w="auto"
            columnGap={ 1 }
            logoSize={ 5 }
            isDisabled={ data.symbol0 === 'Ether' }
          />

          <chakra.span color="text_secondary">{ type === 'swap' ? 'For' : 'And' }: </chakra.span>

          <chakra.span fontWeight={ 600 }>{ amount1 }</chakra.span>
          <TokenSnippet
            data={ token1 }
            w="auto"
            columnGap={ 1 }
            logoSize={ 5 }
            isDisabled={ data.symbol1 === 'Ether' }
          />

          <chakra.span color="text_secondary">{ text1 } </chakra.span>
          <Flex columnGap={ 1 }>
            <Icon as={ uniswapIcon } boxSize={ 5 } color="white" bgColor="#ff007a" borderRadius="full" p="2px"/>
            <chakra.span color="text_secondary">Uniswap V3</chakra.span>
          </Flex>
        </Flex>
      );
    }

    case 'mint_nft' : {
      const token = {
        address: data.address,
        name: data.name,
        type: 'ERC-20',
        symbol: null,
        icon_url: null,
      };

      return (
        <div>
          <Flex rowGap={ 2 } flexWrap="wrap" alignItems="center" whiteSpace="pre-wrap">
            <chakra.span>Mint of </chakra.span>
            <TokenSnippet
              data={ token }
              w="auto"
              columnGap={ 1 }
              logoSize={ 5 }
              rowGap={ 2 }
              flexWrap="wrap"
            />
            <chakra.span> to </chakra.span>
            <AddressLink hash={ data.to } type="address" truncation="constant"/>
          </Flex>

          <Flex columnGap={ 1 } rowGap={ 2 } pl={ 3 } flexDirection="column" mt={ 2 }>
            {
              data.ids.map((id: string) => {
                const url = route({ pathname: '/token/[hash]/instance/[id]', query: { hash: data.address, id } });
                return (
                  <Flex key={ data.address + id } whiteSpace="pre-wrap">
                    <span>1 of </span>
                    <chakra.span color="text_secondary">Token ID [</chakra.span>
                    <Link href={ url }>{ id }</Link>
                    <chakra.span color="text_secondary">]</chakra.span>
                  </Flex>
                );
              })
            }
          </Flex>
        </div>
      );
    }

    default:
      return null;
  }
};

export default React.memo(TxDetailsAction);
