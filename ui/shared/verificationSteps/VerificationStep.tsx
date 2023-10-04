import { Text, Icon, HStack } from '@chakra-ui/react';
import React from 'react';

import arrowIcon from 'icons/arrows/east.svg';
import finalizedIcon from 'icons/finalized.svg';

type Props = {
  step: string;
  isLast: boolean;
  isPassed: boolean;
}

const VerificationStep = ({ step, isLast, isPassed }: Props) => {
  const stepColor = isPassed ? 'green.500' : 'text_secondary';

  return (
    <HStack gap={ 2 } color={ stepColor }>
      <Icon as={ finalizedIcon } boxSize={ 5 }/>
      <Text color={ stepColor }>{ step }</Text>
      { !isLast && <Icon as={ arrowIcon } boxSize={ 5 }/> }
    </HStack>
  );
};

export default VerificationStep;
