import { Box, Heading, Text, Flex, Link, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type ArrayElement from 'types/utils/ArrayElement';

import type { txs } from 'data/txs';
import useNetwork from 'lib/hooks/useNetwork';
import { nbsp } from 'lib/html-entities';
import useLink from 'lib/link/useLink';
import TextSeparator from 'ui/shared/TextSeparator';
import Utilization from 'ui/shared/Utilization';

const TxAdditionalInfo = ({ tx }: { tx: ArrayElement<typeof txs> }) => {
  const selectedNetwork = useNetwork();

  const sectionBorderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const sectionProps = {
    borderBottom: '1px solid',
    borderColor: sectionBorderColor,
    paddingBottom: 4,
  };

  const sectionTitleProps = {
    color: 'gray.500',
    fontWeight: 600,
    marginBottom: 3,
    fontSize: 'sm',
  };

  const link = useLink();

  return (
    <>
      <Heading as="h4" fontSize="18px" mb={ 6 }>Additional info </Heading>
      <Box { ...sectionProps } mb={ 4 }>
        <Text { ...sectionTitleProps }>Transaction fee</Text>
        <Flex>
          <Text>{ tx.fee.value }{ nbsp }{ selectedNetwork?.currency }</Text>
          <Text variant="secondary" ml={ 1 }>(${ tx.fee.value_usd.toFixed(2) })</Text>
        </Flex>
      </Box>
      <Box { ...sectionProps } mb={ 4 }>
        <Text { ...sectionTitleProps }>Gas limit & usage by transaction</Text>
        <Flex>
          <Text>{ tx.gas_used.toLocaleString('en') }</Text>
          <TextSeparator/>
          <Text>{ tx.gas_limit.toLocaleString('en') }</Text>
          <Utilization ml={ 4 } value={ tx.gas_used / tx.gas_limit }/>
        </Flex>
      </Box>
      <Box { ...sectionProps } mb={ 4 }>
        <Text { ...sectionTitleProps }>Gas fees (Gwei)</Text>
        <Box>
          <Text as="span" fontWeight="500">Base: </Text>
          <Text fontWeight="600" as="span">{ tx.gas_fees.base }</Text>
        </Box>
        <Box>
          <Text as="span" fontWeight="500">Max: </Text>
          <Text fontWeight="600" as="span">{ tx.gas_fees.max }</Text>
        </Box>
        <Box>
          <Text as="span" fontWeight="500">Max priority: </Text>
          <Text fontWeight="600" as="span">{ tx.gas_fees.max_priority }</Text>
        </Box>
      </Box>
      <Box { ...sectionProps } mb={ 4 }>
        <Text { ...sectionTitleProps }>Others</Text>
        <Box>
          <Text as="span" fontWeight="500">Txn type: </Text>
          <Text fontWeight="600" as="span">{ tx.type.value }</Text>
          <Text fontWeight="400" as="span" ml={ 1 } color="gray.500">({ tx.type.eip })</Text>
        </Box>
        <Box>
          <Text as="span" fontWeight="500">Nonce: </Text>
          <Text fontWeight="600" as="span">{ tx.nonce }</Text>
        </Box>
        <Box>
          <Text as="span" fontWeight="500">Position: </Text>
          <Text fontWeight="600" as="span">{ tx.position }</Text>
        </Box>
      </Box>
      <Link fontSize="sm" href={ link('tx_index', { id: tx.hash }) }>More details</Link>
    </>
  );
};

export default TxAdditionalInfo;
