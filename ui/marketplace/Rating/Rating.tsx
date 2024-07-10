import { Text, PopoverTrigger, PopoverBody, PopoverContent, useDisclosure, Skeleton } from '@chakra-ui/react';
import React from 'react';

import Popover from 'ui/shared/chakra/Popover';

import Content from './PopoverContent';
import Stars from './Stars';
import TriggerButton from './TriggerButton';

type Props = {
  appId: string;
  rating?: number;
  recordId?: string;
  isRatedByUser?: boolean;
  rate: (appId: string, recordId: string | undefined, rating: number) => void;
  isSending?: boolean;
  isLoading?: boolean;
  fullView?: boolean;
  canRate: boolean | undefined;
};

const Rating = ({
  appId, rating, recordId, isRatedByUser, rate,
  isSending, isLoading, fullView, canRate,
}: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Skeleton
      display="flex"
      alignItems="center"
      isLoaded={ !isLoading }
      w={ (isLoading && !fullView) ? '40px' : 'auto' }
    >
      { fullView && (
        <>
          <Stars filledIndex={ (rating || 0) - 1 }/>
          <Text fontSize="md" ml={ 1 }>{ rating }</Text>
        </>
      ) }
      <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom" isLazy>
        <PopoverTrigger>
          <TriggerButton
            rating={ rating }
            fullView={ fullView }
            isActive={ isOpen }
            onClick={ onToggle }
            canRate={ canRate }
          />
        </PopoverTrigger>
        <PopoverContent w="274px" mx={ 3 }>
          <PopoverBody p={ 4 }>
            <Content
              appId={ appId }
              recordId={ recordId }
              isRatedByUser={ isRatedByUser }
              rate={ rate }
              isSending={ isSending }
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Skeleton>
  );
};

export default Rating;
