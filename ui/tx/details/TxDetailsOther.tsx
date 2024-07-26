import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import TextSeparator from 'ui/shared/TextSeparator';

type Props = Pick<Transaction, 'nonce' | 'type' | 'position'>

const TxDetailsOther = ({ nonce, type, position }: Props) => {
  const { t } = useTranslation('common');

  return (
    <DetailsInfoItem
      title={ t('tx_area.Other') }
      hint={ t('tx_area.Other_data_related_to_this_transaction') }
    >
      {
        [
          typeof type === 'number' && (
            <Box key="type">
              <Text as="span" fontWeight="500">{ t('tx_area.Txn_type') }: </Text>
              <Text fontWeight="600" as="span">{ type }</Text>
              { type === 2 && <Text fontWeight="400" as="span" ml={ 1 } variant="secondary">(EIP-1559)</Text> }
              { type === 3 && <Text fontWeight="400" as="span" ml={ 1 } variant="secondary">(EIP-4844)</Text> }
            </Box>
          ),
          <Box key="nonce">
            <Text as="span" fontWeight="500">{ t('tx_area.Nonce') }: </Text>
            <Text fontWeight="600" as="span">{ nonce }</Text>
          </Box>,
          position !== null && position !== undefined && (
            <Box key="position">
              <Text as="span" fontWeight="500">{ t('tx_area.Position') }: </Text>
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
    </DetailsInfoItem>
  );
};

export default TxDetailsOther;
