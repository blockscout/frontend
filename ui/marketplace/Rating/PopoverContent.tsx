import { Text, Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

import type { AppRating } from 'types/client/marketplace';

import type { EventTypes, EventPayload } from 'lib/mixpanel/index';
import { Rating } from 'toolkit/chakra/rating';
import IconSvg from 'ui/shared/IconSvg';

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
  const handleValueChange = React.useCallback(({ value }: { value: number }) => {
    rate(appId, rating?.recordId, userRating?.recordId, value, source);
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
        <Text fontWeight="500" textStyle="xs" color="text.secondary">
          { userRating ? 'App is already rated by you' : 'How was your experience?' }
        </Text>
      </Flex>
      <Rating
        defaultValue={ userRating?.value }
        onValueChange={ handleValueChange }
        label={ ratingDescriptions }
        mt={ 1 }
      />
    </>
  );
};

export default PopoverContent;
