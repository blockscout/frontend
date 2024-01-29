import { HStack, Box } from '@chakra-ui/react';
import React from 'react';

import type { Step } from './types';

import IconSvg from 'ui/shared/IconSvg';

type Props = {
  step: Step;
  isLast: boolean;
  isPassed: boolean;
}

const VerificationStep = ({ step, isLast, isPassed }: Props) => {
  const stepColor = isPassed ? 'green.500' : 'text_secondary';

  return (
    <HStack gap={ 2 } color={ stepColor }>
      <IconSvg name={ isPassed ? 'finalized' : 'unfinalized' } boxSize={ 5 }/>
      <Box color={ stepColor }>{ typeof step === 'string' ? step : step.content }</Box>
      { !isLast && <IconSvg name="arrows/east" boxSize={ 5 }/> }
    </HStack>
  );
};

export default VerificationStep;
