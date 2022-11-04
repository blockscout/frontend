import { Text, Icon, Link, GridItem, Show } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import tokenIcon from 'icons/token.svg';
import link from 'lib/link/link';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

import TxDetailsTokenTransferList from './TxDetailsTokenTransferList';

interface Props {
  data: Array<TokenTransfer>;
  txHash: string;
}

const TOKEN_TRANSFERS = [
  { title: 'Tokens Transferred', hint: 'List of tokens transferred in the transaction.', type: 'token_transfer' },
  { title: 'Tokens Minted', hint: 'List of tokens minted in the transaction.', type: 'token_minting' },
  { title: 'Tokens Burnt', hint: 'List of tokens burnt in the transaction.', type: 'token_burning' },
  { title: 'Tokens Created', hint: 'List of tokens created in the transaction.', type: 'token_spawning' },
];

const TxDetailsTokenTransfers = ({ data, txHash }: Props) => {
  const viewAllUrl = link('tx', { id: txHash }, { tab: 'token_transfers' });

  return (
    <>
      { TOKEN_TRANSFERS.map(({ title, hint, type }) => {
        const items = data?.filter((token) => token.type === type) || [];
        if (items.length === 0) {
          return null;
        }
        return (
          <DetailsInfoItem
            key={ type }
            title={ (
              <>
                <Text as="span">{ title }</Text>
                { items.length > 1 && <Text as="span" whiteSpace="pre" variant="secondary"> ({ items.length })</Text> }
              </>
            ) }
            hint={ hint }
            position="relative"
          >
            <TxDetailsTokenTransferList items={ items }/>
          </DetailsInfoItem>
        );
      }) }
      <Show above="lg"><GridItem></GridItem></Show>
      <GridItem fontSize="sm" alignItems="center" display="inline-flex" pl={{ base: '28px', lg: 0 }}>
        <Icon as={ tokenIcon } boxSize={ 6 }/>
        <NextLink href={ viewAllUrl } passHref>
          <Link>View all</Link>
        </NextLink>
        <Text variant="secondary" as="span" whiteSpace="pre"> (15)</Text>
      </GridItem>
    </>
  );
};

export default React.memo(TxDetailsTokenTransfers);
