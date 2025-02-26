import { Text } from '@chakra-ui/react';
import React from 'react';

import type { AppRating } from 'types/client/marketplace';

import config from 'configs/app';
import type { EventTypes, EventPayload } from 'lib/mixpanel/index';
import { PopoverBody, PopoverContent, PopoverRoot } from 'toolkit/chakra/popover';
import { Skeleton } from 'toolkit/chakra/skeleton';

import Content from './PopoverContent';
import Stars from './Stars';
import TriggerButton from './TriggerButton';
import type { RateFunction } from './useRatings';

const feature = config.features.marketplace;
const isEnabled = feature.isEnabled && feature.rating;

type Props = {
  appId: string;
  rating?: AppRating;
  userRating?: AppRating;
  rate: RateFunction;
  isSending?: boolean;
  isLoading?: boolean;
  fullView?: boolean;
  canRate: boolean | undefined;
  source: EventPayload<EventTypes.APP_FEEDBACK>['Source'];
};

const Rating = ({
  appId, rating, userRating, rate,
  isSending, isLoading, fullView, canRate, source,
}: Props) => {

  if (!isEnabled) {
    return null;
  }

  return (
    <Skeleton
      display="flex"
      alignItems="center"
      loading={ isLoading }
      w={ (isLoading && !fullView) ? '40px' : 'auto' }
    >
      { fullView && (
        <>
          <Stars filledIndex={ (rating?.value || 0) - 1 }/>
          <Text fontSize="md" ml={ 2 }>{ rating?.value }</Text>
          { rating?.count && <Text color="text.secondary" textStyle="md" ml={ 1 }>({ rating?.count })</Text> }
        </>
      ) }
      <PopoverRoot positioning={{ placement: 'bottom' }}>

        <TriggerButton
          rating={ rating?.value }
          count={ rating?.count }
          fullView={ fullView }
          canRate={ canRate }
        />
        { canRate ? (
          <PopoverContent w="250px">
            <PopoverBody>
              <Content
                appId={ appId }
                rating={ rating }
                userRating={ userRating }
                rate={ rate }
                isSending={ isSending }
                source={ source }
              />
            </PopoverBody>
          </PopoverContent>
        ) : <PopoverContent/> }
      </PopoverRoot>
    </Skeleton>
  );
};

export default Rating;
