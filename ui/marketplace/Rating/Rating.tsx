import { Text, PopoverTrigger, PopoverBody, PopoverContent, useDisclosure, Skeleton, useOutsideClick, Box } from '@chakra-ui/react';
import React from 'react';

import type { AppRating } from 'types/client/marketplace';

import config from 'configs/app';
import type { EventTypes, EventPayload } from 'lib/mixpanel/index';
import Popover from 'ui/shared/chakra/Popover';

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
  const { isOpen, onToggle, onClose } = useDisclosure();
  // have to implement this solution because popover loses focus on button click inside it (issue: https://github.com/chakra-ui/chakra-ui/issues/7359)
  const popoverRef = React.useRef(null);
  useOutsideClick({ ref: popoverRef, handler: onClose });

  if (!isEnabled) {
    return null;
  }

  return (
    <Skeleton
      display="flex"
      alignItems="center"
      isLoaded={ !isLoading }
      w={ (isLoading && !fullView) ? '40px' : 'auto' }
    >
      { fullView && (
        <>
          <Stars filledIndex={ (rating?.value || 0) - 1 }/>
          <Text fontSize="md" ml={ 2 }>{ rating?.value }</Text>
          { rating?.count && <Text variant="secondary" fontSize="md" ml={ 1 }>({ rating?.count })</Text> }
        </>
      ) }
      <Box ref={ popoverRef }>
        <Popover isOpen={ isOpen } placement="bottom" isLazy>
          <PopoverTrigger>
            <TriggerButton
              rating={ rating?.value }
              count={ rating?.count }
              fullView={ fullView }
              isActive={ isOpen }
              onClick={ onToggle }
              canRate={ canRate }
            />
          </PopoverTrigger>
          <PopoverContent w="250px" mx={ 3 }>
            <PopoverBody p={ 4 }>
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
        </Popover>
      </Box>
    </Skeleton>
  );
};

export default Rating;
