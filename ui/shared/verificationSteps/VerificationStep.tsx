import { HStack, Box } from '@chakra-ui/react';
import React from 'react';

import type { Step } from './types';

import IconSvg from 'ui/shared/IconSvg';

type Props = {
  step: Step;
  isLast: boolean;
  isPassed: boolean;
  isPending?: boolean;
  noIcon?: boolean;
};

const VerificationStep = ({ step, isLast, isPassed, isPending, noIcon }: Props) => {
  let stepColor = 'text.secondary';
  if (isPending) {
    stepColor = 'yellow.500';
  } else if (isPassed) {
    stepColor = 'green.500';
  }

  return (
    <HStack gap={ 2 } color={ stepColor }>
      { !noIcon && <IconSvg name={ isPassed ? 'verification-steps/finalized' : 'verification-steps/unfinalized' } boxSize={ 5 }/> }
      <Box color={ stepColor }>{ typeof step === 'string' ? step : step.content }</Box>
      { !isLast && <IconSvg name="arrows/east" boxSize={ 5 }/> }
    </HStack>
  );
};

export default VerificationStep;
