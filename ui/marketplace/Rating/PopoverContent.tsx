import { Text, Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

import type { AppRating } from 'types/client/marketplace';

import type { EventTypes, EventPayload } from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';

import Stars from './Stars';
import type { RateFunction } from './useRatings';

const ratingDescriptions = [ 'Very bad', 'Bad', 'Average', 'Good', 'Excellent' ];

type Props = {
  appId: string;
  rating?: AppRating;
  userRating?: AppRating;
  rate: RateFunction;
  isSending?: boolean;
  source: EventPayload<EventTypes.APP_FEEDBACK>['Source'];
};

const PopoverContent = ({ appId, rating, userRating, rate, isSending, source }: Props) => {
  const [ hovered, setHovered ] = React.useState(-1);

  const filledIndex = React.useMemo(() => {
    if (hovered >= 0) {
      return hovered;
    }
    return userRating?.value ? userRating?.value - 1 : -1;
  }, [ userRating, hovered ]);

  const handleMouseOverFactory = React.useCallback((index: number) => () => {
    setHovered(index);
  }, []);

  const handleMouseOut = React.useCallback(() => {
    setHovered(-1);
  }, []);

  const handleRateFactory = React.useCallback((index: number) => () => {
    rate(appId, rating?.recordId, userRating?.recordId, index + 1, source);
  }, [ appId, rating, rate, userRating, source ]);

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
      <Flex alignItems="center">
        { userRating && (
          <IconSvg name="verified" color="green.400" boxSize="30px" mr={ 1 } ml="-5px"/>
        ) }
        <Text fontWeight="500" fontSize="xs" lineHeight="30px" variant="secondary">
          { userRating ? 'App is already rated by you' : 'How was your experience?' }
        </Text>
      </Flex>
      <Flex alignItems="center" h="32px">
        <Stars
          filledIndex={ filledIndex }
          onMouseOverFactory={ handleMouseOverFactory }
          onMouseOut={ handleMouseOut }
          onClickFactory={ handleRateFactory }
        />
        { (filledIndex >= 0) && (
          <Text fontSize="md" ml={ 3 }>
            { ratingDescriptions[filledIndex] }
          </Text>
        ) }
      </Flex>
    </>
  );
};

export default PopoverContent;
