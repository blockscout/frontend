import { Text, Flex, Spinner, Button } from '@chakra-ui/react';
import React from 'react';

import Stars from './Stars';

const ratingDescriptions = [ 'Terrible', 'Poor', 'Average', 'Very good', 'Outstanding' ];

type Props = {
  appId: string;
  recordId?: string;
  userRating: number | undefined;
  rate: (appId: string, recordId: string | undefined, rating: number) => void;
  isSending?: boolean;
};

const PopoverContent = ({ appId, recordId, userRating, rate, isSending }: Props) => {
  const [ hovered, setHovered ] = React.useState(-1);
  const [ selected, setSelected ] = React.useState(-1);

  const handleMouseOverFactory = React.useCallback((index: number) => () => {
    setHovered(index);
  }, []);

  const handleSelectFactory = React.useCallback((index: number) => () => {
    setSelected(index);
  }, []);

  const handleMouseOut = React.useCallback(() => {
    setHovered(-1);
  }, []);

  const handleRate = React.useCallback(() => {
    if (selected < 0) {
      return;
    }
    rate(appId, recordId, selected + 1);
  }, [ appId, recordId, selected, rate ]);

  if (userRating) {
    return (
      <>
        <Text fontWeight="500" fontSize="xs" lineHeight="30px" variant="secondary">
          App is already rated by you
        </Text>
        <Flex alignItems="center" h="32px">
          <Stars filledIndex={ userRating - 1 }/>
          <Text fontSize="md" ml={ 2 }>
            { ratingDescriptions[ userRating - 1 ] }
          </Text>
        </Flex>
      </>
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
          filledIndex={ hovered >= 0 ? hovered : selected }
          onMouseOverFactory={ handleMouseOverFactory }
          onMouseOut={ handleMouseOut }
          onClickFactory={ handleSelectFactory }
        />
        { (hovered >= 0 || selected >= 0) && (
          <Text fontSize="md" ml={ 2 }>
            { ratingDescriptions[ hovered >= 0 ? hovered : selected ] }
          </Text>
        ) }
      </Flex>
      <Button size="sm" px={ 4 } mt={ 3 } onClick={ handleRate } isDisabled={ selected < 0 }>
        Rate it
      </Button>
    </>
  );
};

export default PopoverContent;
