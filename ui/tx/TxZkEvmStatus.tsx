import { Text, Icon, Skeleton, HStack } from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import arrowIcon from 'icons/arrows/east.svg';
import finalizedIcon from 'icons/finalized.svg';

export interface Props {
  status: Transaction['zkevm_status'];
  isLoading?: boolean;
}

const TxZkEvmStatus = ({ status, isLoading }: Props) => {
  const secondStepColor = status === 'L1 Confirmed' ? 'green.500' : 'text_secondary';
  return (
    <Skeleton
      isLoaded={ !isLoading }
      display="flex"
      gap={ 2 }
      alignItems="center"
      flexWrap="wrap"
    >
      <HStack gap={ 2 }>
        <Icon as={ finalizedIcon } boxSize={ 5 } color="green.500"/>
        <Text color="green.500">Confirmed by Sequencer</Text>
        <Icon as={ arrowIcon } boxSize={ 5 } color="green.500"/>
      </HStack>
      <HStack gap={ 2 }>
        <Icon as={ finalizedIcon } boxSize={ 5 } color={ secondStepColor }/>
        <Text color={ secondStepColor }>L1 Confirmed</Text>
      </HStack>
    </Skeleton>
  );
};

export default TxZkEvmStatus;
