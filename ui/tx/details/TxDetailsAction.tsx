import { Flex, Image, Link, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TxAction as TTxAction } from 'types/api/txAction';

import { space } from 'lib/html-entities';
import link from 'lib/link/link';
import AddressLink from 'ui/shared/address/AddressLink';
import StringShorten from 'ui/shared/StringShorten';
import TokenSnippet from 'ui/shared/TokenSnippet/TokenSnippet';

const uniswapIconUrl = 'https://raw.githubusercontent.com/trustwallet/assets/master/dapps/app.uniswap.org.png';

interface Props {
  action: TTxAction;
  isLast: boolean;
}

function uniswapActionName(actionType: string) {
  switch (actionType) {
    case 'mint': return [ 'Add', 'Liquidity To' ];
    case 'burn': return [ 'Remove', 'Liquidity From' ];
    case 'collect': return [ 'Collect', 'From' ];
    case 'swap': return [ 'Swap', 'On' ];
    default: return [ '', '' ];
  }
}

function unknownAction() {
  return (<span>Unrecognized action</span>);
}

const TxDetailsAction = ({ action, isLast }: Props) => {
  const { protocol, type, data } = action;

  if (protocol === 'uniswap_v3') {
    if ([ 'mint', 'burn', 'collect', 'swap' ].includes(type)) {
      const amount0 = BigNumber(data.amount0).toFormat();
      const amount1 = BigNumber(data.amount1).toFormat();

      return (
        <Flex flexWrap="wrap" columnGap={ 1 } rowGap={ 2 } className={ isLast ? 'lastItem' : '' } marginBottom={ isLast ? 5 : 0 }>
          <Text color="gray.500" as="span">
            { uniswapActionName(type)[0] }
          </Text>

          <Flex columnGap={ 1 }>
            <Text as="span">{ amount0 }</Text>
            { data.symbol0 === 'Ether' ? <Text as="span">Ether</Text> : <TokenSnippet name={ data.symbol0 } hash={ data.address0 }/> }
          </Flex>

          <Text color="gray.500" as="span">
            { type === 'swap' ? 'For' : 'And' }
          </Text>

          <Flex columnGap={ 1 }>
            <Text as="span">{ amount1 }</Text>
            { data.symbol1 === 'Ether' ? <Text as="span">Ether</Text> : <TokenSnippet name={ data.symbol1 } hash={ data.address1 }/> }
          </Flex>

          <Text color="gray.500" as="span">
            { uniswapActionName(type)[1] }
          </Text>

          <Flex columnGap={ 1 }>
            <Image src={ uniswapIconUrl } boxSize={ 5 } fallback={ <Text as="span"/> } alt=""/>
            <Text color="gray.500" as="span">
              Uniswap V3
            </Text>
          </Flex>
        </Flex>
      );
    } else if (type === 'mint_nft') {
      const tokenUrl = link('token_index', { hash: data.address });
      return (
        <Flex rowGap={ 2 } flexDirection="column" className={ isLast ? 'lastItem' : '' } marginBottom={ isLast ? 5 : 0 }>
          <Flex flexWrap="wrap" columnGap={ 1 } rowGap={ 2 }>
            <Flex columnGap={ 1 }>
              <Text as="span">Mint of</Text>
              <Image src={ uniswapIconUrl } boxSize={ 5 } fallback={ <Text as="span"/> } alt=""/>
              <Link href={ tokenUrl } target="_blank" overflow="hidden" whiteSpace="nowrap">
                <StringShorten title={ data.name } maxLength={ 12 }/>
                { space }
                (<StringShorten title={ data.symbol } maxLength={ 6 }/>)
              </Link>
            </Flex>
            <Flex columnGap={ 1 }>
              <Text as="span">To</Text>
              <AddressLink hash={ data.to } type="address"/>
            </Flex>
          </Flex>
          <Flex columnGap={ 1 } rowGap={ 2 } marginLeft={ 3 } flexDirection="column">
            {
              data.ids.map((id: string) => {
                const url = link('token_instance_item', { hash: data.address, id });
                return (
                  <Flex key={ id }>
                    <Flex columnGap={ 1 }>
                      <Text>1 of</Text>
                      <Text color="gray.500">Token ID [</Text>
                    </Flex>
                    <Link href={ url }>{ id }</Link>
                    <Text color="gray.500">]</Text>
                  </Flex>
                );
              })
            }
          </Flex>
        </Flex>
      );
    } else {
      return unknownAction();
    }
  } else {
    return unknownAction();
  }
};

export default React.memo(TxDetailsAction);
