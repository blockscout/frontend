import {
  Text, Popover, PopoverTrigger, PopoverBody, PopoverContent,
  useDisclosure, Button, Skeleton, chakra, useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

import Content from './PopoverContent';
import Stars from './Stars';

type Props = {
  appId: string;
  rating?: number;
  recordId?: string;
  isRatedByUser?: boolean;
  rate: (appId: string, recordId: string | undefined, rating: number) => void;
  isSending?: boolean;
  isLoading?: boolean;
  fullView?: boolean;
};

const Rating = ({ appId, rating, recordId, isRatedByUser, rate, isSending, isLoading, fullView }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const textColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');

  return (
    <Skeleton display="flex" alignItems="center" isLoaded={ !isLoading } minW={ isLoading ? '40px' : 'auto' }>
      { fullView && (
        <>
          <Stars filledIndex={ (rating || 0) - 1 }/>
          <Text fontSize="md" ml={ 1 }>{ rating }</Text>
        </>
      ) }
      <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom" isLazy>
        <PopoverTrigger>
          { fullView ? (
            <Button
              size="sx"
              variant="outline"
              border={ 0 }
              p={ 0 }
              onClick={ onToggle }
              fontSize="md"
              fontWeight="400"
              ml={ 3 }
            >
              Rate it!
            </Button>
          ) : (
            <Button
              size="xs"
              variant="outline"
              border={ 0 }
              p={ 0 }
              onClick={ onToggle }
              fontSize="sm"
              fontWeight="500"
              lineHeight="21px"
              isActive={ isOpen }
            >
              <IconSvg
                name={ rating ? 'star_filled' : 'star_outline' }
                color={ rating ? 'yellow.400' : 'gray.400' }
                boxSize={ 5 }
                mr={ 1 }
              />
              { rating ? (
                <chakra.span color={ textColor } transition="inherit">{ rating }</chakra.span>
              ) : (
                'Rate it!'
              ) }
            </Button>
          ) }
        </PopoverTrigger>
        <PopoverContent w="274px">
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
