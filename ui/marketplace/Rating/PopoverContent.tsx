import { Text, Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

import Stars from './Stars';

const ratingDescriptions = [ 'Terrible', 'Poor', 'Average', 'Very good', 'Outstanding' ];

type Props = {
  appId: string;
  recordId?: string;
  isRatedByUser?: boolean;
  rate: (appId: string, recordId: string | undefined, rating: number) => void;
  isSending?: boolean;
};

const PopoverContent = ({ appId, recordId, isRatedByUser, rate, isSending }: Props) => {
  const [ hovered, setHovered ] = React.useState(-1);

  const handleMouseOverFactory = React.useCallback((index: number) => () => {
    setHovered(index);
  }, []);

  const handleMouseOut = React.useCallback(() => {
    setHovered(-1);
  }, []);

  const handleRateFactory = React.useCallback((index: number) => () => {
    rate(appId, recordId, index + 1);
  }, [ appId, recordId, rate ]);

  if (isRatedByUser) {
    return (
      <Flex alignItems="center">
        <IconSvg name="check_circle" color="green.500" boxSize={ 8 }/>
        <Text fontSize="md" ml={ 3 }>App is already rated</Text>
      </Flex>
    );
  }

  if (isSending) {
    return (
      <Flex alignItems="center">
        <Spinner size="md"/>
        <Text fontSize="md" ml={ 3 }>Sending your feedback</Text>
      </Flex>
    );
  }

  return (
    <>
      <Text fontWeight="500" fontSize="xs" lineHeight="30px" variant="secondary">
        How was your experience?
      </Text>
      <Flex alignItems="center" h="32px">
        <Stars
          filledIndex={ hovered }
          onMouseOverFactory={ handleMouseOverFactory }
          onMouseOut={ handleMouseOut }
          onClickFactory={ handleRateFactory }
        />
        { hovered >= 0 && (
          <Text fontSize="md" ml={ 2 }>
            { ratingDescriptions[ hovered ] }
          </Text>
        ) }
      </Flex>
    </>
  );
};

export default PopoverContent;
