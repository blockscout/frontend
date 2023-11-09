import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import VerificationStep from './VerificationStep';

export interface Props<T extends string> {
  step: T;
  steps: Array<T>;
  isLoading?: boolean;
}

const VerificationSteps = <T extends string>({ step, steps, isLoading }: Props<T>) => {
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
        <VerificationStep step={ step } isLast={ index === steps.length - 1 } isPassed={ index <= currentStepIndex } key={ step }/>
      )) }
    </Skeleton>
  );
};

export default VerificationSteps;
