import { Text, Icon, HStack } from '@chakra-ui/react';
import React from 'react';

import type { Step } from './types';

import arrowIcon from 'icons/arrows/east.svg';
import finalizedIcon from 'icons/finalized.svg';
import unfinalizedIcon from 'icons/unfinalized.svg';

type Props = {
  step: Step;
  isLast: boolean;
  isPassed: boolean;
}

const VerificationStep = ({ step, isLast, isPassed }: Props) => {
  const stepColor = isPassed ? 'green.500' : 'text_secondary';

  return (
    <HStack gap={ 2 } color={ stepColor }>
      <Icon as={ isPassed ? finalizedIcon : unfinalizedIcon } boxSize={ 5 }/>
      <Text color={ stepColor }>{ typeof step === 'string' ? step : step.content }</Text>
      { !isLast && <Icon as={ arrowIcon } boxSize={ 5 }/> }
    </HStack>
  );
};

export default VerificationStep;
