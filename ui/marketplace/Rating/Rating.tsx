import { Text } from '@chakra-ui/react';
import React from 'react';

import type { AppRating } from 'types/client/marketplace';

import config from 'configs/app';
import type { EventTypes, EventPayload } from 'lib/mixpanel/index';
import type { PopoverContentProps } from 'toolkit/chakra/popover';
import { PopoverBody, PopoverContent, PopoverRoot } from 'toolkit/chakra/popover';
import { Rating } from 'toolkit/chakra/rating';
import { Skeleton } from 'toolkit/chakra/skeleton';

import Content from './PopoverContent';
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
  popoverContentProps?: PopoverContentProps;
};

const MarketplaceRating = ({
  appId, rating, userRating, rate,
  isSending, isLoading, fullView, canRate, source,
  popoverContentProps,
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
          <Rating defaultValue={ Math.floor(rating?.value || 0) } readOnly key={ rating?.value }/>
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
          <PopoverContent w="250px" { ...popoverContentProps }>
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

export default MarketplaceRating;
