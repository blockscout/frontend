import { HStack, Box } from '@chakra-ui/react';
import React from 'react';

import type { Step } from './types';

import colors from 'theme/foundations/colors';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  step: Step;
  isLast: boolean;
  isPassed: boolean;
  isPending?: boolean;
}

const VerificationStep = ({ step, isLast, isPassed, isPending }: Props) => {
  let stepColor = 'text_secondary';
  if (isPending) {
    stepColor = colors.yellow[500];
  } else if (isPassed) {
    stepColor = colors.success[500];
  }

  return (
    <HStack gap={ 2 } color={ stepColor }>
      <IconSvg name={ isPassed ? 'verification-steps/finalized' : 'verification-steps/unfinalized' } boxSize={ 5 }/>
      <Box color={ stepColor }>{ typeof step === 'string' ? step : step.content }</Box>
      { !isLast && <IconSvg name="arrows/east" boxSize={ 5 }/> }
    </HStack>
  );
};

export default VerificationStep;
