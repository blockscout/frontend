import { GridItem, Flex, Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import { route } from 'nextjs-routes';

import { Link } from 'toolkit/chakra/link';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import IconSvg from 'ui/shared/IconSvg';
import TokenTransferSnippet from 'ui/shared/TokenTransferSnippet/TokenTransferSnippet';
interface Props {
  data: Array<TokenTransfer>;
  txHash: string;
  isOverflow: boolean;
}

const TOKEN_TRANSFERS_TYPES = [
  { title: 'Tokens transferred', hint: 'List of tokens transferred in the transaction', type: 'token_transfer' },
  { title: 'Tokens minted', hint: 'List of tokens minted in the transaction', type: 'token_minting' },
  { title: 'Tokens burnt', hint: 'List of tokens burnt in the transaction', type: 'token_burning' },
  { title: 'Tokens created', hint: 'List of tokens created in the transaction', type: 'token_spawning' },
];

const TxDetailsTokenTransfers = ({ data, txHash, isOverflow }: Props) => {
  const viewAllUrl = route({ pathname: '/tx/[hash]', query: { hash: txHash, tab: 'token_transfers' } });

  const transferGroups = TOKEN_TRANSFERS_TYPES.map((group) => ({
    ...group,
    items: data?.filter((token) => token.type === group.type) || [],
  }));

  return (
    <>
      { transferGroups.map(({ title, hint, type, items }) => {
        if (items.length === 0) {
          return null;
        }

        return (
          <React.Fragment key={ type }>
            <DetailedInfo.ItemLabel
              hint={ hint }
            >
              { title }
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue position="relative">
              <Flex
                flexDirection="column"
                alignItems="flex-start"
                rowGap={ 5 }
                w="100%"
                overflow="hidden"
              >
                { items.map((item, index) => <TokenTransferSnippet key={ index } data={ item }/>) }
              </Flex>
            </DetailedInfo.ItemValue>
          </React.Fragment>
        );
      }) }
      { isOverflow && (
        <>
          <Box hideBelow="lg"><GridItem></GridItem></Box>
          <GridItem fontSize="sm" alignItems="center" display="inline-flex" pl={{ base: '28px', lg: 0 }}>
            <IconSvg name="token" boxSize={ 6 }/>
            <Link href={ viewAllUrl }>
              View all
            </Link>
          </GridItem>
        </>
      ) }
    </>
  );
};

export default React.memo(TxDetailsTokenTransfers);
