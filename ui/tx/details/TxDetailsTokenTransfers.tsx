import { Icon, GridItem, Show, Flex } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import tokenIcon from 'icons/token.svg';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import LinkInternal from 'ui/shared/LinkInternal';

import TxDetailsTokenTransfer from './TxDetailsTokenTransfer';

interface Props {
  data: Array<TokenTransfer>;
  txHash: string;
}

const TOKEN_TRANSFERS_TYPES = [
  { title: 'Tokens transferred', hint: 'List of tokens transferred in the transaction', type: 'token_transfer' },
  { title: 'Tokens minted', hint: 'List of tokens minted in the transaction', type: 'token_minting' },
  { title: 'Tokens burnt', hint: 'List of tokens burnt in the transaction', type: 'token_burning' },
  { title: 'Tokens created', hint: 'List of tokens created in the transaction', type: 'token_spawning' },
];
const VISIBLE_ITEMS_NUM = 3;

const TxDetailsTokenTransfers = ({ data, txHash }: Props) => {
  const viewAllUrl = route({ pathname: '/tx/[hash]', query: { hash: txHash, tab: 'token_transfers' } });

  const transferGroups = TOKEN_TRANSFERS_TYPES.map((group) => ({
    ...group,
    items: data?.filter((token) => token.type === group.type) || [],
  }));
  const showViewAllLink = transferGroups.some(({ items }) => items.length > VISIBLE_ITEMS_NUM);

  return (
    <>
      { transferGroups.map(({ title, hint, type, items }) => {
        if (items.length === 0) {
          return null;
        }

        return (
          <DetailsInfoItem
            key={ type }
            title={ title }
            hint={ hint }
            position="relative"
          >
            <Flex
              flexDirection="column"
              alignItems="flex-start"
              rowGap={ 5 }
              w="100%"
            >
              { items.slice(0, VISIBLE_ITEMS_NUM).map((item, index) => <TxDetailsTokenTransfer key={ index } data={ item }/>) }
            </Flex>
          </DetailsInfoItem>
        );
      }) }
      { showViewAllLink && (
        <>
          <Show above="lg" ssr={ false }><GridItem></GridItem></Show>
          <GridItem fontSize="sm" alignItems="center" display="inline-flex" pl={{ base: '28px', lg: 0 }}>
            <Icon as={ tokenIcon } boxSize={ 6 }/>
            <LinkInternal href={ viewAllUrl }>
              View all
            </LinkInternal>
          </GridItem>
        </>
      ) }
    </>
  );
};

export default React.memo(TxDetailsTokenTransfers);
