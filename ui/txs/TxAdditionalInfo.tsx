import { Box, Heading, Text, Flex, Link, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import useLink from 'lib/link/useLink';
import Separator from 'ui/shared/Separator';
import Utilization from 'ui/shared/Utilization';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TxAdditionalInfo = ({ tx }: { tx: any }) => {

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
  };

  const link = useLink();

  return (
    <>
      <Heading as="h4" fontSize="18px" mb={ 6 }>Additional info </Heading>
      <Box { ...sectionProps } mb={ 4 }>
        <Text { ...sectionTitleProps }>Transaction fee</Text>
        <Flex>
          <Text>{ tx.fee.value } Ether</Text>
          <Text variant="secondary" ml={ 1 }>(${ tx.fee.value_usd.toFixed(2) })</Text>
        </Flex>
      </Box>
      <Box { ...sectionProps } mb={ 4 }>
        <Text { ...sectionTitleProps }>Gas limit & usage by transaction</Text>
        <Flex>
          <Text>{ tx.gas_used.toLocaleString('en') }</Text>
          <Separator/>
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
          <Text fontWeight="400" as="span" ml={ 1 }>({ tx.type.eip })</Text>
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
      <Link href={ link('tx_index', { id: tx.hash }) }>More details</Link>
    </>
  );
};

export default TxAdditionalInfo;
