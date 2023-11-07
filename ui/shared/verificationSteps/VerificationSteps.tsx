import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import VerificationStep from './VerificationStep';

export interface Props<T extends string> {
  step: T;
  steps: Array<T>;
  isLoading?: boolean;
  rightSlot?: React.ReactNode;
}

const VerificationSteps = <T extends string>({ step, steps, isLoading, rightSlot }: Props<T>) => {
  const currentStepIndex = steps.indexOf(step);

  return (
    <Skeleton
      isLoaded={ !isLoading }
      display="flex"
      gap={ 2 }
      alignItems="center"
      flexWrap="wrap"
    >
      { steps.map((step, index) => (
        <VerificationStep step={ step } isLast={ index === steps.length - 1 && !rightSlot } isPassed={ index <= currentStepIndex } key={ step }/>
      )) }
      { rightSlot }
    </Skeleton>
  );
};

export default VerificationSteps;
