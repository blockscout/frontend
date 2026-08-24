// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, GridItem, List, chakra } from '@chakra-ui/react';
import React from 'react';

import type { Fields } from './types';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { BoxHtml } from 'src/toolkit/chakra/box';
import { Heading } from 'src/toolkit/chakra/heading';
import { Link } from 'src/toolkit/chakra/link';
import { FormFieldText } from 'src/toolkit/components/forms/fields/FormFieldText';
import { transactionHashValidator } from 'src/toolkit/components/forms/validators/transaction';

const DOCS_URL = 'https://docs.blockscout.com/using-blockscout/token-info#expedited-payment-process';

interface Props {
  html: string;
  readOnly?: boolean;
}

const TokenInfoExpeditedReview = ({ html, readOnly }: Props) => {

  const rules = React.useMemo(() => ({
    validate: {
      tx_hash: transactionHashValidator,
    },
  }), []);

  return (
    <GridItem
      colSpan={{ base: 1, lg: 2 }}
      bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
      p={ 6 }
      borderRadius="md"
    >
      <Box textStyle="sm" wordBreak="break-word">
        <Flex alignItems="center" justifyContent="space-between">
          <Heading level="3">Need a faster review?</Heading>
          <Link href={ DOCS_URL } external noIcon gap={ 2 }>
            <SpriteIcon name="docs" boxSize={ 5 }/>
            How it works
          </Link>
        </Flex>
        <List.Root as="ol" listStyleType="decimal" gap={ 6 } mt={ 6 } pl={ 5 }>
          <List.Item _marker={{ fontWeight: 600 }} pl={ 3 }>
            <BoxHtml html={ html }/>
          </List.Item>
          <List.Item _marker={{ fontWeight: 600 }} pl={ 3 }>
            Once payment is completed, enter the <chakra.span fontWeight={ 600 }>transaction hash</chakra.span>
            <FormFieldText<Fields, 'payment_tx'> name="payment_tx" placeholder="Payment transaction hash" readOnly={ readOnly } mt={ 2 } rules={ rules }/>
          </List.Item>
        </List.Root>
      </Box>
    </GridItem>
  );
};

export default React.memo(TokenInfoExpeditedReview);
