import { Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';

import type { Step } from './types';

import VerificationStep from './VerificationStep';

export interface Props {
  currentStep: string;
  steps: Array<Step>;
  isLoading?: boolean;
  rightSlot?: React.ReactNode;
  className?: string;
}

const VerificationSteps = ({ currentStep, steps, isLoading, rightSlot, className }: Props) => {
  const currentStepIndex = steps.findIndex((step) => {
    const label = typeof step === 'string' ? step : step.label;
    return label === currentStep;
  });

  return (
    <Skeleton
      className={ className }
      isLoaded={ !isLoading }
      display="flex"
      gap={ 2 }
      alignItems="center"
      flexWrap="wrap"
    >
      { steps.map((step, index) => (
        <VerificationStep
          key={ currentStep }
          step={ step }
          isLast={ index === steps.length - 1 && !rightSlot }
          isPassed={ index <= currentStepIndex }
        />
      )) }
      { rightSlot }
    </Skeleton>
  );
};

export default chakra(VerificationSteps);
