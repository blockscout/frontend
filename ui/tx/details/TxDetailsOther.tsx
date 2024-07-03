import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import TextSeparator from 'ui/shared/TextSeparator';

type Props = Pick<Transaction, 'nonce' | 'type' | 'position'>

const TxDetailsOther = ({ nonce, type, position }: Props) => {
  return (
    <>
      <DetailsInfoItem.Label
        hint="Other data related to this transaction"
      >
        Other
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        {
          [
            typeof type === 'number' && (
              <Box key="type">
                <Text as="span" fontWeight="500">Txn type: </Text>
                <Text fontWeight="600" as="span">{ type }</Text>
                { type === 2 && <Text fontWeight="400" as="span" ml={ 1 } variant="secondary">(EIP-1559)</Text> }
                { type === 3 && <Text fontWeight="400" as="span" ml={ 1 } variant="secondary">(EIP-4844)</Text> }
              </Box>
            ),
            <Box key="nonce">
              <Text as="span" fontWeight="500">Nonce: </Text>
              <Text fontWeight="600" as="span">{ nonce }</Text>
            </Box>,
            position !== null && position !== undefined && (
              <Box key="position">
                <Text as="span" fontWeight="500">Position: </Text>
                <Text fontWeight="600" as="span">{ position }</Text>
              </Box>
            ),
          ]
            .filter(Boolean)
            .map((item, index) => (
              <>
                { index !== 0 && <TextSeparator/> }
                { item }
              </>
            ))
        }
      </DetailsInfoItem.Value>
    </>
  );
};

export default TxDetailsOther;
